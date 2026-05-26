/**
 * Portfolio Website Interactivity Script
 * Vigneshwaran R — Senior Full-Stack Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize subsystems
  initLoader();
  initThemeSwitcher();
  initMobileMenu();
  initScrollspy();
  initScrollReveal();
  initScrollToTop();
});

/* ==========================================================================
   1. INITIAL PAGE LOADER
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById('loader-container');
  if (!loader) return;

  // Wait for the complete page window loading (images, stylesheet, CDN links)
  window.addEventListener('load', () => {
    loader.classList.add('fade-out');
    loader.addEventListener('transitionend', () => {
      loader.remove();
    });
  });

  // Fallback in case window load event is delayed or doesn't fire
  setTimeout(() => {
    if (document.getElementById('loader-container')) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 600);
    }
  }, 3500);
}

/* ==========================================================================
   2. DARK / LIGHT / SYSTEM THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const root = document.documentElement;
  
  // Apply a given theme mode
  window.applyTheme = function(theme) {
    localStorage.setItem('theme', theme);
    
    let isDark = false;
    if (theme === 'dark') {
      isDark = true;
    } else if (theme === 'light') {
      isDark = false;
    } else {
      // system preference
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Sync button UI states
    const modes = ['light', 'dark', 'system'];
    modes.forEach(mode => {
      const btn = document.getElementById(`theme-btn-${mode}`);
      const btnMobile = document.getElementById(`theme-btn-${mode}-mobile`);
      
      [btn, btnMobile].forEach(el => {
        if (!el) return;
        if (mode === theme) {
          // Highlight active theme button
          el.classList.add('bg-indigo-500', 'dark:bg-emerald-500', 'text-white', 'dark:text-slate-950');
          el.classList.remove('text-slate-600', 'dark:text-slate-400');
        } else {
          // Clear active state
          el.classList.remove('bg-indigo-500', 'dark:bg-emerald-500', 'text-white', 'dark:text-slate-950');
          el.classList.add('text-slate-600', 'dark:text-slate-400');
        }
      });
    });
  };

  // Read initial setting (from localStorage or fall back to system)
  const activeTheme = localStorage.getItem('theme') || 'system';
  applyTheme(activeTheme);

  // Listen for system theme change in real-time if set to 'system'
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('theme') === 'system') {
      applyTheme('system');
    }
  });
}

/* ==========================================================================
   3. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (!menuToggle || !mobileMenu) return;

  // Toggle mobile navigation visibility
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close mobile navigation drawer on link selection
  closeMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   4. SCROLLSPY (ACTIVE LINK HIGHLIGHTING)
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (sections.length === 0) return;

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        
        // Helper to update link elements
        const updateLinks = (links) => {
          links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}` || (sectionId === 'home' && href === '#')) {
              link.classList.add('nav-link-active');
            } else {
              link.classList.remove('nav-link-active');
            }
          });
        };

        updateLinks(navLinks);
        updateLinks(mobileNavLinks);
      }
    });
  }, {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Active when section enters middle viewport
    threshold: 0
  });

  sections.forEach(section => spyObserver.observe(section));
}

/* ==========================================================================
   5. SCROLL ENTRANCE REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Stop observing once animated in
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(element => revealObserver.observe(element));
}

/* ==========================================================================
   6. SCROLL TO TOP ACTION
   ========================================================================== */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollTop');
  if (!scrollBtn) return;

  // Toggle button visibility based on scroll depth
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');
      scrollBtn.classList.add('opacity-100', 'pointer-events-auto', 'scale-100');
    } else {
      scrollBtn.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
      scrollBtn.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
    }
  });

  // Smooth scroll back to coordinates 0,0
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
