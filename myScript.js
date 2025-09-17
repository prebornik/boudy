$(document).ready(function () {
    $('img#contentBig').hover(function () {
        $(this).addClass('transition');
    }, function () {
        $(this).removeClass('transition');
    })
});

$(document).ready(function () {
    $('img#contentSmall').hover(function () {
        $(this).addClass('transition');
    }, function () {
        $(this).removeClass('transition');
    })
});

$(document).ready(function () {
    $('img#contentRecordXsKontakt').hover(function () {
        $(this).addClass('transitionRecordXs');
    }, function () {
        $(this).removeClass('transitionRecordXs');
    })
});

$(document).ready(function () {
    $("img.hoverColorLg1").mouseenter(function () {
        $("a.na1").addClass('color');
    });
    $("img.hoverColorLg1").mouseleave(function () {
        $("a.na1").removeClass('color');
    });
});

$(document).ready(function () {
    $("img.hoverColorLg2").mouseenter(function () {
        $("a.na2").addClass('color');
    });
    $("img.hoverColorLg2").mouseleave(function () {
        $("a.na2").removeClass('color');
    });
});

$(document).ready(function () {
    $("img.hoverColorLg3").mouseenter(function () {
        $("a.na3").addClass('color');
    });
    $("img.hoverColorLg3").mouseleave(function () {
        $("a.na3").removeClass('color');
    });
});

$(document).ready(function () {
    $("img.hoverColorLg4").mouseenter(function () {
        $("a.na4").addClass('color');
    });
    $("img.hoverColorLg4").mouseleave(function () {
        $("a.na4").removeClass('color');
    });
});

$(document).ready(function () {
    $("img.hoverColorLg5").mouseenter(function () {
        $("a.na5").addClass('color');
    });
    $("img.hoverColorLg5").mouseleave(function () {
        $("a.na5").removeClass('color');
    });
});

$(document).ready(function () {
    $("img.hoverColorLg6").mouseenter(function () {
        $("a.na6").addClass('color');
    });
    $("img.hoverColorLg6").mouseleave(function () {
        $("a.na6").removeClass('color');
    });
});

$(document).ready(function () {
    $("img.hoverColorLg7").mouseenter(function () {
        $("a.na7").addClass('color');
    });
    $("img.hoverColorLg7").mouseleave(function () {
        $("a.na7").removeClass('color');
    });
});

$(document).ready(function () {
    $("img.hoverColorLg8").mouseenter(function () {
        $("a.na8").addClass('color');
    });
    $("img.hoverColorLg8").mouseleave(function () {
        $("a.na8").removeClass('color');
    });
});

$(document).ready(function () {
    $("img.hoverColorLg9").mouseenter(function () {
        $("a.na9").addClass('color');
    });
    $("img.hoverColorLg9").mouseleave(function () {
        $("a.na9").removeClass('color');
    });
});

$(document).ready(function () {
    $("img.hoverColorLg10").mouseenter(function () {
        $("a.na10").addClass('color');
    });
    $("img.hoverColorLg10").mouseleave(function () {
        $("a.na10").removeClass('color');
    });
});

$(document).ready(function () {
    $('div#contentRecord').hover(function () {
        $(this).addClass('transitionRecord');
    }, function () {
        $(this).removeClass('transitionRecord');
    })
});

$(document).ready(function () {
    $('img#contentRecord').hover(function () {
        $(this).addClass('transitionRecord');
    }, function () {
        $(this).removeClass('transitionRecord');
    })
});

$(document).ready(function () {
    $('img#contentRecordMd').hover(function () {
        $(this).addClass('transitionRecordMd');
    }, function () {
        $(this).removeClass('transitionRecordMd');
    })
});

$(document).ready(function () {
    $('img#contentRecordXsKontakt').hover(function () {
        $(this).addClass('transitionRecordXs');
    }, function () {
            $(this).removeClass('transitionRecordXs');
    })
});

$(document).ready(function () {
    $('img#contentRecordSm').hover(function () {
        $(this).addClass('transitionRecordSm');
    }, function () {
        $(this).removeClass('transitionRecordSm');
    })
});


$(document).ready(function () {
    $('div#contentRecordMd').hover(function () {
        $(this).addClass('transitionRecordMd');
    }, function () {
        $(this).removeClass('transitionRecordMd');
    })
});

$(document).ready(function () {
    $('div#contentRecordXs').hover(function () {
        $(this).addClass('transitionRecordXs');
    }, function () {
        $(this).removeClass('transitionRecordXs');
    })
});

$(document).ready(function () {
    $("div#contentRecord").hover(function () {
        $(this).find("div.nextRecords").toggleClass("visibleHoverRecords");
    });
});

$(document).ready(function () {
    $('img#contentNextRecords').hover(function () {
        $(this).addClass('transitionNextRecords');
    }, function () {
            $(this).removeClass('transitionNextRecords');
    })
});

$(document).ready(function () {
    $('img#contentNextRecordsVita').hover(function () {
        $(this).addClass('transitionNextRecords');
    }, function () {
            $(this).removeClass('transitionNextRecords');
    })
});

$(document).ready(function () {
    $("div#contentRecord").hover(function () {
        $(this).find("div.nextRecordsNaVysku").toggleClass("visibleHoverRecords");
    });
});

$(document).ready(function () {
    $('img#contentNextRecordsNaVysku').hover(function () {
        $(this).addClass('transitionNextRecords');
    }, function () {
            $(this).removeClass('transitionNextRecords');
    })
});


$(document).ready(function () {
    $('div#contentRecord').hover(function () {
        $(this).parent().prev().prev().addClass('hoverRecords');
    }, function () {
        $(this).parent().prev().prev().removeClass('hoverRecords');
    })
});

$(document).ready(function () {
    $('div#contentRecord').hover(function () {
        $(this).parent().prev().prev().prev().addClass('hoverRecordsPrev');
    }, function () {
            $(this).parent().prev().prev().prev().removeClass('hoverRecordsPrev');
    })
});

$(document).ready(function () {
    $('div#contentRecord').hover(function () {
        $(this).parent().prev().prev().prev().prev().addClass('hoverRecordsPrevPrev');
    }, function () {
            $(this).parent().prev().prev().prev().prev().removeClass('hoverRecordsPrevPrev');
    })
});

$(document).ready(function () {
    $('div#contentRecordFirst').hover(function () {
        $(this).parent().prev().prev().addClass('hoverRecordsFirst');
    }, function () {
            $(this).parent().prev().prev().removeClass('hoverRecordsFirst');
    })
});

$(document).ready(function () {
    $('div#contentRecordFirst').hover(function () {
        $(this).parent().prev().prev().prev().addClass('hoverRecordsPrevFirst');
    }, function () {
            $(this).parent().prev().prev().prev().removeClass('hoverRecordsPrevFirst');
    })
});

$(document).ready(function () {
    $('div#contentRecordFirst').hover(function () {
        $(this).parent().prev().prev().prev().prev().addClass('hoverRecordsPrevPrevFirst');
    }, function () {
            $(this).parent().prev().prev().prev().prev().removeClass('hoverRecordsPrevPrevFirst');
    })
});

$(document).ready(function () {
    $("div#contentRecordFirst").hover(function () {
        $(this).find("div.nextRecordsFirst").toggleClass("visibleHoverRecordsFirst");
    });
});

$(document).ready(function () {
    $('img#contentNextRecordsFirst').hover(function () {
        $(this).addClass('transitionNextRecordsFirst');
    }, function () {
            $(this).removeClass('transitionNextRecordsFirst');
    })
});

$(document).ready(function () {
    $('div#contentRecordFirst').hover(function () {
        $(this).addClass('transitionRecordFirst');
    }, function () {
            $(this).removeClass('transitionRecordFirst');
    })
});

$(document).ready(function () {
    $("div#contentRecordMd").hover(function () {
        $(this).find("div.nextRecords").toggleClass("visibleHoverRecords");
    });
});

$(document).ready(function () {
    $('div#contentRecordMd').hover(function () {
        $(this).parent().prev().prev().addClass('hoverRecordsMd');
    }, function () {
            $(this).parent().prev().prev().removeClass('hoverRecordsMd');
    })
});

$(document).ready(function () {
    $('div#contentRecordMd').hover(function () {
        $(this).parent().prev().prev().prev().addClass('hoverRecordsMdPrev');
    }, function () {
            $(this).parent().prev().prev().prev().removeClass('hoverRecordsMdPrev');
    })
});

$(document).ready(function () {
    $('div#contentRecordMd').hover(function () {
        $(this).parent().prev().prev().prev().prev().addClass('hoverRecordsMdPrevPrev');
    }, function () {
            $(this).parent().prev().prev().prev().prev().removeClass('hoverRecordsMdPrevPrev');
    })
});

$(document).ready(function () {
    $('div#contentRecordFirstMd').hover(function () {
        $(this).parent().prev().prev().addClass('hoverRecordsMdFirst');
    }, function () {
            $(this).parent().prev().prev().removeClass('hoverRecordsMdFirst');
    })
});

$(document).ready(function () {
    $('div#contentRecordFirstMd').hover(function () {
        $(this).parent().prev().prev().prev().addClass('hoverRecordsMdPrevFirst');
    }, function () {
            $(this).parent().prev().prev().prev().removeClass('hoverRecordsMdPrevFirst');
    })
});

$(document).ready(function () {
    $('div#contentRecordFirstMd').hover(function () {
        $(this).parent().prev().prev().prev().prev().addClass('hoverRecordsMdPrevPrevFirst');
    }, function () {
            $(this).parent().prev().prev().prev().prev().removeClass('hoverRecordsMdPrevPrevFirst');
    })
});

$(document).ready(function () {
    $("div#contentRecordFirstMd").hover(function () {
        $(this).find("div.nextRecordsFirst").toggleClass("visibleHoverRecordsFirst");
    });
});

$(document).ready(function () {
    $("div#contentRecordFirstMd").hover(function () {
        $(this).find("div.nextRecordsFirstSm").toggleClass("visibleHoverRecordsFirst");
    });
});


$(document).ready(function () {
    $('div#contentRecordFirstMd').hover(function () {
        $(this).addClass('transitionRecordFirstMd');
    }, function () {
            $(this).removeClass('transitionRecordFirstMd');
    })
});

$(document).ready(function () {
    $("div#contentRecordMd").hover(function () {
        $(this).find("div.nextRecordsSm").toggleClass("visibleHoverRecords");
    });
});


$(document).ready(function () {
    $("div#contentRecordXs").hover(function () {
        $(this).find("div.nextRecordsXs").toggleClass("visibleHoverRecords");
    });
});

$(document).ready(function () {
    $('div#contentRecordXs').hover(function () {
        $(this).parent().prev().prev().addClass('hoverRecordsXs');
    }, function () {
            $(this).parent().prev().prev().removeClass('hoverRecordsXs');
    })
});

$(document).ready(function () {
    $('div#contentRecordXs').hover(function () {
        $(this).parent().prev().prev().prev().addClass('hoverRecordsXsPrev');
    }, function () {
            $(this).parent().prev().prev().prev().removeClass('hoverRecordsXsPrev');
    })
});

$(document).ready(function () {
    $('div#contentRecordXs').hover(function () {
        $(this).parent().prev().prev().prev().prev().addClass('hoverRecordsXsPrevPrev');
    }, function () {
            $(this).parent().prev().prev().prev().prev().removeClass('hoverRecordsXsPrevPrev');
    })
});

$(document).ready(function () {
    $('div#contentRecordFirstXs').hover(function () {
        $(this).parent().prev().prev().addClass('hoverRecordsXsFirst');
    }, function () {
            $(this).parent().prev().prev().removeClass('hoverRecordsXsFirst');
    })
});

$(document).ready(function () {
    $('div#contentRecordFirstXs').hover(function () {
        $(this).parent().prev().prev().prev().addClass('hoverRecordsXsPrevFirst');
    }, function () {
            $(this).parent().prev().prev().prev().removeClass('hoverRecordsXsPrevFirst');
    })
});

$(document).ready(function () {
    $('div#contentRecordFirstXs').hover(function () {
        $(this).parent().prev().prev().prev().prev().addClass('hoverRecordsXsPrevPrevFirst');
    }, function () {
            $(this).parent().prev().prev().prev().prev().removeClass('hoverRecordsXsPrevPrevFirst');
    })
});

$(document).ready(function () {
    $("div#contentRecordFirstXs").hover(function () {
        $(this).find("div.nextRecordsXsFirst").toggleClass("visibleHoverRecordsFirst");
    });
});

$(document).ready(function () {
    $('img#contentNextRecordsFirstXs').hover(function () {
        $(this).addClass('transitionNextRecordsFirst');
    }, function () {
        $(this).removeClass('transitionNextRecordsFirst');
    })
});

$(document).ready(function () {
    $('img#contentNextRecordsXs').hover(function () {
        $(this).addClass('transitionNextRecords');
    }, function () {
        $(this).removeClass('transitionNextRecords');
    })
});

$(document).ready(function () {
    $('div#contentRecordFirstXs').hover(function () {
        $(this).addClass('transitionRecordFirstXs');
    }, function () {
            $(this).removeClass('transitionRecordFirstXs');
    })
});

(function ($) {

    // Check if Navigator is Internet Explorer
    if (navigator.userAgent.indexOf('MSIE') !== -1
        || navigator.appVersion.indexOf('Trident/') > -1) {

        // Scroll event check
        $(window).scroll(function (event) {
            var scroll = $(window).scrollTop();

            // Activate sticky for IE if scrolltop is more than 500px
            if (scroll > 450) {
                $('.sticky-top').addClass("sticky-top-ie");
            } else {
                $('.sticky-top').removeClass("sticky-top-ie");
            }

        });

    }

})(jQuery);

(function ($) {

    // Check if Navigator is Internet Explorer
    if (navigator.userAgent.indexOf('MSIE') !== -1
        || navigator.appVersion.indexOf('Trident/') > -1) {

        // Scroll event check
        $(window).scroll(function (event) {
            var scroll = $(window).scrollTop();

            // Activate sticky for IE if scrolltop is more than 500px
            if (scroll > 400) {
                $('.sticky-topSm').addClass("sticky-top-ieSm");
            } else {
                $('.sticky-topSm').removeClass("sticky-top-ieSm");
            }

        });

    }

})(jQuery);

(function ($) {

    // Check if Navigator is Internet Explorer
    if (navigator.userAgent.indexOf('MSIE') !== -1
        || navigator.appVersion.indexOf('Trident/') > -1) {

        // Scroll event check
        $(window).scroll(function (event) {
            var scroll = $(window).scrollTop();

            // Activate sticky for IE if scrolltop is more than 500px
            if (scroll > 320) {
                $('.sticky-topXs').addClass("sticky-top-ieXs");
            } else {
                $('.sticky-topXs').removeClass("sticky-top-ieXs");
            }

        });

    }

})(jQuery);

; (function ($) {
    $.fn.fixMe = function () {
        return this.each(function () {
            var $this = $(this),
                $t_fixed;
            function init() {
                $this.wrap('<div class="containerFixed" />');
                $t_fixed = $this.clone();
                $t_fixed.find("tbody").remove().end().addClass("fixed").insertBefore($this);
                resizeFixed();
            }
            function resizeFixed() {
                //$t_fixed.width($this.outerWidth());
                //$t_fixed.find("th").each(function (index) {
                //    $(this).css("width", $this.find("th").eq(index).outerWidth() + "px");
                //});
            }
            function scrollFixed() {
                var offsetY = $(this).scrollTop(),
                    offsetX = $(this).scrollLeft(),
                    tableOffsetTop = $this.offset().top,
                    tableOffsetBottom = tableOffsetTop + $this.height() - $this.find("thead").height(),
                    tableOffsetLeft = $this.offset().left;
                if (offsetY < tableOffsetTop || offsetY > tableOffsetBottom)
                    $t_fixed.hide();
                else if (offsetY >= tableOffsetTop && offsetY <= tableOffsetBottom && $t_fixed.is(":hidden"))
                    $t_fixed.show();
                $t_fixed.css("left", tableOffsetLeft - offsetX + "px");
            }
            $(window).resize(resizeFixed);
            $(window).scroll(scrollFixed);
            init();
        });
    };
})(jQuery);

$(document).ready(function () {
    $("table.recordsLg").fixMe();
});

; (function ($) {
    $.fn.fixMeSm = function () {
        return this.each(function () {
            var $this = $(this),
                $t_fixed;
            function init() {
                $this.wrap('<div class="containerFixedSm" />');
                $t_fixed = $this.clone();
                $t_fixed.find("tbody.recordsSm").remove().end().addClass("fixedSm").insertBefore($this);
                resizeFixed();
            }
            function resizeFixed() {
                //$t_fixed.width($this.outerWidth());
                //$t_fixed.find("th").each(function (index) {
                //    $(this).css("width", $this.find("th").eq(index).outerWidth() + "px");
                //});
            }
            function scrollFixed() {
                var offsetY = $(this).scrollTop(),
                    offsetX = $(this).scrollLeft(),
                    tableOffsetTop = $this.offset().top,
                    tableOffsetBottom = tableOffsetTop + $this.height() - $this.find("thead.recordsSm").height(),
                    tableOffsetLeft = $this.offset().left;
                if (offsetY < tableOffsetTop || offsetY > tableOffsetBottom)
                    $t_fixed.hide();
                else if (offsetY >= tableOffsetTop && offsetY <= tableOffsetBottom && $t_fixed.is(":hidden"))
                    $t_fixed.show();
                $t_fixed.css("left", tableOffsetLeft - offsetX + "px");
            }
            $(window).resize(resizeFixed);
            $(window).scroll(scrollFixed);
            init();
        });
    };
})(jQuery);

$(document).ready(function () {
    $("table.recordsSm").fixMeSm();
});

; (function ($) {
    $.fn.fixMeXs = function () {
        return this.each(function () {
            var $this = $(this),
                $t_fixed;
            function init() {
                $this.wrap('<div class="containerFixedXs" />');
                $t_fixed = $this.clone();
                $t_fixed.find("tbody.recordsXs").remove().end().addClass("fixedXs").insertBefore($this);
                resizeFixed();
            }
            function resizeFixed() {
                //$t_fixed.width($this.outerWidth());
                //$t_fixed.find("th").each(function (index) {
                //    $(this).css("width", $this.find("th").eq(index).outerWidth() + "px");
                //});
            }
            function scrollFixed() {
                var offsetY = $(this).scrollTop(),
                    offsetX = $(this).scrollLeft(),
                    tableOffsetTop = $this.offset().top,
                    tableOffsetBottom = tableOffsetTop + $this.height() - $this.find("thead.recordsXs").height(),
                    tableOffsetLeft = $this.offset().left;
                if (offsetY < tableOffsetTop || offsetY > tableOffsetBottom)
                    $t_fixed.hide();
                else if (offsetY >= tableOffsetTop && offsetY <= tableOffsetBottom && $t_fixed.is(":hidden"))
                    $t_fixed.show();
                $t_fixed.css("left", tableOffsetLeft - offsetX + "px");
            }
            $(window).resize(resizeFixed);
            $(window).scroll(scrollFixed);
            init();
        });
    };
})(jQuery);

$(document).ready(function () {
    $("table.recordsXs").fixMeXs();
});

$(document).ready(function () {
    // Show or hide the sticky button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.go-top').fadeIn(200);
        } else {
            $('.go-top').fadeOut(200);
        }
    });
    // Animate the scroll to top
    $('.go-top').click(function (event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 1500);
    })
});