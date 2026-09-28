/**
 * Shamitha Yangala Portfolio Scripts
 * Handles:
 * - Typewriter text effect
 * - Mobile hamburger menu
 * - Scroll progress indicator
 * - Navbar scroll state
 * - Project filtering
 * - Animated number counters
 * - Copy to clipboard & Toast notifications
 * - Back to top button
 * - Particle canvas background
 */

document.addEventListener('DOMContentLoaded', () => {
  // ─── 1. TYPEWRITER EFFECT ─────────────────────────────
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const phrases = [
      'Python Backend Developer',
      'Django & DRF Specialist',
      'GeoDjango & GIS Architect',
      'Celery & Async Systems Engineer',
      'AI & RAG Applications Builder'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 1800; // Pause at end of phrase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 350; // Pause before new phrase
      }

      setTimeout(typeLoop, typingSpeed);
    }
    typeLoop();
  }

  // ─── 2. SCROLL PROGRESS & NAVBAR STYLING ───────────────
  const scrollProgress = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent}%`;
    }

    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTop) {
      if (scrollTop > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  // ─── 3. MOBILE MENU TOGGLE ─────────────────────────────
  const menuToggle  = document.getElementById('menu-toggle');
  const navMenu     = document.getElementById('nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');
  const sidebarClose = document.getElementById('sidebar-close');

  function openSidebar() {
    navMenu.classList.add('open');
    menuToggle.classList.add('active');
    if (navBackdrop) {
      navBackdrop.style.display = 'block';
      // Force reflow so transition fires
      navBackdrop.offsetHeight;
      navBackdrop.classList.add('active');
    }
    document.body.style.overflow = 'hidden'; // prevent scroll behind
  }

  function closeSidebar() {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    if (navBackdrop) {
      navBackdrop.classList.remove('active');
      setTimeout(() => { navBackdrop.style.display = 'none'; }, 300);
    }
    document.body.style.overflow = '';
  }

  if (menuToggle && navMenu) {
    // Toggle on hamburger click
    menuToggle.addEventListener('click', () => {
      navMenu.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    // X button inside sidebar
    if (sidebarClose) {
      sidebarClose.addEventListener('click', closeSidebar);
    }

    // Close when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });

    // Close when clicking the backdrop
    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeSidebar);
    }

    // Close when clicking anywhere outside the menu or toggle button
    document.addEventListener('click', (e) => {
      const isInsideMenu = navMenu.contains(e.target);
      const isToggleBtn  = menuToggle.contains(e.target);
      if (!isInsideMenu && !isToggleBtn && navMenu.classList.contains('open')) {
        closeSidebar();
      }
    });
  }




  // ─── 4. PROJECT CATEGORY FILTERS ───────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const categories = category.split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.display = 'flex';
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });

  // Mobile / Click toggle for expandable project cards
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't toggle if clicking an interactive link or button
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      card.classList.toggle('is-expanded');
    });
  });

  // ─── 5. ANIMATED NUMBER COUNTERS ───────────────────────
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 40));

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = count;
        }
      }, 30);
    });
  }

  const metricsSection = document.getElementById('metrics');
  if (metricsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        runCounters();
      }
    }, { threshold: 0.3 });
    observer.observe(metricsSection);
  } else {
    runCounters();
  }

  // ─── 6. COPY TO CLIPBOARD & TOAST ───────────────────────
  const toast = document.getElementById('toast');
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  const copyButtons = document.querySelectorAll('.copy-btn[data-clipboard]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-clipboard');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          showToast(`Copied: ${textToCopy}`);
        });
      } else {
        showToast(`Copied: ${textToCopy}`);
      }
    });
  });

  // ─── 7. PARTICLE BACKGROUND CANVAS ─────────────────────
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(50, Math.floor(window.innerWidth / 25));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }
});
