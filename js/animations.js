// Prevent animation jumpiness
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth Scrolling with Lenis
const lenis = window.Lenis && !prefersReducedMotion
  ? new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
  : null;

if (lenis) {
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Custom Cursor Initialization
function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  if (!dot || !outline || window.innerWidth < 901) return;

  window.addEventListener('mousemove', (event) => {
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    outline.animate(
      { left: `${event.clientX}px`, top: `${event.clientY}px` },
      { duration: 400, fill: 'forwards', easing: 'ease-out' }
    );
  });

  document.querySelectorAll('a, button, input, textarea, .interactive, .magnetic-btn, .group\\/item').forEach((element) => {
    element.addEventListener('mouseenter', () => outline.classList.add('is-hovering'));
    element.addEventListener('mouseleave', () => outline.classList.remove('is-hovering'));
  });
}

// Magnetic Button Logic
function initMagneticButtons() {
  document.querySelectorAll('.magnetic-btn').forEach((button) => {
    button.addEventListener('mousemove', (event) => {
      if (window.innerWidth < 901) return;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const cta = document.querySelector('.magnetic-btn');

  if(menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isHidden = nav.classList.contains('hidden');
      if (isHidden) {
        nav.classList.remove('hidden');
        nav.classList.add('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-panel/95', 'backdrop-blur-xl', 'p-6', 'rounded-2xl', 'mt-4', 'border', 'border-white/10');
        if(cta && cta.classList.contains('hidden')) {
           cta.classList.remove('hidden');
           cta.classList.add('flex', 'mt-6');
           nav.appendChild(cta);
        }
      } else {
        nav.classList.add('hidden');
        nav.classList.remove('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-panel/95', 'backdrop-blur-xl', 'p-6', 'rounded-2xl', 'mt-4', 'border', 'border-white/10');
      }
    });
  }
}

// GSAP Animations Initialization
function initGsap() {
  if (!window.gsap || prefersReducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Text Splitting & Reveal
  if (window.SplitType) {
    document.querySelectorAll('.split-title').forEach((title) => {
      const split = new SplitType(title, { types: 'lines, words' });
      gsap.from(split.words, {
        y: 40,
        opacity: 0,
        rotationX: -40,
        duration: 1.2,
        stagger: 0.04,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
        },
      });
    });
  }

  // Fade Up Elements
  gsap.utils.toArray('.gsap-fade-up').forEach((element) => {
    gsap.from(element, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
      },
    });
  });

  // Staggered Lists
  gsap.utils.toArray('.gsap-stagger-list').forEach((list) => {
    gsap.from(list.children, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: list,
        start: 'top 85%',
      },
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initMagneticButtons();
  initMobileMenu();
});

window.addEventListener('load', () => {
  initGsap();
});
