/* ============================================================
   錩玄科技有限公司 — 智慧農業機械
   JavaScript 互動功能
   ============================================================ */

(function () {
  'use strict';

  /* --- Navbar scroll state --- */
  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('backToTop');
  var floatingWidgets = document.getElementById('floatingWidgets');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (y > 500) {
      backToTop.classList.add('show');
      floatingWidgets.classList.add('show');
    } else {
      backToTop.classList.remove('show');
      floatingWidgets.classList.remove('show');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile nav toggle --- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  navToggle.addEventListener('click', function () {
    var isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? '關閉選單' : '開啟選單');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', '開啟選單');
      document.body.style.overflow = '';
    });
  });

  /* --- Active nav link on scroll --- */
  var sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 100;
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var bottom = top + sec.offsetHeight;
      var id = sec.getAttribute('id');
      var link = document.querySelector('.nav-link[href="#' + id + '"]');
      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* --- Reveal on scroll --- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = 0;
          var siblings = Array.prototype.slice.call(el.parentElement.children);
          var index = siblings.indexOf(el);
          if (siblings.length > 1 && el.classList.contains('service-card') ||
              el.classList.contains('solution-card') ||
              el.classList.contains('stat-card') ||
              el.classList.contains('tech-item')) {
            delay = index * 80;
          }
          setTimeout(function () {
            el.classList.add('revealed');
          }, delay);
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* --- Counter animation --- */
  var counters = document.querySelectorAll('[data-counter]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      animateCounter(el);
    });
  }

  /* --- Back to top --- */
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --- Contact form --- */
  var form = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var message = form.message.value.trim();

    formStatus.classList.remove('success', 'error');

    if (!name || !phone || !message) {
      formStatus.textContent = '請填寫姓名、聯絡電話及需求說明。';
      formStatus.classList.add('error');
      return;
    }

    var phonePattern = /^[0-9\-\+\s\(\)]+$/;
    if (!phonePattern.test(phone)) {
      formStatus.textContent = '請輸入有效的聯絡電話號碼。';
      formStatus.classList.add('error');
      return;
    }

    formStatus.textContent = '感謝您的諮詢！我們將儘快與您聯繫。';
    formStatus.classList.add('success');
    form.reset();

    setTimeout(function () {
      formStatus.textContent = '';
      formStatus.classList.remove('success');
    }, 5000);
  });

  /* --- Smooth scroll for anchor links (with fixed nav offset) --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#' || href === '#hero') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = target.offsetTop - 60;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

})();
