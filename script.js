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
  initContactForm();
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

/* ==========================================================================
   7. CONTACT FORM VALIDATION & ACTIONS
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const gmailBtn = document.getElementById('contact-gmail-btn');
  const whatsappBtn = document.getElementById('contact-whatsapp-btn');
  
  if (!form || !gmailBtn || !whatsappBtn) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMessage = document.getElementById('error-message');

  const recipientEmail = 'mail4rviky@gmail.com';
  const whatsappNumber = '919942286899';

  // Helper to show inline error with animation
  function showError(inputEl, errorEl, message) {
    errorEl.querySelector('span').textContent = message;
    errorEl.classList.remove('hidden');
    // Force layout reflow
    errorEl.offsetHeight;
    errorEl.classList.remove('opacity-0', '-translate-y-1');
    errorEl.classList.add('opacity-100', 'translate-y-0');
    
    // Highlight input border
    inputEl.classList.add('border-rose-500', 'focus:border-rose-500', 'dark:border-rose-500/50', 'dark:focus:border-rose-500');
    inputEl.classList.remove('border-slate-200', 'dark:border-slate-800/60');
  }

  // Helper to clear error
  function clearError(inputEl, errorEl) {
    if (errorEl.classList.contains('hidden')) return;
    errorEl.classList.remove('opacity-100', 'translate-y-0');
    errorEl.classList.add('opacity-0', '-translate-y-1');
    
    inputEl.classList.remove('border-rose-500', 'focus:border-rose-500', 'dark:border-rose-500/50', 'dark:focus:border-rose-500');
    inputEl.classList.add('border-slate-200', 'dark:border-slate-800/60');
    
    const onTransitionEnd = () => {
      errorEl.classList.add('hidden');
      errorEl.removeEventListener('transitionend', onTransitionEnd);
    };
    errorEl.addEventListener('transitionend', onTransitionEnd);
  }

  // Handle errors closing on input
  nameInput.addEventListener('input', () => clearError(nameInput, errorName));
  emailInput.addEventListener('input', () => clearError(emailInput, errorEmail));
  messageInput.addEventListener('input', () => clearError(messageInput, errorMessage));

  // Perform form validation
  function validate() {
    let isValid = true;
    
    // Validate Name
    const nameVal = nameInput.value.trim();
    if (nameVal === '') {
      showError(nameInput, errorName, 'Name is required');
      isValid = false;
    } else {
      clearError(nameInput, errorName);
    }

    // Validate Email
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVal === '') {
      showError(emailInput, errorEmail, 'Email address is required');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      showError(emailInput, errorEmail, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(emailInput, errorEmail);
    }

    // Validate Message
    const messageVal = messageInput.value.trim();
    if (messageVal === '') {
      showError(messageInput, errorMessage, 'Message is required');
      isValid = false;
    } else {
      clearError(messageInput, errorMessage);
    }

    return isValid;
  }

  // Handle Gmail compose opening
  gmailBtn.addEventListener('click', () => {
    if (!validate()) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}\n\nEmail: ${email}\n\nMessage:\n${message}`;

    // Gmail Web compose link
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  });

  // Handle WhatsApp compose opening
  whatsappBtn.addEventListener('click', () => {
    if (!validate()) return;

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    const text = `Hi Vigneshwaran,\n\nName: ${name}\n\nMessage:\n${message}`;

    // WhatsApp wa.me link
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  });
}
