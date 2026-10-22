/* =====================================================
   AnkitX Portfolio - Ankit Sharma
   Cursor, smooth scroll, animations, form
   ===================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var pageLoader = $('#pageLoader');
  if (pageLoader) {
    var loaderStarted = Date.now();
    var loaderHidden = false;
    var loaderFallback;
    var loaderProgress = $('.loader-progress', pageLoader);
    var loaderProgressFill = $('#loaderProgressFill', pageLoader);
    var loaderPercent = $('#loaderPercent', pageLoader);
    var loaderProgressTimer;
    function setLoaderProgress(value) {
      var percent = Math.round(value);
      loaderProgress.setAttribute('aria-valuenow', String(percent));
      loaderProgressFill.style.transform = 'scaleX(' + percent / 100 + ')';
      loaderPercent.textContent = percent + '%';
    }
    function hidePageLoader() {
      if (loaderHidden) return;
      loaderHidden = true;
      clearTimeout(loaderFallback);
      clearInterval(loaderProgressTimer);
      setLoaderProgress(100);
      var delay = reduced ? 0 : Math.max(0, 650 - (Date.now() - loaderStarted));
      setTimeout(function () {
        pageLoader.classList.add('is-hidden');
        setTimeout(function () { pageLoader.remove(); }, reduced ? 0 : 850);
      }, delay);
    }
    loaderProgressTimer = setInterval(function () {
      var elapsed = Date.now() - loaderStarted;
      setLoaderProgress(Math.min(90, 90 * (1 - Math.exp(-elapsed / 2200))));
    }, 60);
    loaderFallback = setTimeout(hidePageLoader, 8000);
    if (document.readyState === 'complete') hidePageLoader();
    else window.addEventListener('load', hidePageLoader, { once: true });
  }
  var useGsap = !!window.gsap && !reduced;
  if (useGsap) root.classList.add('gsap-ready');
  var PHONE = '919672244908';
  var EMAIL = 'ankitsharma20033@gmail.com';

  /* ---------------------------------------------------
     1. BACKGROUND PARTICLE NETWORK
  --------------------------------------------------- */
  (function () {
    var c = $('#bg'), x = c.getContext('2d'), W, H, parts = [], D;
    var frame = 0, lastDraw = 0, frameInterval = 1000 / 30;
    function size() {
      D = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight;
      c.width = W * D; c.height = H * D; x.setTransform(D, 0, 0, D, 0, 0);
      var n = Math.min(52, Math.floor(W * H / 26000));
      parts = [];
      for (var i = 0; i < n; i++) parts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.5 + .7, c: i % 3 });
    }
    size();
    var resizeTimer;
    addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(size, 120);
    }, { passive: true });
    var cols = ['220,220,218', '162,163,162', '245,245,242'];
    function draw(now) {
      frame = 0;
      if (document.hidden) return;
      if (now - lastDraw < frameInterval) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;
      x.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        x.fillStyle = 'rgba(' + cols[p.c] + ',.75)';
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill();
        for (var j = i + 1; j < parts.length; j++) {
          var q = parts[j], ax = p.x - q.x, ay = p.y - q.y, dd = ax * ax + ay * ay;
          if (dd < 10000) {
            x.strokeStyle = 'rgba(' + cols[p.c] + ',' + (0.16 * (1 - dd / 10000)) + ')';
            x.lineWidth = 1; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    }
    function start() { if (!reduced && !document.hidden && !frame) frame = requestAnimationFrame(draw); }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
      else start();
    });
    start();
  })();

  /* ---------------------------------------------------
     5. SMOOTH SCROLL
  --------------------------------------------------- */
  var smooth = !reduced && fine;
  function maxScroll() { return Math.max(0, document.documentElement.scrollHeight - innerHeight); }
  function goTo(y) { window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' }); }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var el = $(id); if (!el) return;
      e.preventDefault();
      goTo(id === '#home' ? 0 : el.getBoundingClientRect().top + scrollY - 70);
      closeMenu();
    });
  });

  /* ---------------------------------------------------
     4. NAVBAR, PROGRESS, ACTIVE LINK
  --------------------------------------------------- */
  var nav = $('#nav'), progress = $('#progress'), links = $$('.nav-links a');
  var secs = links.map(function (a) { return $(a.getAttribute('href')); });
  function onScroll() {
    var y = scrollY, m = maxScroll();
    nav.classList.toggle('scrolled', y > 20);
    progress.style.transform = 'scaleX(' + (m ? y / m : 0) + ')';
    var cur = 0;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
  }
  var scrollFrame = 0;
  addEventListener('scroll', function () {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(function () {
      scrollFrame = 0;
      onScroll();
    });
  }, { passive: true });
  onScroll();

  var burger = $('#burger'), menu = $('#navLinks');
  function setMenuOpen(open) {
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  function closeMenu() { setMenuOpen(false); }
  burger.addEventListener('click', function () { setMenuOpen(!menu.classList.contains('open')); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
      burger.focus();
    }
  });
  addEventListener('resize', function () { if (innerWidth > 900) closeMenu(); });

  var dock = $('.dock'), dockTrigger = $('#dockTrigger');
  var desktopDock = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1025px)');
  if (dock && dockTrigger && desktopDock.matches) {
    function updateDockState() {
      var isOpen = dock.matches(':hover') || dock.contains(document.activeElement);
      dockTrigger.setAttribute('aria-expanded', String(isOpen));
      dockTrigger.setAttribute('aria-label', isOpen ? 'Social links open' : 'Open social links');
    }
    dock.addEventListener('pointerenter', updateDockState);
    dock.addEventListener('pointerleave', updateDockState);
    dock.addEventListener('focusin', updateDockState);
    dock.addEventListener('focusout', function () { setTimeout(updateDockState, 0); });
    desktopDock.addEventListener('change', function (event) {
      if (!event.matches) {
        dockTrigger.setAttribute('aria-expanded', 'false');
        dockTrigger.setAttribute('aria-label', 'Open social links');
      }
    });
  }

  // text scramble on nav hover
  var chars = '01<>/{}[]#$%&*';
  links.forEach(function (a) {
    var orig = a.textContent, timer;
    a.addEventListener('mouseenter', function () {
      var i = 0; clearInterval(timer);
      timer = setInterval(function () {
        a.textContent = orig.split('').map(function (ch, k) { return k < i ? ch : chars[Math.floor(Math.random() * chars.length)]; }).join('');
        if (i++ >= orig.length) { clearInterval(timer); a.textContent = orig; }
      }, 35);
    });
  });

  /* ---------------------------------------------------
     5. TYPING EFFECT
  --------------------------------------------------- */
  (function () {
    var el = $('#typed'), words = ['Web Developer', 'Python & Django Builder', 'Frontend Animator', 'AI-assisted Coder', 'Idea to Reality'];
    var w = 0, c = 0, del = false;
    if (reduced) { el.textContent = words[0]; return; }
    (function tick() {
      var word = words[w];
      el.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1500); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 75);
    })();
  })();

  /* ---------------------------------------------------
     6. REVEAL ON SCROLL + COUNTERS
  --------------------------------------------------- */
  var revealStarted = false;
  function startReveal() {
    if (revealStarted) return; revealStarted = true;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        if (useGsap && en.target.classList.contains('reveal')) {
          var delay = parseFloat(en.target.style.getPropertyValue('--d')) || 0;
          window.gsap.fromTo(en.target,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: .7, delay: delay, ease: 'power3.out', overwrite: 'auto', clearProps: 'opacity,visibility,transform' }
          );
        }
        io.unobserve(en.target);
        $$('[data-count]', en.target).forEach(count);
        if (en.target.hasAttribute('data-count')) count(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(function (el, i) {
      // stagger siblings
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--d', Math.min(sib, 6) * 0.08 + 's');
      io.observe(el);
    });
    $$('.stat b').forEach(function (b) { io.observe(b); });
  }
  function count(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    var to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1400;
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  startReveal();

  /* ---------------------------------------------------
     7. 3D TILT + SPOTLIGHT GLOW + MAGNETIC BUTTONS
  --------------------------------------------------- */
  if (fine && !reduced) {
    $$('[data-tilt]').forEach(function (el) {
      var strong = el.classList.contains('photo-card') ? 9 : 7;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%');
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * strong) + 'deg) rotateY(' + ((px - 0.5) * strong * 1.3) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------
     8. SKILL FILTER TABS
  --------------------------------------------------- */
  var tabs = $$('.tab'), cards = $$('.skill');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) {
        x.classList.remove('active');
        x.setAttribute('aria-pressed', 'false');
      });
      t.classList.add('active');
      t.setAttribute('aria-pressed', 'true');
      var f = t.dataset.filter, n = 0;
      cards.forEach(function (c) {
        var show = f === 'all' || c.dataset.cat === f;
        c.classList.toggle('hide', !show);
        c.classList.remove('pop');
        if (show) {
          var delay = n++ * (useGsap ? .035 : .05);
          c.style.setProperty('--d', delay + 's');
          if (useGsap) {
            window.gsap.fromTo(c,
              { autoAlpha: 0, y: 12, scale: .98 },
              { autoAlpha: 1, y: 0, scale: 1, duration: .4, delay: delay, ease: 'power2.out', overwrite: 'auto', clearProps: 'opacity,visibility,transform' }
            );
          } else {
            void c.offsetWidth;
            c.classList.add('pop');
          }
        }
      });
    });
  });

  /* ---------------------------------------------------
     9. TOAST + COPY
  --------------------------------------------------- */
  var toast = $('#toast'), toastT;
  function say(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('show'); }, 2800);
  }
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.dataset.copy;
      function ok() { say('Copied: ' + v); }
      function fallback() {
        var ta = document.createElement('textarea'); ta.value = v; ta.style.position = 'fixed'; ta.style.opacity = 0;
        document.body.appendChild(ta); ta.select();
        try {
          if (document.execCommand('copy')) ok();
          else say('Could not copy. Please copy it manually.');
        } catch (e) { say('Could not copy. Please copy it manually.'); }
        ta.remove();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(ok, fallback); else fallback();
    });
  });

  /* ---------------------------------------------------
     10. CONTACT FORM (opens WhatsApp or Email, ready to send)
  --------------------------------------------------- */
  var form = $('#contactForm');
  function err(id, msg) {
    var f = $('#' + id), e = $('.err[data-for="' + id + '"]');
    f.parentElement.classList.toggle('invalid', !!msg);
    f.setAttribute('aria-invalid', String(!!msg));
    if (e) e.textContent = msg || '';
  }
  ['fName', 'fEmail', 'fMsg'].forEach(function (id) { $('#' + id).addEventListener('input', function () { err(id, ''); }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#fName').value.trim(), mail = $('#fEmail').value.trim(), type = $('#fType').value, msg = $('#fMsg').value.trim();
    var bad = false;
    if (name.length < 2) { err('fName', 'Please enter your name.'); bad = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { err('fEmail', 'Please enter a valid email address.'); bad = true; }
    if (msg.length < 10) { err('fMsg', 'Please write at least 10 characters.'); bad = true; }
    if (bad) { say('Please fix the highlighted fields.'); return; }
    var via = (e.submitter && e.submitter.dataset.via) || 'wa';
    var text = 'Hi Ankit, I found you on AnkitX.\n\nName: ' + name + '\nEmail: ' + mail + '\nProject: ' + type + '\n\n' + msg;
    if (via === 'wa') {
      window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      say('Opening WhatsApp...');
    } else {
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('New project enquiry from ' + name) + '&body=' + encodeURIComponent(text);
      say('Opening your email app...');
    }
  });

  /* ---------------------------------------------------
     11. MISC
  --------------------------------------------------- */
  $('#year').textContent = new Date().getFullYear();
})();
