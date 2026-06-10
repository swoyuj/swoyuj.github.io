/* ============================================
   SWOYUJ BAJRACHARYA – PORTFOLIO JAVASCRIPT
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     THEME – DARK MODE
     ============================================ */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
  const THEME_KEY = 'sb-portfolio-theme';
  
  document.getElementById("year").textContent = new Date().getFullYear();

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      applyTheme(stored);
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  initTheme();

  /* ============================================
     MOBILE NAVIGATION
     ============================================ */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  function closeMenu() {
    if (!navMenu || !hamburger) return;
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
  }

  function openMenu() {
    if (!navMenu || !hamburger) return;
    navMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Close menu when a nav link is clicked
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!navMenu || !hamburger) return;
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  /* ============================================
     NAVBAR – SCROLL SHADOW
     ============================================ */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ============================================
     ACTIVE NAV LINK – SCROLL SPY
     ============================================ */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    let currentSection = '';
    const scrollY = window.scrollY;
    const navHeight = navbar ? navbar.offsetHeight : 68;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - navHeight - 80;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================
     BACK TO TOP BUTTON
     ============================================ */
  const backToTop = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     SCROLL REVEAL ANIMATIONS
     ============================================ */
  const revealElements = document.querySelectorAll('.reveal');

  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const revealPoint = 80;

    revealElements.forEach(function (el, index) {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - revealPoint) {
        // Stagger elements that are siblings in the same parent
        const siblings = Array.from(el.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const staggerIndex = siblings.indexOf(el);
        const delay = staggerIndex > 0 ? Math.min(staggerIndex * 80, 320) : 0;

        setTimeout(function () {
          el.classList.add('visible');
        }, delay);
      }
    });
  }

  /* ============================================
     MASTER SCROLL HANDLER
     Batches all scroll-related work into one listener.
     ============================================ */
  let scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        handleNavbarScroll();
        setActiveLink();
        handleBackToTop();
        revealOnScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ============================================
     SMOOTH SCROLLING – NAV LINKS
     Handles browsers that don't support scroll-behavior CSS.
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 68;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ============================================
     CONTACT FORM VALIDATION
     ============================================ */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formSuccess = document.getElementById('form-success');

  const fields = [
    { id: 'name', errorId: 'name-error', label: 'Name', type: 'text', minLength: 2 },
    { id: 'email', errorId: 'email-error', label: 'Email', type: 'email' },
    { id: 'subject', errorId: 'subject-error', label: 'Subject', type: 'text', minLength: 3 },
    { id: 'message', errorId: 'message-error', label: 'Message', type: 'text', minLength: 10 }
  ];

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function showError(field, message) {
    const input = document.getElementById(field.id);
    const error = document.getElementById(field.errorId);
    if (input) input.classList.add('error');
    if (error) error.textContent = message;
  }

  function clearError(field) {
    const input = document.getElementById(field.id);
    const error = document.getElementById(field.errorId);
    if (input) input.classList.remove('error');
    if (error) error.textContent = '';
  }

  function validateField(field) {
    const input = document.getElementById(field.id);
    if (!input) return true;

    const value = input.value.trim();

    if (!value) {
      showError(field, field.label + ' is required.');
      return false;
    }

    if (field.type === 'email' && !isValidEmail(value)) {
      showError(field, 'Enter a valid email address.');
      return false;
    }

    if (field.minLength && value.length < field.minLength) {
      showError(field, field.label + ' must be at least ' + field.minLength + ' characters.');
      return false;
    }

    clearError(field);
    return true;
  }

  // Live validation on blur
  fields.forEach(function (field) {
    const input = document.getElementById(field.id);
    if (!input) return;

    input.addEventListener('blur', function () {
      validateField(field);
    });

    input.addEventListener('input', function () {
      if (input.classList.contains('error')) {
        validateField(field);
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate all fields
      let isValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) return;

      // Simulate submission (front-end only)
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
        }

        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.removeAttribute('aria-hidden');
        }

        contactForm.reset();

        // Hide success message after 6 seconds
        setTimeout(function () {
          if (formSuccess) {
            formSuccess.classList.remove('visible');
            formSuccess.setAttribute('aria-hidden', 'true');
          }
        }, 6000);
      }, 900);
    });
  }

  /* ============================================
     INIT ON LOAD
     ============================================ */
  function init() {
    handleNavbarScroll();
    setActiveLink();
    handleBackToTop();
    revealOnScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
