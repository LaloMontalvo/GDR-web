/* ============================================
   GDR Desarrollos Inmobiliarios — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollSpy();
  initHeroSlider();
  initScrollAnimations();
  initTimeline();
  initCounters();
  initAccordion();
  init3DCards();
  initProjectModal();
  initMobileVideo();
});

/* ── 3D Tilt Project Cards (Vanilla JS) ── */
function init3DCards() {
  const wraps = document.querySelectorAll('.card-wrap');
  if (wraps.length === 0) return;

  wraps.forEach(wrap => {
    const card = wrap.querySelector('.card-3d');
    const bg = wrap.querySelector('.card-3d__bg');
    const image = wrap.dataset.image;

    // Set background image
    if (bg && image) {
      bg.style.backgroundImage = `url(${image})`;
    }

    let mouseX = 0, mouseY = 0;
    let leaveTimeout = null;

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      mouseX = e.clientX - rect.left - w / 2;
      mouseY = e.clientY - rect.top - h / 2;
      const pX = mouseX / w;
      const pY = mouseY / h;

      const rX = pX * 30;
      const rY = pY * -30;
      const tX = pX * -40;
      const tY = pY * -40;

      if (card) card.style.transform = `rotateY(${rX}deg) rotateX(${rY}deg)`;
      if (bg) bg.style.transform = `translateX(${tX}px) translateY(${tY}px)`;
    });

    wrap.addEventListener('mouseenter', () => {
      clearTimeout(leaveTimeout);
    });

    wrap.addEventListener('mouseleave', () => {
      leaveTimeout = setTimeout(() => {
        if (card) card.style.transform = '';
        if (bg) bg.style.transform = '';
      }, 1000);
    });
  });
}

/* ── Hero Slider (Expandable Cards) ── */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider__list');
  if (!slider) return;

  const nextBtn = document.querySelector('.hero-slider__btn.next');
  const prevBtn = document.querySelector('.hero-slider__btn.prev');

  function goNext() {
    const items = slider.querySelectorAll('.hero-slider__item');
    slider.append(items[0]);
  }

  function goPrev() {
    const items = slider.querySelectorAll('.hero-slider__item');
    slider.prepend(items[items.length - 1]);
  }

  if (nextBtn) nextBtn.addEventListener('click', goNext);
  if (prevBtn) prevBtn.addEventListener('click', goPrev);

  // Autoplay every 5 seconds
  let autoplay = setInterval(goNext, 5000);

  // Pause on hover
  const sliderSection = document.querySelector('.hero-slider');
  if (sliderSection) {
    sliderSection.addEventListener('mouseenter', () => clearInterval(autoplay));
    sliderSection.addEventListener('mouseleave', () => {
      autoplay = setInterval(goNext, 5000);
    });
  }
}

/* ── Header Scroll Effect ── */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Scroll Spy — Highlight active nav link ── */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav__link');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  const sections = [];

  // Collect sections referenced by nav links
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ id: href, el: section });
    }
  });

  if (sections.length === 0) return;

  const headerHeight = 100;

  function updateActive() {
    const scrollY = window.scrollY + headerHeight + 50;
    let currentId = sections[0].id;

    for (const section of sections) {
      if (scrollY >= section.el.offsetTop) {
        currentId = section.id;
      }
    }

    // Update desktop nav
    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href') === currentId) {
        link.classList.add('nav__link--active');
      }
    });

    // Update mobile nav
    mobileLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href') === currentId) {
        link.classList.add('nav__link--active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll Animations (IntersectionObserver) ── */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el, i) => {
    // Auto-stagger children if no explicit delay
    if (!el.dataset.delay && el.parentElement) {
      const siblings = el.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      const idx = Array.from(siblings).indexOf(el);
      if (idx > 0) {
        el.dataset.delay = idx * 100;
      }
    }
    observer.observe(el);
  });
}

/* ── Timeline Interactive Tabs ── */
function initTimeline() {
  const tabs = document.querySelectorAll('.timeline__tab');
  const contents = document.querySelectorAll('.timeline__content');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.stage;

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update content
      contents.forEach(c => {
        c.classList.remove('active');
        if (c.dataset.stage === target) {
          c.classList.add('active');
        }
      });
    });
  });
}

/* ── Counter Animation ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    const current = Math.floor(eased * target);

    el.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ── Accordion ── */
function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header');
  if (headers.length === 0) return;

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ── Project Filters ── */
function initProjectFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');
  if (tabs.length === 0 || cards.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter cards
      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ── Smooth scroll for anchor links ── */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href');
  if (targetId === '#') return;

  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    e.preventDefault();
    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
    const top = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }
});

/* ── Project Detail Modal with Carousel ── */
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const backdrop = document.getElementById('projectModalBackdrop');
  const closeBtn = document.getElementById('projectModalClose');
  const carousel = document.getElementById('projectCarousel');
  const dotsContainer = document.getElementById('projectDots');
  const counter = document.getElementById('projectCounter');
  const prevBtn = document.getElementById('projectPrev');
  const nextBtn = document.getElementById('projectNext');
  const ctaBtn = document.getElementById('modalCTA');

  if (!modal || !carousel) return;

  let currentSlide = 0;
  let totalSlides = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  // Open modal when a project card is clicked
  const cardWraps = document.querySelectorAll('.card-wrap');
  cardWraps.forEach(wrap => {
    wrap.addEventListener('click', (e) => {
      // Don't open if they're just hovering for 3D effect
      openProjectModal(wrap);
    });
  });

  function openProjectModal(cardEl) {
    const title = cardEl.dataset.projectTitle || '';
    const category = cardEl.dataset.projectCategory || '';
    const location = cardEl.dataset.projectLocation || '';
    const year = cardEl.dataset.projectYear || '';
    const area = cardEl.dataset.projectArea || '';
    const status = cardEl.dataset.projectStatus || '';
    const desc = cardEl.dataset.projectDesc || '';
    const galleryStr = cardEl.dataset.projectGallery || '';
    const images = galleryStr.split(',').filter(Boolean);

    // Populate info
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalCategory').textContent = category;
    document.getElementById('modalLocation').textContent = location;
    document.getElementById('modalYear').textContent = year;
    document.getElementById('modalArea').textContent = area;
    
    const statusEl = document.getElementById('modalStatus');
    statusEl.textContent = status;
    // Color-code the status
    if (status === 'Entregado') {
      statusEl.style.color = '#4ade80';
    } else if (status === 'En Construcción') {
      statusEl.style.color = '#fbbf24';
    } else {
      statusEl.style.color = '#60a5fa';
    }

    document.getElementById('modalDesc').textContent = desc;

    // Build carousel slides
    carousel.innerHTML = '';
    dotsContainer.innerHTML = '';
    totalSlides = images.length;
    currentSlide = 0;

    images.forEach((src, index) => {
      // Slide
      const slide = document.createElement('div');
      slide.className = 'project-modal__slide' + (index === 0 ? ' active' : '');
      const img = document.createElement('img');
      img.src = src.trim();
      img.alt = `${title} — Imagen ${index + 1}`;
      img.loading = 'lazy';
      slide.appendChild(img);
      carousel.appendChild(slide);

      // Dot
      const dot = document.createElement('button');
      dot.className = 'project-modal__dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Imagen ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    updateCounter();

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    const slides = carousel.querySelectorAll('.project-modal__slide');
    const dots = dotsContainer.querySelectorAll('.project-modal__dot');

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = index;
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
    updateCounter();
  }

  function nextSlide() {
    goToSlide(currentSlide >= totalSlides - 1 ? 0 : currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide <= 0 ? totalSlides - 1 : currentSlide - 1);
  }

  function updateCounter() {
    if (counter) {
      counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }
  }

  // Event listeners
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // CTA button closes the modal and scrolls to contact
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      closeModal();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowRight':
        nextSlide();
        break;
      case 'ArrowLeft':
        prevSlide();
        break;
    }
  });

  // Touch swipe support
  const carouselSection = document.querySelector('.project-modal__carousel-section');
  if (carouselSection) {
    carouselSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 50;
    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      nextSlide(); // Swipe left → next
    } else {
      prevSlide(); // Swipe right → prev
    }
  }
}

/* ── Mobile Video Autoplay Fallback ── */
function initMobileVideo() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  // Attempt to play on first interaction if it's paused
  const playVideo = () => {
    if (video.paused) {
      video.play().catch(e => console.log('Autoplay preventions:', e));
    }
  };

  document.addEventListener('touchstart', playVideo, { once: true, passive: true });
  document.addEventListener('click', playVideo, { once: true, passive: true });
}

/* ── Contact Form AJAX Submission (EmailJS) ── */
window.addEventListener('load', function() {
  // Ensure EmailJS is loaded
  if (typeof emailjs === 'undefined') {
    console.error('EmailJS SDK not loaded');
    return;
  }

  // IMPORTANTE: Reemplaza 'TU_PUBLIC_KEY' con tu Public Key de EmailJS
  emailjs.init({
    publicKey: "ht8MejfeTbMaXBbpR",
  });

  /* ── Notification Modal System ── */
  const notifOverlay = document.getElementById('notifOverlay');
  const notifClose = document.getElementById('notifClose');
  const notifBtn = document.getElementById('notifBtn');
  const notifTitle = document.getElementById('notifTitle');
  const notifText = document.getElementById('notifText');
  const notifIconSuccess = document.getElementById('notifIconSuccess');
  const notifIconError = document.getElementById('notifIconError');

  function showNotification(type, title, message) {
    // Set content
    if (notifTitle) notifTitle.textContent = title;
    if (notifText) notifText.textContent = message;

    // Toggle icons
    if (type === 'success') {
      if (notifIconSuccess) notifIconSuccess.style.display = '';
      if (notifIconError) notifIconError.style.display = 'none';
    } else {
      if (notifIconSuccess) notifIconSuccess.style.display = 'none';
      if (notifIconError) notifIconError.style.display = '';
    }

    if (notifOverlay) {
      // Reset SVG animations by removing and re-adding active class
      notifOverlay.classList.remove('active');
      // Force reflow to restart animations
      void notifOverlay.offsetWidth;
      notifOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeNotification() {
    if (notifOverlay) {
      notifOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Close handlers
  if (notifClose) notifClose.addEventListener('click', closeNotification);
  if (notifBtn) notifBtn.addEventListener('click', closeNotification);
  if (notifOverlay) {
    notifOverlay.addEventListener('click', function(e) {
      if (e.target === notifOverlay) closeNotification();
    });
  }

  // Close with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && notifOverlay && notifOverlay.classList.contains('active')) {
      closeNotification();
    }
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = 'Enviando...';
      submitBtn.disabled = true;

      // IMPORTANTE: Reemplaza con tus IDs de EmailJS
      const serviceID = 'service_wt4mjg5';
      const templateID = 'template_0ulw53h';

      emailjs.sendForm(serviceID, templateID, contactForm)
        .then(function() {
          showNotification(
            'success',
            'Mensaje Enviado Exitosamente',
            'Hemos recibido tu mensaje. Nuestro equipo de GDR Desarrollos Inmobiliarios se pondrá en contacto contigo a la brevedad posible.'
          );
          contactForm.reset();
        }, function(error) {
          showNotification(
            'error',
            'Error al Enviar',
            'Ocurrió un problema al enviar tu mensaje. Por favor, intenta nuevamente o contáctanos directamente por teléfono.'
          );
          console.error('Error EmailJS:', error);
        })
        .finally(function() {
          submitBtn.innerText = originalBtnText;
          submitBtn.disabled = false;
        });
    });
  }
});
