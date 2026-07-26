/* NINJA TECH — shared interactions (vanilla, zero dependencies) */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") menu.classList.remove("open");
    });
  }

  /* ---------- scroll reveal (with stagger inside grids) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      if (parent && (parent.classList.contains("grid") || parent.classList.contains("stats"))) {
        var idx = Array.prototype.indexOf.call(parent.children, el);
        el.style.transitionDelay = Math.min(idx * 70, 350) + "ms";
      }
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- count-up stats ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          cio.unobserve(el);
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          var suffix = el.getAttribute("data-suffix") || "";
          var t0 = null;
          var dur = 1300;
          function step(ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* ---------- 3D tilt cards ---------- */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll(".box").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        var rx = (0.5 - py) * 8;
        var ry = (px - 0.5) * 10;
        card.style.transform =
          "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" +
          ry.toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- hero: 3D particle sphere ---------- */
  var canvas = document.getElementById("hero-canvas");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var w, h, dpr, cx, cy, radius;
    var N = 380;
    var pts = [];
    var GA = Math.PI * (3 - Math.sqrt(5)); /* golden angle */
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var th = i * GA;
      pts.push({ x: Math.cos(th) * r, y: y, z: Math.sin(th) * r });
    }
    var rotY = 0;
    var mouseX = 0, mouseY = 0, targX = 0, targY = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var narrow = w < 760;
      cx = narrow ? w * 0.5 : w * 0.74;
      cy = narrow ? h * 0.78 : h * 0.5;
      radius = narrow ? Math.min(w, h) * 0.34 : Math.min(w, h) * 0.36;
    }
    resize();
    window.addEventListener("resize", resize);

    if (!isTouch) {
      window.addEventListener("mousemove", function (e) {
        targX = (e.clientX / window.innerWidth - 0.5) * 0.6;
        targY = (e.clientY / window.innerHeight - 0.5) * 0.6;
      });
    }

    var visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }).observe(canvas);
    }

    function frame() {
      requestAnimationFrame(frame);
      if (!visible) return;
      rotY += 0.0024;
      mouseX += (targX - mouseX) * 0.05;
      mouseY += (targY - mouseY) * 0.05;
      ctx.clearRect(0, 0, w, h);

      /* soft core glow */
      var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.05);
      glow.addColorStop(0, "rgba(139,92,246,0.16)");
      glow.addColorStop(1, "rgba(139,92,246,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - radius * 1.2, cy - radius * 1.2, radius * 2.4, radius * 2.4);

      var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      var rx = 0.35 + mouseY;
      var cosX = Math.cos(rx), sinX = Math.sin(rx);
      var extraY = mouseX;
      var cosE = Math.cos(extraY), sinE = Math.sin(extraY);

      for (var i = 0; i < N; i++) {
        var p = pts[i];
        /* rotate around Y (spin) */
        var x1 = p.x * cosY - p.z * sinY;
        var z1 = p.x * sinY + p.z * cosY;
        /* mouse-driven extra Y rotation */
        var x2 = x1 * cosE - z1 * sinE;
        var z2 = x1 * sinE + z1 * cosE;
        /* tilt around X */
        var y1 = p.y * cosX - z2 * sinX;
        var z3 = p.y * sinX + z2 * cosX;

        var depth = (z3 + 1) / 2; /* 0 back → 1 front */
        var scale = 0.75 + depth * 0.45;
        var sx = cx + x2 * radius * scale;
        var sy = cy + y1 * radius * scale;
        var size = 0.7 + depth * 1.9;
        var alpha = 0.12 + depth * 0.75;

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = depth > 0.62
          ? "rgba(224,183,255," + alpha.toFixed(3) + ")"
          : "rgba(139,92,246," + alpha.toFixed(3) + ")";
        ctx.fill();
      }
    }
    frame();
  }
})();
