"use strict";
function ownKeys(t, e) { var r, n = Object.keys(t); return Object.getOwnPropertySymbols && (r = Object.getOwnPropertySymbols(t), e && (r = r.filter(function (e) { return Object.getOwnPropertyDescriptor(t, e).enumerable; })), n.push.apply(n, r)), n; }
function _objectSpread(t) { for (var e = 1; e < arguments.length; e++) { var r = null != arguments[e] ? arguments[e] : {}; e % 2 ? ownKeys(Object(r), !0).forEach(function (e) { _defineProperty(t, e, r[e]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : ownKeys(Object(r)).forEach(function (e) { Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e)); }); } return t; }
function _defineProperty(e, t, r) { return t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e; }
function _typeof(e) { return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) { return typeof e; } : function (e) { return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e; })(e); }
!function (t) {
    var e = {
        init: function () { e.stickyNavbar(), e.filterableGrid(), e.customFileInput(), e.passwordVisibilityToggle(), e.fileDropArea(), e.labelUpdate(), e.formValidation(), e.inputFormatter(), e.multilevelDropdown(), e.offcanvas(), e.tooltips(), e.popovers(), e.smoothScroll(), e.scrollTopButton(), e.carousel(), e.gallery(), e.videoPopupBtn(), e.countdown(), e.priceSwitch(), e.rangeSlider(), e.radialProgress(), e.filterList(), e.ajaxifySubscribeForm(), e.parallax(), e.bindedContent(), e.viewSwitcher(), e.sidebarSticky(), e.filtersShowHide(); }, stickyNavbar: function () { var e, t, r = document.querySelector(".navbar-sticky"); null != r && (e = r.classList, t = r.offsetHeight, e.contains("navbar-floating") && e.contains("navbar-dark") ? window.addEventListener("scroll", function (e) { 500 < e.currentTarget.pageYOffset ? (r.classList.remove("navbar-dark"), r.classList.add("navbar-light"), r.classList.add("navbar-stuck")) : (r.classList.remove("navbar-stuck"), r.classList.remove("navbar-light"), r.classList.add("navbar-dark")); }) : e.contains("navbar-floating") && e.contains("navbar-light") ? window.addEventListener("scroll", function (e) { 500 < e.currentTarget.pageYOffset ? r.classList.add("navbar-stuck") : r.classList.remove("navbar-stuck"); }) : window.addEventListener("scroll", function (e) { 500 < e.currentTarget.pageYOffset ? (document.body.style.paddingTop = t + "px", r.classList.add("navbar-stuck")) : (document.body.style.paddingTop = "", r.classList.remove("navbar-stuck")); })); }, filterableGrid: function () {
            var e = document.querySelectorAll("[data-filter-grid]"); if (null !== e)
                for (var t = 0; t < e.length; t++)
                    mixitup(e[t], { selectors: { target: ".cs-grid-item" }, controls: { scope: "local" }, classNames: { block: "", elementFilter: "", modifierActive: "active" }, animation: { duration: 350 } });
        }, customFileInput: function () { "object" === ("undefined" == typeof bsCustomFileInput ? "undefined" : _typeof(bsCustomFileInput)) && bsCustomFileInput.init(); }, passwordVisibilityToggle: function () {
            for (var r = document.querySelectorAll(".cs-password-toggle"), e = 0; e < r.length; e++)
                !function (e) { var t = r[e].querySelector(".form-control"); r[e].querySelector(".cs-password-toggle-btn").addEventListener("click", function (e) { "checkbox" === e.target.type && (e.target.checked ? t.type = "text" : t.type = "password"); }, !1); }(e);
        }, fileDropArea: function () {
            for (var t = document.querySelectorAll(".cs-file-drop-area"), e = 0; e < t.length; e++)
                !function (e) { var n = t[e].querySelector(".cs-file-drop-input"), a = t[e].querySelector(".cs-file-drop-message"), o = t[e].querySelector(".cs-file-drop-icon"); t[e].querySelector(".cs-file-drop-btn").addEventListener("click", function () { n.click(); }), n.addEventListener("change", function () { var e; n.files && n.files[0] && ((e = new FileReader).onload = function (e) { var t, e = e.target.result, r = n.files[0].name; a.innerHTML = r, e.startsWith("data:image") ? ((t = new Image).src = e, t.onload = function () { o.className = "cs-file-drop-preview", o.innerHTML = '<img class="img-thumbnail rounded" src="' + t.src + '" alt="' + r + '">'; }) : e.startsWith("data:video") ? (o.innerHTML = "", o.className = "", o.className = "cs-file-drop-icon cxi-video") : (o.innerHTML = "", o.className = "", o.className = "cs-file-drop-icon cxi-files"); }, e.readAsDataURL(n.files[0])); }); }(e);
        }, labelUpdate: function () {
            for (var e = document.querySelectorAll("[data-label]"), t = 0; t < e.length; t++)
                e[t].addEventListener("change", function () { var e = this.dataset.label; try { document.getElementById(e).textContent = this.value; } catch (e) { e.message = "Cannot set property 'textContent' of null", console.error("Make sure the [data-label] matches with the id of the target element you want to change text of!"); } });
        }, formValidation: function () { window.addEventListener("load", function () { var e = document.getElementsByClassName("needs-validation"); Array.prototype.filter.call(e, function (t) { t.addEventListener("submit", function (e) { !1 === t.checkValidity() && (e.preventDefault(), e.stopPropagation()), t.classList.add("was-validated"); }, !1); }); }, !1); }, inputFormatter: function () {
            var e = document.querySelectorAll("[data-format]"); if (0 !== e.length)
                for (var t = 0; t < e.length; t++) { var r = e[t].dataset.format, n = e[t].dataset.blocks, a = e[t].dataset.delimiter, n = void 0 !== n ? n.split(" ").map(Number) : "", a = void 0 !== a ? a : " "; switch (r) { case "card": new Cleave(e[t], { creditCard: !0 }); break; case "cvc": new Cleave(e[t], { numeral: !0, numeralIntegerScale: 3 }); break; case "date": new Cleave(e[t], { date: !0, datePattern: ["m", "y"] }); break; case "date-long": new Cleave(e[t], { date: !0, delimiter: "-", datePattern: ["Y", "m", "d"] }); break; case "time": new Cleave(e[t], { time: !0, datePattern: ["h", "m"] }); break; case "custom": new Cleave(e[t], { delimiter: a, blocks: n }); break; default: console.error("Sorry, your format " + r + " is not available. You can add it to the theme object method - inputFormatter in src/js/theme.js or choose one from the list of available formats: card, cvc, date, date-long, time or custom."); } }
        }, multilevelDropdown: function () { t(".dropdown-menu [data-toggle='dropdown']").on("click", function (e) { e.preventDefault(), e.stopPropagation(), t(this).siblings().toggleClass("show"), t(this).next().hasClass("show") || t(this).parents(".dropdown-menu").first().find(".show").removeClass("show"), t(this).parents("li.nav-item.dropdown.show").on("hidden.bs.dropdown", function () { t(".dropdown-submenu .show").removeClass("show"); }); }); }, offcanvas: function () {
            var e = document.querySelectorAll('[data-toggle="offcanvas"]'), t = document.querySelectorAll('[data-dismiss="offcanvas"]'), r = document.querySelectorAll(".cs-offcanvas"), n = document.body, a = document.querySelectorAll("[data-fixed-element]"), o = window.innerWidth > n.clientWidth, s = document.createElement("div"); s.classList.add("cs-offcanvas-backdrop"); for (var i = function () {
                for (var e = 0; e < r.length; e++)
                    r[e].classList.remove("show"); if (s.classList.remove("show"), setTimeout(function () { n.removeChild(s); }, 50), o && (n.style.paddingRight = 0, a.length))
                    for (var t = 0; t < a.length; t++)
                        a[t].classList.remove("right-15"); n.classList.remove("cs-offcanvas-open");
            }, l = 0; l < e.length; l++)
                e[l].addEventListener("click", function (e) {
                    e.preventDefault(), function (e) {
                        if (n.appendChild(s), setTimeout(function () { s.classList.add("show"); }, 20), document.getElementById(e).classList.add("show"), o && (n.style.paddingRight = "15px", a.length))
                            for (var t = 0; t < a.length; t++)
                                a[t].classList.add("right-15"); n.classList.add("cs-offcanvas-open");
                    }(e.currentTarget.dataset.target, e.currentTarget);
                }); for (var c = 0; c < t.length; c++)
                t[c].addEventListener("click", function (e) { e.preventDefault(), i(); }); document.addEventListener("click", function (e) { "cs-offcanvas-backdrop" === e.target.classList[0] && i(); });
        }, tooltips: function () { t('[data-toggle="tooltip"]').tooltip({ trigger: "hover" }); }, popovers: function () { t('[data-toggle="popover"]').popover(); }, smoothScroll: function () { new SmoothScroll("[data-scroll]", { speed: 700, speedAsDuration: !0, offset: 40, header: "[data-scroll-header]", updateURL: !1 }); }, scrollTopButton: function () { var t, r = document.querySelector(".btn-scroll-top"); null != r && (t = parseInt(600, 10), window.addEventListener("scroll", function (e) { e.currentTarget.pageYOffset > t ? r.classList.add("show") : r.classList.remove("show"); })); }, carousel: function () {
            !function (e, t, r) {
                for (var n = 0; n < e.length; n++)
                    t.call(r, n, e[n]);
            }(document.querySelectorAll(".cs-carousel .cs-carousel-inner"), function (_e, t) { var r = { container: t, controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'], navPosition: "top", controlsPosition: "top", mouseDrag: !0, speed: 600, autoplayHoverPause: !0, autoplayButtonOutput: !1 }; null != t.dataset.carouselOptions && (n = JSON.parse(t.dataset.carouselOptions)); var n = _objectSpread(_objectSpread({}, r), n); tns(n); });
        }, gallery: function () {
            var e = document.querySelectorAll(".cs-gallery"); if (e.length)
                for (var t = 0; t < e.length; t++)
                    lightGallery(e[t], { selector: ".cs-gallery-item", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
        }, videoPopupBtn: function () {
            var e = document.querySelectorAll("[data-gallery-video]"); if (e.length)
                for (var t = 0; t < e.length; t++)
                    lightGallery(e[t], { selector: "this", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
        }, countdown: function () {
            var d = document.querySelectorAll(".cs-countdown"); if (null != d)
                for (var e = 0; e < d.length; e++) {
                    var t = function (e) {
                        var t, r, n, a, o = d[e].dataset.countdown, s = d[e].querySelector(".cs-countdown-days .cs-countdown-value"), i = d[e].querySelector(".cs-countdown-hours .cs-countdown-value"), l = d[e].querySelector(".cs-countdown-minutes .cs-countdown-value"), c = d[e].querySelector(".cs-countdown-seconds .cs-countdown-value"), o = new Date(o).getTime(); if (isNaN(o))
                            return { v: void 0 }; setInterval(function () { var e = (new Date).getTime(), e = parseInt((o - e) / 1e3); 0 <= e && (t = parseInt(e / 86400), e %= 86400, r = parseInt(e / 3600), e %= 3600, n = parseInt(e / 60), e %= 60, a = parseInt(e), null != s && (s.innerHTML = parseInt(t, 10)), null != i && (i.innerHTML = r < 10 ? "0" + r : r), null != l && (l.innerHTML = n < 10 ? "0" + n : n), null != c && (c.innerHTML = a < 10 ? "0" + a : a)); }, 1e3);
                    }(e); if ("object" === _typeof(t))
                        return t.v;
                }
        }, priceSwitch: function () {
            var o = document.querySelectorAll(".cs-pricing-wrap"); if (null !== o)
                for (var e = 0; e < o.length; e++)
                    !function (e) {
                        function t() {
                            if (n.checked) {
                                r.parentNode.classList.add("cs-price-switch-on"); for (var e = 0; e < a.length; e++)
                                    a[e].innerHTML = a[e].dataset.newPrice;
                            } else {
                                r.parentNode.classList.remove("cs-price-switch-on"); for (var t = 0; t < a.length; t++)
                                    a[t].innerHTML = a[t].dataset.currentPrice;
                            }
                        } var r = o[e].querySelector(".cs-switch"), n = r.querySelector('input[type="checkbox"]'), a = o[e].querySelectorAll(".cs-price"); t(), n.addEventListener("change", function () { t(); });
                    }(e);
        }, rangeSlider: function () {
            for (var a = document.querySelectorAll(".cs-range-slider"), e = 0; e < a.length; e++)
                !function (e) { var t = a[e].querySelector(".cs-range-slider-ui"), r = a[e].querySelector(".cs-range-slider-value-min"), n = a[e].querySelector(".cs-range-slider-value-max"), e = { dataStartMin: parseInt(a[e].dataset.startMin, 10), dataStartMax: parseInt(a[e].dataset.startMax, 10), dataMin: parseInt(a[e].dataset.min, 10), dataMax: parseInt(a[e].dataset.max, 10), dataStep: parseInt(a[e].dataset.step, 10) }; noUiSlider.create(t, { start: [e.dataStartMin, e.dataStartMax], connect: !0, step: e.dataStep, pips: { mode: "count", values: 5 }, tooltips: !0, range: { min: e.dataMin, max: e.dataMax }, format: { to: function (e) { return "$" + parseInt(e, 10); }, from: function (e) { return Number(e); } } }), null !== r && null !== n && (t.noUiSlider.on("update", function (e, t) { e = (e = e[t]).replace(/\D/g, ""); t ? n.value = Math.round(e) : r.value = Math.round(e); }), r.addEventListener("change", function () { t.noUiSlider.set([this.value, null]); }), n.addEventListener("change", function () { t.noUiSlider.set([null, this.value]); })); }(e);
        }, radialProgress: function () {
            var e = document.querySelectorAll("[data-progress-radial]"); if (null !== e)
                for (var t = { strokeWidth: 6, trailWidth: 6, color: "#1e212c", trailColor: "#e5e8ed", easing: "easeInOut", duration: 1e3, svgStyle: null }, r = 0; r < e.length; r++) { var n = void 0; 0 < e[r].dataset.progressRadial.length && (n = JSON.parse(e[r].dataset.progressRadial)); var a = _objectSpread(_objectSpread({}, t), n), a = new ProgressBar.Circle(e[r], a), n = null != n ? n.progress : .75; a.animate(n); }
        }, filterList: function () {
            for (var t = document.querySelectorAll(".cs-filter"), e = 0; e < t.length; e++)
                (function (e) {
                    var r = t[e].querySelector(".cs-filter-search"), n = t[e].querySelector(".cs-filter-list").querySelectorAll(".cs-filter-item"); if (!r)
                        return; r.addEventListener("keyup", function () {
                            for (var e = r.value.toLowerCase(), t = 0; t < n.length; t++)
                                -1 < n[t].querySelector(".cs-filter-item-text").innerHTML.toLowerCase().indexOf(e) ? n[t].classList.remove("d-none") : n[t].classList.add("d-none");
                        });
                })(e);
        }, ajaxifySubscribeForm: function () {
            var s = document.querySelectorAll(".cs-subscribe-form"); if (null !== s) {
                for (var e = 0; e < s.length; e++)
                    !function (e) { var t = s[e].querySelector('button[type="submit"]'), r = t.innerHTML, n = s[e].querySelector(".form-control"), a = s[e].querySelector(".cs-subscribe-form-antispam"), o = s[e].querySelector(".cs-subscribe-status"); s[e].addEventListener("submit", function (e) { e && e.preventDefault(), "" === a.value && i(this, t, n, r, o); }); }(e); var i = function (e, t, r, n, a) { t.innerHTML = "Sending..."; var o = e.action.replace("/post?", "/post-json?"), e = "&" + r.name + "=" + encodeURIComponent(r.value), s = document.createElement("script"); s.src = o + "&c=callback" + e, document.body.appendChild(s); var i = "callback"; window[i] = function (e) { delete window[i], document.body.removeChild(s), t.innerHTML = n, "success" == e.result ? (r.classList.remove("is-invalid"), r.classList.add("is-valid"), a.classList.remove("cs-status-error"), a.classList.add("cs-status-success"), a.innerHTML = e.msg, setTimeout(function () { r.classList.remove("is-valid"), a.innerHTML = "", a.classList.remove("cs-status-success"); }, 6e3)) : (r.classList.remove("is-valid"), r.classList.add("is-invalid"), a.classList.remove("cs-status-success"), a.classList.add("cs-status-error"), a.innerHTML = e.msg.substring(4), setTimeout(function () { r.classList.remove("is-invalid"), a.innerHTML = "", a.classList.remove("cs-status-error"); }, 6e3)); }; };
            }
        }, parallax: function () {
            for (var e = document.querySelectorAll(".cs-parallax"), t = 0; t < e.length; t++)
                new Parallax(e[t]);
        }, bindedContent: function () {
            for (var e = document.querySelectorAll("[data-binded-content]"), t = (document.querySelector(".cs-binded-content"), 0); t < e.length; t++)
                e[t].addEventListener("click", function (e) {
                    e = document.querySelector(e.currentTarget.dataset.bindedContent); (function (e) {
                        for (var t = [], r = e.parentNode.firstChild; r;)
                            1 === r.nodeType && r !== e && t.push(r), r = r.nextSibling; return t;
                    })(e).map(function (e) { e.classList.remove("active"); }), e.classList.add("active");
                });
        }, viewSwitcher: function () {
            var e = document.querySelectorAll("[data-view]"); if (0 < e.length)
                for (var t = 0; t < e.length; t++)
                    e[t].addEventListener("click", function (e) { var t = this.dataset.view; r(t), "#" === this.getAttribute("href") && e.preventDefault(); }); var r = function (e) {
                        for (var e = document.querySelector(e), t = e.parentNode.querySelectorAll(".cs-view"), r = 0; r < t.length; r++)
                            t[r].classList.remove("show"); e.classList.add("show");
                    };
        }, sidebarSticky: function () {
            var e = document.querySelectorAll(".sidebar-sticky"); if (0 < e.length)
                for (var t = { topSpacing: 0, bottomSpacing: 0, containerSelector: !1, innerWrapperSelector: ".sidebar-sticky-inner", minWidth: 0 }, r = 0; r < e.length; r++) { var n = void 0; void 0 !== e[r].dataset.sidebarStickyOptions && (n = JSON.parse(e[r].dataset.sidebarStickyOptions)); n = _objectSpread(_objectSpread({}, t), n), new StickySidebar(e[r], n); }
        }, filtersShowHide: function () { var t = document.querySelector("[data-filters-show]"), r = document.querySelector("[data-filters-hide]"), n = document.querySelector("[data-filters-columns]"); null !== n && (r.addEventListener("click", function (e) { e = e.target.dataset.filtersHide; r.classList.remove("d-lg-block"), t.classList.remove("d-lg-none"), document.querySelector(e).classList.add("d-lg-none"), n.className = "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"; }), t.addEventListener("click", function (e) { e = e.target.dataset.filtersShow; r.classList.add("d-lg-block"), t.classList.add("d-lg-none"), document.querySelector(e).classList.remove("d-lg-none"), n.className = "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3"; })); }
    }; e.init();
}(jQuery);
