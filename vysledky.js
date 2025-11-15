/* --- Skript 1: Hlavní logika filtrování a řazení --- */
(function cleanupBackslashes(){
  document.querySelectorAll('#resultsTable td, #resultsTable th').forEach(td=>{
    td.textContent = td.textContent.replaceAll('\\+','+').replaceAll('\\-','-');
  });
})();

function normalize(s) {
  return (s||'').toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
}
function parseTimeToSeconds(t) {
  t = (t||'').trim();
  if (!t) return Number.MAX_SAFE_INTEGER;
  const parts = t.split(':').map(Number);
  if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
  if (parts.length === 2) return parts[0]*60 + parts[1];
  if (parts.length === 1) return parts[0];
  return Number.MAX_SAFE_INTEGER;
}
function tratToMeters(s) {
  const x = (s||'').toString().trim().toLowerCase().replace(',', '.');
  if (x.endsWith('km')) { const n = parseFloat(x); return isNaN(n)?Number.MAX_SAFE_INTEGER:Math.round(n*1000); }
  if (x.endsWith('m'))  { const n = parseFloat(x); return isNaN(n)?Number.MAX_SAFE_INTEGER:Math.round(n); }
  return Number.MAX_SAFE_INTEGER;
}
const isAll = v => v === '' || v === 'Vše';

// --- Vazby na DOM + načtení dat ---
const tableEl = document.querySelector('#resultsTable') || document.querySelector('table');
const thead = tableEl.tHead || tableEl.createTHead();
const tbody = tableEl.tBodies[0] || tableEl.appendChild(document.createElement('tbody'));

const headerRow =
  (thead && thead.rows && thead.rows[0])
  ? thead.rows[0]
  : tableEl.querySelector('thead tr') || tableEl.querySelector('tr');

const hdrs = Array.from(headerRow.cells).map(th => th.textContent.trim().toLowerCase());
const colIdx = {
  poradi:    hdrs.findIndex(h => h.startsWith('pořadí')),
  jmeno:     hdrs.findIndex(h => h.startsWith('jméno')),
  tym:       hdrs.findIndex(h => h.startsWith('tým')),
  trat:      hdrs.findIndex(h => h.startsWith('trať')),
  kategorie: hdrs.findIndex(h => h.startsWith('kategorie')),
  cas:       hdrs.findIndex(h => h.startsWith('čas')),
  rok:       hdrs.findIndex(h => h.startsWith('rok')),
};

const originalRows = Array.from(tbody.rows);
const clean = s => (s || '').toString().replace(/\s+/g, ' ').trim();

const DATA = originalRows.map(tr => {
  const cells = Array.from(tr.cells).map(td => (td.textContent || '').trim());
  const tratRaw = clean(cells[colIdx.trat] || '');
  const casRaw  = clean(cells[colIdx.cas]  || '');

  return {
    el:         tr,
    jmeno:      clean(cells[colIdx.jmeno]     || ''),
    tym:        clean(cells[colIdx.tym]       || ''),
    trat:       tratRaw,
    kategorie:  clean(cells[colIdx.kategorie] || ''),
    cas:        casRaw,
    rok:        clean(cells[colIdx.rok]       || ''),
    casSec:     parseTimeToSeconds(casRaw),
    tratM:      tratToMeters(tratRaw)
  };
});

// --- Indexy dostupnosti z DATA ---
const byTrack = new Map();     // "trať" -> { cats:Set, years:Set }
const byTrackCat = new Map();  // "trať|kategorie" -> Set(years)
const byCat = new Map();       // "kategorie" -> { tracks:Set, years:Set }

for (const r of DATA) {
  // byTrack
  if (!byTrack.has(r.trat)) byTrack.set(r.trat, { cats: new Set(), years: new Set() });
  byTrack.get(r.trat).cats.add(r.kategorie);
  byTrack.get(r.trat).years.add(r.rok);

  // byTrackCat
  const tk = `${r.trat}|${r.kategorie}`;
  if (!byTrackCat.has(tk)) byTrackCat.set(tk, new Set());
  byTrackCat.get(tk).add(r.rok);

  // byCat
  if (!byCat.has(r.kategorie)) byCat.set(r.kategorie, { tracks: new Set(), years: new Set() });
  byCat.get(r.kategorie).tracks.add(r.trat);
  byCat.get(r.kategorie).years.add(r.rok);
}

// Pomocník: držet sufix "-kluci"/"-holky" při auto-přepnutí
const sexSuffix = kat => (/-\s*kluci$/i.test(kat) ? 'kluci' : /-\s*holky$/i.test(kat) ? 'holky' : '');

// --- Ovládací prvky ---
const kategorieSel = document.getElementById('category');
const tratSel      = document.getElementById('track');
const rokSel    = document.getElementById('year');
const searchInput  = document.getElementById('searchName');

// --- Hlavní render ---
function render() {
  const kat   = (kategorieSel?.value ?? '');
  const trat  = (tratSel?.value ?? '');
  const rok   = (rokSel?.value ?? '');
  const query = normalize(searchInput?.value ?? '');

  // 1) filtr
  let rows = DATA.filter(r =>
    (isAll(kat)  || r.kategorie === kat) &&
    (isAll(trat) || r.trat      === trat) &&
    (isAll(rok)  || r.rok       === rok) &&
    (!query || normalize(r.jmeno).includes(query))
  );

  // 2) detekce režimů
  const vseVse = isAll(kat) && isAll(trat);
  const groupByTrack = (!isAll(kat) && isAll(trat) && isAll(rok));

  // 3) řazení
  if (vseVse || groupByTrack) {
    // Seskup po tratích, uvnitř podle času
    rows.sort((a,b) =>
      (a.tratM - b.tratM) ||
      (a.casSec - b.casSec) ||
      normalize(a.jmeno).localeCompare(normalize(b.jmeno), 'cs')
    );
  } else {
    // Ostatní režimy: Čas -> Trať
    rows.sort((a,b) =>
      (a.casSec - b.casSec) ||
      (a.tratM - b.tratM) ||
      normalize(a.jmeno).localeCompare(normalize(b.jmeno), 'cs')
    );
  }

  // 4) překreslení + pořadí
  const frag = document.createDocumentFragment();

  if (vseVse || groupByTrack) {
    // pořadí se resetuje při změně tratě
    let currentTrat = null, rank = 0;
    rows.forEach(r => {
      if (r.trat !== currentTrat) { currentTrat = r.trat; rank = 1; }
      r.el.style.display = '';
      if (colIdx.poradi >= 0) r.el.cells[colIdx.poradi].textContent = rank++;
      frag.appendChild(r.el);
    });
  } else {
    // jedno souvislé pořadí 1..N
    rows.forEach((r,i) => {
      r.el.style.display = '';
      if (colIdx.poradi >= 0) r.el.cells[colIdx.poradi].textContent = i+1;
      frag.appendChild(r.el);
    });
  }

  // 5) skryj ostatní řádky a připoj
  const visibleSet = new Set(rows.map(r => r.el));
  originalRows.forEach(tr => { if (!visibleSet.has(tr)) tr.style.display = 'none'; });
  tbody.appendChild(frag);
}

// Zpřístupnit pro jiné skripty (auto‑překlad)
window.render = render;

// === Dynamická kompatibilizace filtrů podle skutečných dat (DATA) ===

// Vyber preferovanou kategorii pro danou trať (držíme -kluci/-holky, když to jde)
function pickCategoryForTrack(track, currentCategory) {
  const entry = byTrack.get(track);
  if (!entry || entry.cats.size === 0) return currentCategory || '';
  const cats = [...entry.cats];
  const want = sexSuffix(currentCategory);
  const sameSex = cats.find(c => sexSuffix(c) === want);
  return sameSex || cats[0];
}

// Vyber preferovaný rok pro kombinaci (trať,kategorie)
function pickYearForTrackCat(track, category, currentYear) {
  const years = byTrackCat.get(`${track}|${category}`) || byTrack.get(track)?.years || new Set();
  if (years.size === 0) return currentYear || '';
  if (currentYear && years.has(currentYear)) return currentYear;
  if (years.size === 1) return [...years][0];
  return ''; // více roků -> necháme "Vše"
}

// Při změně KATEGORIE udrž trať/rok kompatibilní (jen pokud je možností právě 1)
function updateTrackByCategory() {
  const category = kategorieSel?.value || '';

  // Když je kategorie "Vše", nic nevynucuj (ponech trať/rok jak jsou, jen přerendruj)
  if (category === '') { render(); return; }

  // TRAŤ
  let track = tratSel?.value || '';
  const possibleTracks = byCat.get(category)?.tracks || new Set();

  if (!possibleTracks.has(track)) {
    if (possibleTracks.size === 1) {
      // jediná trať -> nastav
      track = [...possibleTracks][0];
    } else {
      // více tratí -> Trať zůstane "Vše"
      track = '';
    }
    if (tratSel) tratSel.value = track;
  }

  // ROK (záleží, zda je trať už konkrétní, nebo stále Vše)
  let yearsSet;
  if (track === '') {
    yearsSet = byCat.get(category)?.years || new Set();                // roky napříč všemi tratěmi této kategorie
  } else {
    yearsSet = byTrackCat.get(`${track}|${category}`) || new Set();    // roky pro konkrétní (trať,kategorie)
  }

  let year = rokSel?.value || '';
  if (yearsSet.size === 1) {
    year = [...yearsSet][0];                      // jediný rok -> nastav
  } else if (year && !yearsSet.has(year)) {
    year = '';                                    // více roků -> nech "Vše"
  }
  if (rokSel) rokSel.value = year;

  render();
}

// Při změně TRATĚ udrž kategorii/rok kompatibilní (jen pokud je možností právě 1)
function updateCategoryByTrack() {
  const track = tratSel?.value || '';

  // Když je trať "Vše", nic nevynucuj (ponech kat/rok jak jsou, jen přerendruj)
  if (track === '') { render(); return; }

  const entry = byTrack.get(track);
  if (!entry) { render(); return; }

  // KATEGORIE
  let category = kategorieSel?.value || '';
  if (!entry.cats.has(category)) {
    if (entry.cats.size === 1) {
      // jediná kategorie pro danou trať -> nastav ji
      category = [...entry.cats][0];
    } else {
      // více kategorií -> Kategorie zůstane "Vše"
      category = '';
    }
    if (kategorieSel) kategorieSel.value = category;
  }

  // ROK (záleží, zda je kategorie konkrétní, nebo stále Vše)
  let yearsSet;
  if (category === '') {
    yearsSet = entry.years || new Set();                                // roky pro danou trať napříč kategoriemi
  } else {
    yearsSet = byTrackCat.get(`${track}|${category}`) || entry.years || new Set();
  }

  let year = rokSel?.value || '';
  if (yearsSet.size === 1) {
    year = [...yearsSet][0];                                            // např. 50 m -> 2022
  } else if (year && !yearsSet.has(year)) {
    year = '';                                                          // více roků -> nech "Vše"
  }
  if (rokSel) rokSel.value = year;

  render();
}

// --- Události ---
document.addEventListener('DOMContentLoaded', () => {
  // Nastavení výchozích hodnot filtrů při prvním načtení
  function setIfExists(id, val1, val2){
    const el=document.getElementById(id);
    if(!el) return;
    const hasVal1 = Array.from(el.options||[]).some(o=>o.value===val1);
    const hasVal2 = val2!==undefined && Array.from(el.options||[]).some(o=>o.value===val2);
    if (hasVal1) el.value = val1; else if (hasVal2) el.value = val2;
  }
  setIfExists('category','Vše','');
  setIfExists('track','3,9 km');
  setIfExists('year','2025');

  // napoj filtry
  document.getElementById('category')?.addEventListener('change', updateTrackByCategory);
  document.getElementById('track')?.addEventListener('change', updateCategoryByTrack);
  document.getElementById('year')?.addEventListener('change', render);
  document.getElementById('searchName')?.addEventListener('input', render);
  // první vykreslení
  render();
});

;
/* --- Skript 2: Back-To-Top button --- */
(function initBackToTop(){
  const style = document.createElement('style');
  style.textContent = `
    :root { --btt-size: 48px; --btt-gap: 16px; --btt-bg: rgb(35, 159, 97); --btt-bg-hover:rgb(21, 130, 65); }
    html { scroll-behavior: smooth; } /* fallback */
    #backToTop {
      position: fixed; right: var(--btt-gap); bottom: var(--btt-gap);
      width: var(--btt-size); height: var(--btt-size);
      border: none; border-radius: 50%; background: var(--btt-bg); color: #fff;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 20px; cursor: pointer; z-index: 9999;
      box-shadow: 0 6px 16px rgba(0,0,0,.2);
      opacity: 0; visibility: hidden; pointer-events: none; transform: translateY(8px);
      transition: opacity .2s ease, transform .2s ease, visibility .2s;
    }
    #backToTop:hover { background: var(--btt-bg-hover); }
    #backToTop.show { opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0); }
  `;
  // Styly pro BTT se vkládají přímo odsud, ale jsou přepsány vaším CSS souborem (Blok 9 a 10)
  document.head.appendChild(style); 

  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Zpět nahoru');
  btn.setAttribute('title', 'Zpět nahoru');
  btn.setAttribute('data-html2canvas-ignore', 'true'); // nebude ve výstupu PDF
  btn.innerHTML = '▲';
  document.body.appendChild(btn);

  const showAfter = 200; // px
  const onScroll = () => {
    if (window.scrollY > showAfter) btn.classList.add('show');
    else btn.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    // programaticky hladký scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // inicializace (pro případ reloadu doprostřed stránky)
  onScroll();
})();

;
/* --- Skript 3: Back-To-Top mobilní patch --- */
(function(){
  const btn = document.getElementById('backToTop');
  if(!btn) return;
  const SHOW_AFTER = 200;
  const wrap = document.getElementById('resultsWrapper');
  const toggle = document.getElementById('toggleCols');
  const mq = window.matchMedia('(max-width: 768px)');

  function isMobile(){ return mq.matches; }
  function scroller(){
    return (isMobile() && document.body.classList.contains('show-all-cols') && wrap) ? wrap : window;
  }
  function currentY(src){ return (src===window) ? (window.scrollY||0) : src.scrollTop; }
  function onScroll(){
    const src = scroller();
    const y = currentY(src);
    if (y > SHOW_AFTER) btn.classList.add('show'); else btn.classList.remove('show');
  }

  // Listen to both window and wrapper; our handler sets final state
  window.addEventListener('scroll', onScroll, {passive:true});
  if (wrap) wrap.addEventListener('scroll', onScroll, {passive:true});
  mq.addEventListener ? mq.addEventListener('change', onScroll) : mq.addListener(onScroll);

  // Override click in capture phase to prevent previous listeners when inner scroller is active
  btn.addEventListener('click', function(ev){
    const src = scroller();
    if (src !== window) {
      ev.preventDefault(); ev.stopImmediatePropagation();
      src.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, {capture:true});

  if (toggle) toggle.addEventListener('click', function(){ setTimeout(onScroll, 0); });

  // Initial
  onScroll();
})();

;
/* --- Skript 4: Přepínač sloupců na mobilu --- */
(function initToggleAllCols(){
  const btn = document.getElementById('toggleCols');
  if (!btn) return;
  function updateLabel(){ btn.textContent = document.body.classList.contains('show-all-cols') ? 'Skrýt sloupce' : 'Zobrazit všechny sloupce'; }
  btn.addEventListener('click', () => {
    document.body.classList.toggle('show-all-cols');
    updateLabel();
  });
  updateLabel();
})();

;
/* --- Skript 5: Logika exportu do Excelu --- */
(function() {
  
  // Nyní, když jsou soubory lokální, fallback 'loadScriptOnce' není potřeba,
  // ale ponecháme ho pro případnou budoucí robustnost.
  
  function loadScriptOnce(src) {
    if (!window._loadScriptPromises) window._loadScriptPromises = {};
    if (window._loadScriptPromises[src]) return window._loadScriptPromises[src];
    
    window._loadScriptPromises[src] = new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
      const s = document.createElement('script');
      s.src = src; s.defer = true;
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error('Nepodařilo se načíst: ' + src));
      document.head.appendChild(s);
    });
    return window._loadScriptPromises[src];
  }

async function ensureXLSX() {
    // 1. Kontrola, zda se načetlo z HTML
    if (window.XLSX && XLSX.utils && XLSX.writeFile) return true;
    
    // 2. Záloha: načtení lokální cesty
    console.warn('Nepodařilo se načíst XLSX z HTML, zkouším záložní lokální cestu...');
    const SHEETJS_PRIMARY = "xlsx.full.min.js"; // Lokální cesta
    try { await loadScriptOnce(SHEETJS_PRIMARY); } catch (_) {}
    return !!(window.XLSX && XLSX.utils && XLSX.writeFile);
  }

  // ====== Detekce in‑app prohlížečů (FB/IG WebView) – info/hláška ======
  function isInAppBrowser() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /FBAN|FBAV|FB_IAB|Instagram/i.test(ua);
  }

  // ====== Získání pouze VIDITELNÝCH (filtrovaných) řádků tabulky ======
  function getVisibleTableData(tableId) {
    const table = document.getElementById(tableId);
    if (!table) throw new Error(`Tabulka #${tableId} nenalezena.`);
    const rows = [];

    const headRow = table.tHead ? table.tHead.querySelector('tr') : null;
    if (headRow) rows.push(Array.from(headRow.cells).map(c => c.innerText.trim()));

    const body = table.tBodies && table.tBodies[0] ? table.tBodies[0] : table.querySelector('tbody');
    const trs = body ? Array.from(body.rows) : Array.from(table.querySelectorAll('tr'));
    for (const tr of trs) {
      const cs = getComputedStyle(tr);
      if (tr.hidden || cs.display === 'none') continue;
      const row = Array.from(tr.cells).map(td => (td.innerText || '').replace(/\s+/g, ' ').trim());
      if (row.length) rows.push(row);
    }
    return rows;
  }

  // ====== CSV fallback (BOM + ; kvůli českému Excelu) ======
  function aoaToCSV(aoa) {
    const esc = v => {
      const s = (v ?? '').toString().replace(/"/g, '""');
      return /[",;\n]/.test(s) ? `"${s}"` : s;
    };
    const csv = aoa.map(r => r.map(esc).join(';')).join('\n');
    return '\uFEFF' + csv; // BOM
  }

  // ====== Hlavní export: XLSX → sdílení XLSX → přímé stažení XLSX → CSV ======
  async function exportXLSXFirst(tableId, baseName='vysledky') {
    const data = getVisibleTableData(tableId);
    if (!data.length) { alert('Není co exportovat.'); return; }

    // A) zajisti načtení SheetJS
    const hasXLSX = await ensureXLSX();
    
    // Nyní by tato kontrola měla být zbytečná, ale pro jistotu...
    if (!hasXLSX) {
        alert('Chyba: Knihovna pro export do Excelu se nenačetla.');
        return;
    }

    // B) POKUS 1: XLSX přes writeFile (nejčistší cesta v Chrome/Edge/Firefox)
    if (hasXLSX) {
      try {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Vysledky');
        XLSX.writeFile(wb, `${baseName}.xlsx`, { compression: true }); // přímé stažení
        return;
      } catch (e) {
        console.warn('[export] writeFile selhal, zkouším sdílení XLSX', e);
      }

      // C) POKUS 2: vygenerovat XLSX a zkusit sdílení (mobily), jinak stáhnout blob
      try {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Vysledky');
        const ab = XLSX.write(wb, { bookType: 'xlsx', type: 'array', compression: true });
        const xBlob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const xFile = new File([xBlob], `${baseName}.xlsx`, { type: xBlob.type });

        if (navigator.canShare && navigator.canShare({ files: [xFile] })) {
          await navigator.share({ files: [xFile], title: baseName });
          return;
        } else {
          const url = URL.createObjectURL(xBlob);
          const a = document.createElement('a');
          a.href = url; a.download = `${baseName}.xlsx`;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 15000);
          return;
        }
      } catch (e) {
        console.warn('[export] sdílení/stažení XLSX blob selhalo, padám na CSV', e);
      }
    }

    // D) CSV fallback (obzvlášť pro Messenger/Instagram WebView)
    const csv = aoaToCSV(data);
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);

    if (isInAppBrowser()) {
      window.location.href = dataUri; // otevři obsah; uživatel uloží/naimportuje
      setTimeout(() => {
        alert('Pro spolehlivé stažení XLSX otevři stránku v Safari/Chrome přes „Otevřít v prohlížeči“ a export zopakuj. In‑app prohlížeče Messenger/Instagram JS stahování často omezují.');
      }, 600);
      return;
    }

    // běžný prohlížeč – stáhnout CSV
    const a = document.createElement('a');
    a.href = dataUri; a.download = `${baseName}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
  }

  // Připojení tlačítka po načtení DOM
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('exportBtn');
    if (btn) btn.addEventListener('click', () => exportXLSXFirst('resultsTable'));
  });
})();

;
/* --- Skript 5.5: Logika exportu do PDF --- */
(function() {
  // --- Pomocné funkce (jsou v izolovaném scope, takže je potřeba je tu mít) ---
  
  function loadScriptOnce(src) {
    if (!window._loadScriptPromises) window._loadScriptPromises = {};
    if (window._loadScriptPromises[src]) return window._loadScriptPromises[src];
    
    window._loadScriptPromises[src] = new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
      const s = document.createElement('script');
      s.src = src; s.defer = true;
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error('Nepodařilo se načíst: ' + src));
      document.head.appendChild(s);
    });
    return window._loadScriptPromises[src];
  }

async function ensureJSPDF() {
    // 1. Kontrola, zda se načetlo z HTML
    if (window.jspdf && window.jspdf.jsPDF && typeof window.jspdf.jsPDF.prototype.autoTable === 'function') {
      console.log('jsPDF knihovny úspěšně načteny z HTML.');
      return true;
    }
    
    // 2. Záloha: načtení lokálních cest
    console.warn('Nepodařilo se načíst jsPDF z HTML, zkouším záložní lokální cesty...');

    const JSPDF_LIB_FALLBACK = "jspdf.umd.min.js";
    const AUTOTABLE_LIB_FALLBACK = "jspdf.plugin.autotable.min.js";
    
    try {
      // Načteme je postupně
      await loadScriptOnce(JSPDF_LIB_FALLBACK);
      await loadScriptOnce(AUTOTABLE_LIB_FALLBACK);
      await loadScriptOnce(FONT_LIB_FALLBACK); 
    } catch (e) {
      console.error('Nepodařilo se načíst lokální knihovny pro PDF.', e);
      return false; // Zde se vygeneruje hláška
    }
    
    // Finální kontrola
    return !!(window.jspdf && window.jspdf.jsPDF && typeof window.jspdf.jsPDF.prototype.autoTable === 'function');
  }

  function getVisibleTableData(tableId) {
    const table = document.getElementById(tableId);
    if (!table) throw new Error(`Tabulka #${tableId} nenalezena.`);
    const rows = [];

    const headRow = table.tHead ? table.tHead.querySelector('tr') : null;
    if (headRow) rows.push(Array.from(headRow.cells).map(c => c.innerText.trim()));

    // ***** TOTO JE OPRAVENÝ ŘÁDEK (OPRAVA MÉ CHYBY S PŘEKLEPEM) *****
    const body = table.tBodies && table.tBodies[0] ? table.tBodies[0] : table.querySelector('tbody');
    // *******************************************************************

    const trs = body ? Array.from(body.rows) : Array.from(table.querySelectorAll('tr'));
    for (const tr of trs) {
      const cs = getComputedStyle(tr);
      if (tr.hidden || cs.display === 'none') continue; // Klíčová podmínka
      const row = Array.from(tr.cells).map(td => (td.innerText || '').replace(/\s+/g, ' ').trim());
      if (row.length) rows.push(row);
    }
    return rows;
  }
  
  function isInAppBrowser() {
     const ua = navigator.userAgent || navigator.vendor || window.opera;
     return /FBAN|FBAV|FB_IAB|Instagram/i.test(ua);
  }

  // --- Hlavní funkce exportu do PDF ---
  async function exportPDF(tableId, baseName='vysledky') {
    const btn = document.getElementById('exportPdfBtn');
    try {
      const data = getVisibleTableData(tableId);
      if (!data.length) { alert('Není co exportovat.'); return; }

      if (btn) {
        btn.textContent = 'Generuji PDF...';
        btn.disabled = true;
      }

      // 1. Zajistíme, že jsou knihovny načtené
      const hasJSPDF = await ensureJSPDF();
      if (!hasJSPDF) {
        // Tato hláška by se už neměla objevit, když jsou soubory lokální
        alert('Chyba: Knihovny pro export do PDF se nepodařilo načíst.');
        return;
      }
      
      // 2. Pojistka pro in-app
      if (isInAppBrowser()) {
         alert('Pro export do PDF prosím otevřete stránku ve svém běžném prohlížeči (např. Chrome nebo Safari).');
         return;
      }

      // 3. Vytvoření PDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Font je nyní načten lokálně, takže 'Noto Sans' bude fungovat
      const head = [data[0]]; // Hlavička je první řádek dat
      const body = data.slice(1); // Tělo jsou všechny ostatní řádky

      doc.autoTable({
        head: head,
        body: body,
        styles: {
          font: 'Noto Sans', // TOTO JE KLÍČOVÉ PRO DIATRITIKU
          fontStyle: 'normal',
          fontSize: 7, 
          cellPadding: 1.5,
        },
        headStyles: {
          fillColor: [224, 224, 224], 
          textColor: [0, 0, 0],
          fontSize: 7,
        },
        alternateRowStyles: {
          fillColor: [242, 242, 242],
        },
        tableWidth: 'auto',
        margin: { left: 5, right: 5, top: 10, bottom: 10 },
      });
      
      // 4. Uložení souboru
      doc.save(`${baseName}.pdf`);

    } catch (e) {
      console.error('Chyba při exportu PDF:', e);
      alert('Nastala chyba při exportu do PDF.');
    } finally {
      // Vrátíme tlačítko do původního stavu
      if (btn) {
        btn.textContent = 'Export do PDF';
        btn.disabled = false;
      }
    }
  }

  // Připojení listeneru k novému tlačítku
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('exportPdfBtn');
    if (btn) btn.addEventListener('click', () => exportPDF('resultsTable'));
  });
})();

;
/* --- Skript 6: Patch pro In-App prohlížeče (FB/Messenger) --- */
/* --- UPRAVENÁ VERZE PRO EXCEL I PDF --- */
(function(){
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isAndroid = /Android/i.test(ua);
  const isiOS = /iPhone|iPad|iPod/i.test(ua);
  const isInApp = /(FBAN|FBAV|FB_IAB|Instagram|Messenger)/i.test(ua);

  function $(s){ return document.querySelector(s); }
  function getState(){
    return {
      cat: $('#category')?.value || '',
      trk: $('#track')?.value || '',
      yr:  $('#year')?.value  || '',
      q:   $('#searchName')?.value || ''
    };
  }
  function setIfExists(sel, val){
    const el = $(sel); if (!el || !val) return false;
    if (el.tagName === 'SELECT'){
      let opt = Array.from(el.options).find(o => o.value === val)
             || Array.from(el.options).find(o => (o.text||'').trim() === val);
      if (!opt) return false; el.value = opt.value;
    } else { el.value = val; }
    el.dispatchEvent(new Event('change',{bubbles:true}));
    el.dispatchEvent(new Event('input',{bubbles:true}));
    return true;
  }
  async function applyFiltersFromQuery(){
    const p = new URLSearchParams(location.search);
    const applied = [
      setIfExists('#category',   p.get('cat')),
      setIfExists('#track',      p.get('trk')),
      setIfExists('#year',       p.get('yr')),
      setIfExists('#searchName', p.get('q')),
    ].some(Boolean);
    if (typeof window.applyFilters === 'function'){ try { window.applyFilters(); } catch(e){} }
    await new Promise(r => requestAnimationFrame(()=>requestAnimationFrame(r)));
    return applied;
  }

  // A) In‑app: zachytit klik na Export, přenést filtry, poslat uživatele ven
  document.addEventListener('click', function(ev){
    // ZMĚNA: Poslouchá na společnou třídu .export-btn
    const btn = ev.target.closest('.export-btn');
    if (!btn || !isInApp) return;
    
    ev.preventDefault();
    ev.stopImmediatePropagation();

    // ZMĚNA: Získá typ exportu (xlsx/pdf) z data atributu
    const exportType = btn.dataset.exportType;
    if (!exportType) return; // Neznámé tlačítko

    const url = new URL(location.href);
    // ZMĚNA: Použije nový parametr 'autoexport' místo 'autoxls'
    url.searchParams.set('autoexport', exportType); 
    url.searchParams.delete('autoxls'); // Smaže starý parametr pro jistotu
    
    const st = getState();
    if (st.cat) url.searchParams.set('cat', st.cat);
    if (st.trk) url.searchParams.set('trk', st.trk);
    if (st.yr)  url.searchParams.set('yr',  st.yr);
    if (st.q)   url.searchParams.set('q',   st.q);

    if (isAndroid){
      const intent = 'intent://' + url.href.replace(/^https?:\/\//,'') +
        '#Intent;scheme=' + (location.protocol.replace(':','')) +
        ';package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(url.href) + ';end';
      window.location.href = intent;
      setTimeout(()=>{ try { if (!document.hidden) alert('Pro export klikněte OK a poté dejte Pokračovat, případně otevřít stránku v prohlížeči mimo Facebook/Messenger.'); } catch(e){} }, 1500);
      return;
    }
    if (isiOS){
      const a = document.createElement('a');
      a.href = url.href; a.target='_blank'; a.rel='noopener'; a.style.display='none';
      document.body.appendChild(a); a.click(); setTimeout(()=>a.remove(),50);
      return;
    }
    location.href = url.href;
  }, true);

  // B) Venku: když je ?autoexport=... → aplikuj filtry a automaticky spusť export
  document.addEventListener('DOMContentLoaded', async function(){
    const p = new URLSearchParams(location.search);
    // ZMĚNA: Kontroluje 'autoexport' (a pro zpětnou kompatibilitu i 'autoxls')
    const exportType = p.get('autoexport') || (p.get('autoxls') === '1' ? 'xlsx' : null);
    if (!exportType) return;
    
    if (window.__autoExportDone) return; window.__autoExportDone = true;

    await applyFiltersFromQuery();
    
    // ZMĚNA: Vybere správné tlačítko podle typu
    let btnToClick = null;
    if (exportType === 'xlsx') {
        btnToClick = $('#exportBtn');
    } else if (exportType === 'pdf') {
        btnToClick = $('#exportPdfBtn');
    }

    // (Ponechán fallback na starou funkci 'downloadXSlsxNow', i když ji kód neobsahuje)
    if (exportType === 'xlsx' && typeof window.downloadXlsxNow === 'function') {
        return setTimeout(()=>window.downloadXlsxNow(), 200);
    }
    
    if (btnToClick) {
        // Mírně delší prodleva, aby se PDF knihovny stihly načíst
        setTimeout(()=>{ try{ btnToClick.click(); }catch(e){} }, 300); 
    }
  });
})();

;
/* --- Skript 7: Dynamické plnění filtrů (zůstal funkčně oddělený) --- */
(function() {
  const yearSel = document.getElementById('year');
  const trackSel = document.getElementById('track');
  const catSel   = document.getElementById('category');
  const table    = document.getElementById('resultsTable');
  if (!yearSel || !trackSel || !catSel || !table) return;
  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  // ===== 1) Načtení dat z tabulky (POZNÁMKA: Toto je druhé načtení, ponecháno pro 1:1 funkčnost) =====
  // Pořadí | Jméno | Tým | Trať | Kategorie | Čas | Rok
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const DATA = rows.map(tr => {
    const tds = tr.querySelectorAll('td');
    return {
      poradi:    (tds[0]?.textContent || '').trim(),
      jmeno:     (tds[1]?.textContent || '').trim(),
      tym:       (tds[2]?.textContent || '').trim(),
      trat:      (tds[3]?.textContent || '').trim(),
      kategorie: (tds[4]?.textContent || '').trim(),
      cas:       (tds[5]?.textContent || '').trim(),
      rok:       (tds[6]?.textContent || '').trim()
    };
  });

  const uniq = (arr) => Array.from(new Set(arr))
    .filter(v => v !== '')
    .sort((a,b)=>a.localeCompare(b,'cs'));

  const allTracks = uniq(DATA.map(d => d.trat));
  const allCats   = uniq(DATA.map(d => d.kategorie));

  // ===== 2) Helper pro naplnění selectů =====
  function fillOptions(sel, values) {
    const keep = sel.value;
    sel.innerHTML = '';

    // Přidáme "— Vše —" s value=""
    const oAll = document.createElement('option');
    oAll.value = '';
    oAll.textContent = '— Vše —'; // Původně bylo '— Vše —', měním na 'Vše' pro konzistenci
    // Oprava: Ponechávám '— Vše —', jak bylo v kódu.
    sel.appendChild(oAll);

    values.forEach(v => {
      const o = document.createElement('option');
      o.value = v;
      o.textContent = v;
      sel.appendChild(o);
    });

    // Zachovej dřívější výběr, pokud je stále platný
    if (keep && values.includes(keep)) sel.value = keep;
    else sel.value = '';
  }

  // ===== 3) Přepočet domén podle aktuálních voleb =====
  function populateDependentFilters() {
    const y = (yearSel.value || '').trim();   // '' = Vše
    const t = (trackSel.value || '').trim();  // '' = Vše

    // 3a) Doména "Trať" se řídí jen rokem (ne tratí)
    let currentTracks = allTracks;
    if (y) {
        currentTracks = uniq(DATA.filter(d => d.rok === y).map(d => d.trat));
    }
    // Zachováme stávající hodnotu tratě, pokud je v novém seznamu
    const currentTrackValue = trackSel.value;
    fillOptions(trackSel, currentTracks);
    if (currentTracks.includes(currentTrackValue)) {
        trackSel.value = currentTrackValue;
    }


    // 3b) Doména "Kategorie" je průnik podle Rok × Trať (pokud jsou vybrané)
    let filtered = DATA.slice();
    if (y) filtered = filtered.filter(d => d.rok === y);
    // Použijeme aktuální (možná právě nastavenou) hodnotu tratě
    const t_updated = (trackSel.value || '').trim();
    if (t_updated) filtered = filtered.filter(d => d.trat === t_updated);
    
    const cats = uniq(filtered.map(d => d.kategorie));
    
    // Zachováme stávající hodnotu kategorie, pokud je v novém seznamu
    const currentCatValue = catSel.value;
    fillOptions(catSel, cats);
    if (cats.includes(currentCatValue)) {
        catSel.value = currentCatValue;
    }
  }

  // ===== 4) Eventy a BOOTSTRAP při prvním načtení =====
  yearSel.addEventListener('change', () => {
      populateDependentFilters();
      // Po změně roku a naplnění tratí/kategorií je třeba spustit i hlavní render
      if (typeof window.render === 'function') {
          window.render();
      }
  });

  trackSel.addEventListener('change', () => {
      populateDependentFilters(); // Změna tratě ovlivní jen kategorie, ne tratě
      // Po změně tratě je třeba spustit i hlavní render
      if (typeof window.render === 'function') {
          window.render();
      }
  });
  
  // (Handler pro catSel již existuje v Skriptu 1, ten se stará o render)

  // Zajisti správný stav hned po otevření (výchozí Rok = 2025 u tebe)
  const boot = () => {
    populateDependentFilters(); // zúží Trať/Kategorii podle aktuální hodnoty Rok/Trať
    
    // Ujistíme se, že hlavní render proběhne po tomto bootu
    if (typeof window.render === 'function') {
        // Render by se měl spustit v DOMContentLoaded v Skriptu 1,
        // ale pro jistotu (pokud by se pořadí změnilo) to můžeme volat i zde.
        // Skript 1 by to měl ale již řešit.
    }
  };

  if (document.readyState === 'complete') {
    // Počkej 2 snímky, ať doběhnou ostatní skripty/render
    requestAnimationFrame(() => requestAnimationFrame(boot));
  } else {
    window.addEventListener('load', () => {
      requestAnimationFrame(() => requestAnimationFrame(boot));
    }, { once: true });
  }
})();