// script.js

// 1. Initialize GSAP & ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 2. Initialize Lenis
const isMobileDevice = window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

const lenis = new Lenis({
  lerp: isMobileDevice ? 0.1 : 0.05,
  duration: isMobileDevice ? 1.0 : 1.5,
  smoothTouch: false,
  syncTouch: false
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// CUSTOM CURSOR (Precision Reticle)
const cursor = document.getElementById('custom-cursor');
const cursorSvg = document.getElementById('cursor-svg');
const cursorLines = document.querySelectorAll('.cursor-line');
const hoverElements = document.querySelectorAll('.cursor-hover');

const isDesktopCursor = window.innerWidth >= 1024 && !(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));

if (isDesktopCursor && cursor) {
    // Basic mouse follow
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { 
            x: e.clientX, 
            y: e.clientY, 
            duration: 0.1, 
            ease: "power2.out" 
        });
    });

    // Hover interactions for the Reticle
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            // Rotate the crosshair 45deg to form an 'X'
            gsap.to(cursorSvg, { rotation: 45, scale: 1.2, duration: 0.3, ease: "back.out(1.7)" });
            // Make lines longer
            gsap.to(cursorLines, { strokeWidth: 2, duration: 0.3 });
        });

        el.addEventListener('mouseleave', () => {
            // Revert back to crosshair '+'
            gsap.to(cursorSvg, { rotation: 0, scale: 1, duration: 0.3, ease: "power2.out" });
            gsap.to(cursorLines, { strokeWidth: 1.5, duration: 0.3 });
        });
    });
} else if (cursor) {
    cursor.style.display = 'none';
}

// Navbar blurring & Scroll to Top button visibility
const navBg = document.getElementById('nav-bg');
const scrollTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navBg.classList.add('bg-base/90');
    navBg.classList.remove('bg-base/60');
  } else {
    navBg.classList.add('bg-base/60');
    navBg.classList.remove('bg-base/90');
  }

  if (window.scrollY > window.innerHeight) {
      scrollTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
  } else {
      scrollTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
  }
});

// Scroll to Top action via Lenis
scrollTopBtn.addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 1.5 });
});

// Smooth Scroll for Nav Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if(href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            closeMobileMenu();
            lenis.scrollTo(href, { offset: -100 });
        } else if (href === "#") {
            e.preventDefault();
            closeMobileMenu();
            lenis.scrollTo(0);
        }
    });
});

// ── HAMBURGER MENU ────────────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu   = document.getElementById('mobile-menu');
const hamLines     = document.querySelectorAll('.ham-line');
let menuOpen = false;

function openMobileMenu() {
  menuOpen = true;
  mobileMenu.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-[-20px]');
  mobileMenu.classList.add('opacity-100', 'translate-y-0');
  // Animate hamburger → X
  gsap.to(hamLines[0], { rotation: 45,  y: 7.5, duration: 0.3, ease: 'power3.out' });
  gsap.to(hamLines[1], { opacity: 0,    duration: 0.2 });
  gsap.to(hamLines[2], { rotation: -45, y: -7.5, width: '28px', duration: 0.3, ease: 'power3.out' });
  // Stagger in menu links
  gsap.fromTo('.mobile-nav-link',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08, delay: 0.1 }
  );
  lenis.stop();
}

function closeMobileMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  mobileMenu.classList.add('opacity-0', 'pointer-events-none', 'translate-y-[-20px]');
  mobileMenu.classList.remove('opacity-100', 'translate-y-0');
  // Revert hamburger lines
  gsap.to(hamLines[0], { rotation: 0, y: 0,   duration: 0.3, ease: 'power3.out' });
  gsap.to(hamLines[1], { opacity: 1,           duration: 0.2, delay: 0.1 });
  gsap.to(hamLines[2], { rotation: 0, y: 0, width: '20px', duration: 0.3, ease: 'power3.out' });
  lenis.start();
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    menuOpen ? closeMobileMenu() : openMobileMenu();
  });
}

// MODAL LOGIC
const modal = document.getElementById('info-modal');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const modalTag = document.getElementById('modal-tag');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalImg = document.getElementById('modal-img');
const openModalBtns = document.querySelectorAll('.open-modal-btn');

openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const { tag, title, desc, img } = e.target.dataset;
        modalTag.textContent = tag;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalImg.src = img;
        
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modalContent.classList.remove('translate-y-10');
        lenis.stop();
    });
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.add('translate-y-10');
    lenis.start();
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modalContent.classList.add('translate-y-10');
        lenis.start();
    }
});


// Hero GSAP Animations (No ThreeJS)
function initHeroAnimations() {
  const tl = gsap.timeline({ delay: 0.2 });
  
  tl.fromTo(".hero-title", 
    { y: 40, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 1.2, 
      ease: "power4.out",
      onStart: () => {
        const el = document.querySelector(".hero-title");
        if (el) el.classList.remove("opacity-0", "translate-y-10");
      },
      onComplete: () => {
        gsap.set(".hero-title", { opacity: 1, y: 0, clearProps: "transform" });
      }
    }
  )
  .fromTo(".hero-subtitle", 
    { y: 30, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 1.0, 
      ease: "power3.out",
      onStart: () => {
        const el = document.querySelector(".hero-subtitle");
        if (el) el.classList.remove("opacity-0", "translate-y-10");
      },
      onComplete: () => {
        gsap.set(".hero-subtitle", { opacity: 1, y: 0, clearProps: "transform" });
      }
    },
    "+=0.2" // Play only after the main title has fully finished appearing
  );

  // Parallax the huge full screen background image
  gsap.fromTo("#hero-parallax-wrapper", 
    { yPercent: 0 },
    {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    }
  );

  // Safety Fallback: If animations are blocked, force visibility
  setTimeout(() => {
    const title = document.querySelector(".hero-title");
    const subtitle = document.querySelector(".hero-subtitle");
    if (title && (window.getComputedStyle(title).opacity === "0" || title.classList.contains("opacity-0"))) {
      title.classList.remove("opacity-0", "translate-y-10");
      gsap.set(title, { opacity: 1, y: 0, clearProps: "transform" });
    }
    if (subtitle && (window.getComputedStyle(subtitle).opacity === "0" || subtitle.classList.contains("opacity-0"))) {
      subtitle.classList.remove("opacity-0", "translate-y-10");
      gsap.set(subtitle, { opacity: 1, y: 0, clearProps: "transform" });
    }
  }, 2500);
}

// Global scope for frames
const canvasImages = [];
const frameCount = 479;
const isMobileSeq = window.innerWidth < 768;
const stepSeq = isMobileSeq ? 3 : 1;
const totalFramesToLoad = Math.ceil(frameCount / stepSeq);

function preloadFrames(onProgress, onComplete) {
    let loaded = 0;
    let hasCompleted = false;
    const currentFrame = index => `./public/assets/images/frames/${(index + 1).toString().padStart(5, '0')}.webp`;
    
    for (let i = 0; i < frameCount; i += stepSeq) {
        const img = new Image();
        img.src = currentFrame(i);
        
        const handleLoad = () => {
            loaded++;
            if (onProgress && !hasCompleted) onProgress(loaded / totalFramesToLoad);
            if (loaded === totalFramesToLoad && onComplete && !hasCompleted) {
                hasCompleted = true;
                onComplete();
            }
        };
        
        if (img.complete) {
            handleLoad();
        } else {
            img.onload = handleLoad;
            img.onerror = handleLoad;
        }
        
        canvasImages.push(img);
    }
    
    if (loaded === totalFramesToLoad && onComplete && !hasCompleted) {
        hasCompleted = true;
        onComplete();
    }
}

// Canvas Image Sequence for Cinematic Story
function initSequence() {
  const canvas = document.getElementById('sequence-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');

  canvas.width = 1920;
  canvas.height = 1080;

  const seq = { frame: 0 };

  if (canvasImages.length > 0) {
      const firstImg = canvasImages[0];
      if (firstImg.complete && firstImg.naturalWidth > 0) {
          context.drawImage(firstImg, 0, 0, canvas.width, canvas.height);
      } else {
          firstImg.addEventListener('load', () => {
              context.drawImage(firstImg, 0, 0, canvas.width, canvas.height);
          });
      }
  }

  gsap.to(seq, {
    frame: canvasImages.length - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: "#cinematic-section",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
    },
    onUpdate: render
  });

  function render() {
    try {
      const activeImg = canvasImages[Math.round(seq.frame)];
      if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(activeImg, 0, 0, canvas.width, canvas.height);
      }
    } catch (e) {
      // Gracefully bypass any temporary drawing errors
    }
  }

  // General Slide Up Animation for elements with class .slide-up-element
  const slideElements = document.querySelectorAll('.slide-up-element');
  slideElements.forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, y: 100 },
      {
        opacity: 1, y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        }
      }
    );
  });
}

// ============================================================
//  ADVANCED SCROLL ANIMATIONS — per-section, per-element
// ============================================================
function initAdvancedScrollAnimations() {

  const TA = 'play none none reverse'; // toggleActions shorthand

  // Helper: clip-path reveal from bottom
  const clipFromBottom = (el, trigger, opts = {}) => {
    gsap.fromTo(el,
      { clipPath: 'inset(100% 0 0 0)', y: 40, opacity: 0 },
      { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1,
        duration: opts.duration || 1.1, ease: opts.ease || 'power4.out', delay: opts.delay || 0,
        scrollTrigger: { trigger, start: 'top 82%', toggleActions: TA, ...opts.st }
      }
    );
  };

  // Helper: clip-path reveal from left
  const clipFromLeft = (el, trigger, opts = {}) => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)', x: -30, opacity: 0 },
      { clipPath: 'inset(0 0% 0 0)', x: 0, opacity: 1,
        duration: opts.duration || 1.0, ease: 'power3.out', delay: opts.delay || 0,
        scrollTrigger: { trigger, start: 'top 82%', toggleActions: TA, ...opts.st }
      }
    );
  };

  // Helper: clip-path reveal from right
  const clipFromRight = (el, trigger, opts = {}) => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 0 0 100%)', x: 30, opacity: 0 },
      { clipPath: 'inset(0 0 0 0%)', x: 0, opacity: 1,
        duration: opts.duration || 1.0, ease: 'power3.out', delay: opts.delay || 0,
        scrollTrigger: { trigger, start: 'top 82%', toggleActions: TA, ...opts.st }
      }
    );
  };

  // Helper: skewed slide-up
  const skewUp = (el, trigger, opts = {}) => {
    gsap.fromTo(el,
      { y: 80, skewY: 4, opacity: 0 },
      { y: 0, skewY: 0, opacity: 1,
        duration: opts.duration || 1.2, ease: 'power4.out', delay: opts.delay || 0,
        scrollTrigger: { trigger, start: 'top 84%', toggleActions: TA, ...opts.st }
      }
    );
  };

  // Helper: scale + fade pop-in
  const scalePop = (el, trigger, opts = {}) => {
    gsap.fromTo(el,
      { scale: 0.82, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0,
        duration: opts.duration || 0.9, ease: 'back.out(1.4)', delay: opts.delay || 0,
        scrollTrigger: { trigger, start: 'top 85%', toggleActions: TA, ...opts.st }
      }
    );
  };

  // Helper: stagger children
  const staggerChildren = (parent, selector, from, to, staggerVal = 0.12, trigger) => {
    const els = parent.querySelectorAll(selector);
    if (!els.length) return;
    gsap.fromTo(els, from, {
      ...to,
      stagger: staggerVal,
      scrollTrigger: { trigger: trigger || parent, start: 'top 82%', toggleActions: TA }
    });
  };

  // ── ENGINEERING / BENTO SECTION ──────────────────────────────
  const engSection = document.getElementById('engineering');
  if (engSection) {
    // Section heading — skewed entry from left
    const engH2 = engSection.querySelector('h2');
    if (engH2) skewUp(engH2, engSection, { duration: 1.3 });

    // Section description — slides from right
    const engDesc = engSection.querySelector('.max-w-xl p');
    if (engDesc) clipFromRight(engDesc, engSection, { delay: 0.2 });

    // Large bento card — clip from bottom
    const largeCard = engSection.querySelector('.md\\:col-span-8');
    if (largeCard) {
      clipFromBottom(largeCard, largeCard, { duration: 1.3 });
      // Its inner label + h3 + p stagger up
      staggerChildren(largeCard, 'p, h3',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        0.15, largeCard
      );
    }

    // Hermetic Integrity text card — slides from right with perspective
    const textCard = engSection.querySelector('.eng-text-card');
    if (textCard) {
      gsap.fromTo(textCard,
        { x: 80, opacity: 0, rotateY: -8 },
        { x: 0, opacity: 1, rotateY: 0,
          duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: textCard, start: 'top 84%', toggleActions: TA }
        }
      );
      // Shield icon pops in
      const icon = textCard.querySelector('svg');
      if (icon) scalePop(icon, textCard, { delay: 0.4 });
    }

    // Anodized Finish image card — clips from left
    const anodizedCard = engSection.querySelector('.flex-\\[1\\.5\\]');
    if (anodizedCard) clipFromLeft(anodizedCard, anodizedCard, { duration: 1.2, delay: 0.15 });

    // Full-width bottom card — horizontal wipe from left
    const wideCard = engSection.querySelector('.md\\:col-span-12');
    if (wideCard) {
      gsap.fromTo(wideCard,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1,
          duration: 1.4, ease: 'power3.inOut',
          scrollTrigger: { trigger: wideCard, start: 'top 86%', toggleActions: TA }
        }
      );
      const wideH3 = wideCard.querySelector('h3');
      if (wideH3) {
        gsap.fromTo(wideH3,
          { y: 50, opacity: 0, letterSpacing: '0.4em' },
          { y: 0, opacity: 1, letterSpacing: '0.25em',
            duration: 1.1, ease: 'power3.out', delay: 0.5,
            scrollTrigger: { trigger: wideCard, start: 'top 86%', toggleActions: TA }
          }
        );
      }
    }
  }

  // ── VIDEO SECTION ─────────────────────────────────────────────
  const videoSection = document.querySelector('section.w-full.bg-base.border-t.border-borderSubtle.overflow-hidden');
  if (videoSection) {
    const videoTag   = videoSection.querySelector('p.text-gold');
    const videoH2    = videoSection.querySelector('h2');
    const videoDesc  = videoSection.querySelector('p.text-textMuted');
    const videoWrap  = videoSection.querySelector('.relative.w-full');

    if (videoTag)  clipFromLeft(videoTag, videoSection, { duration: 0.8 });
    if (videoH2)   skewUp(videoH2, videoSection, { duration: 1.2, delay: 0.1 });
    if (videoDesc) clipFromRight(videoDesc, videoSection, { duration: 0.9, delay: 0.2 });

    if (videoWrap) {
      gsap.fromTo(videoWrap,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1,
          duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: videoWrap, start: 'top 88%', toggleActions: TA }
        }
      );
    }
  }

  // ── CONTACT SECTION ───────────────────────────────────────────
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    const contactTag  = contactSection.querySelector('p.text-gold');
    const contactH2   = contactSection.querySelector('h2');
    const contactDesc = contactSection.querySelector('.contact-desc');
    const contactLinks = contactSection.querySelectorAll('a');
    const formPanel   = contactSection.querySelector('.flex-\\[1\\.2\\]');
    const formFields  = contactSection.querySelectorAll('.relative.group');
    const submitBtn   = contactSection.querySelector('button[type="submit"]');

    if (contactTag)  clipFromLeft(contactTag, contactSection, { duration: 0.7 });
    if (contactH2)   skewUp(contactH2, contactSection, { duration: 1.3, delay: 0.1 });
    if (contactDesc) {
      gsap.fromTo(contactDesc,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.25,
          scrollTrigger: { trigger: contactSection, start: 'top 80%', toggleActions: TA }
        }
      );
    }

    if (contactLinks.length) {
      gsap.fromTo(contactLinks,
        { y: 30, opacity: 0, skewX: -4 },
        { y: 0, opacity: 1, skewX: 0,
          duration: 0.9, ease: 'power3.out', stagger: 0.15, delay: 0.3,
          scrollTrigger: { trigger: contactSection, start: 'top 78%', toggleActions: TA }
        }
      );
    }

    if (formPanel) {
      gsap.fromTo(formPanel,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: formPanel, start: 'top 84%', toggleActions: TA }
        }
      );
    }

    if (formFields.length) {
      gsap.fromTo(formFields,
        { clipPath: 'inset(0 0 100% 0)', y: 20, opacity: 0 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1,
          duration: 0.7, ease: 'power3.out', stagger: 0.14, delay: 0.4,
          scrollTrigger: { trigger: formPanel, start: 'top 84%', toggleActions: TA }
        }
      );
    }

    // Submit button pops
    if (submitBtn) scalePop(submitBtn, formPanel || contactSection, { delay: 0.9 });
  }

  // ── CTA BANNER ────────────────────────────────────────────────
  const ctaSection = document.querySelector('section.relative.w-full.py-48');
  if (ctaSection) {
    const ctaTag  = ctaSection.querySelector('div.text-gold');
    const ctaH2   = ctaSection.querySelector('h2');
    const ctaBtn  = ctaSection.querySelector('button');

    if (ctaTag) {
      gsap.fromTo(ctaTag,
        { y: -30, opacity: 0, letterSpacing: '0.6em' },
        { y: 0, opacity: 1, letterSpacing: '0.25em',
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: ctaSection, start: 'top 80%', toggleActions: TA }
        }
      );
    }
    if (ctaH2) {
      gsap.fromTo(ctaH2,
        { scale: 0.88, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0,
          duration: 1.3, ease: 'power4.out', delay: 0.15,
          scrollTrigger: { trigger: ctaSection, start: 'top 80%', toggleActions: TA }
        }
      );
    }
    if (ctaBtn) scalePop(ctaBtn, ctaSection, { delay: 0.45 });
  }

  // ── FOOTER ────────────────────────────────────────────────────
  const footer = document.querySelector('footer');
  if (footer) {
    // Logo
    const footerLogo = footer.querySelector('img');
    if (footerLogo) clipFromLeft(footerLogo, footer, { duration: 0.9 });

    // Tagline
    const footerTagline = footer.querySelector('p.text-textMuted');
    if (footerTagline) {
      gsap.fromTo(footerTagline,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: footer, start: 'top 88%', toggleActions: TA }
        }
      );
    }

    const socials = footer.querySelectorAll('a[aria-label]');
    if (socials.length) {
      gsap.fromTo(socials,
        { scale: 0, opacity: 0, rotation: -15 },
        { scale: 1, opacity: 1, rotation: 0,
          duration: 0.6, ease: 'back.out(1.8)', stagger: 0.1, delay: 0.3,
          scrollTrigger: { trigger: footer, start: 'top 88%', toggleActions: TA }
        }
      );
    }

    const colHeaders = footer.querySelectorAll('p.text-white.font-sans.font-bold');
    if (colHeaders.length) {
      gsap.fromTo(colHeaders,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1,
          duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.1,
          scrollTrigger: { trigger: footer, start: 'top 88%', toggleActions: TA }
        }
      );
    }

    const footerLinks = footer.querySelectorAll('ul li');
    if (footerLinks.length) {
      gsap.fromTo(footerLinks,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1,
          duration: 0.6, ease: 'power2.out', stagger: 0.07, delay: 0.25,
          scrollTrigger: { trigger: footer, start: 'top 88%', toggleActions: TA }
        }
      );
    }

    const legalRow = footer.querySelector('.py-8');
    if (legalRow) {
      gsap.fromTo(legalRow,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: legalRow, start: 'top 95%', toggleActions: TA }
        }
      );
    }
  }

  // ── CINEMATIC STORY PANELS (slide-up-element override) ────────
  // Already handled by initSequence, but let's enhance them
  document.querySelectorAll('.story-panel > div').forEach((panel, i) => {
    const isMobile = window.innerWidth < 768;
    const startX = isMobile ? 0 : (i % 2 === 0 ? -60 : 60);
    const startY = isMobile ? 40 : 0;
    
    gsap.fromTo(panel,
      { x: startX, y: startY, opacity: 0, scale: 0.96 },
      { x: 0, y: 0, opacity: 1, scale: 1,
        duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: panel, start: 'top 84%' }
      }
    );
  });

}


// Scroll Text Reveal — gradient position scrub
function initScrollTextReveal() {
  const lines = document.querySelectorAll('.scroll-reveal-line');
  if (!lines.length) return;

  gsap.to(lines, {
    backgroundPositionX: '0%',
    stagger: 0.5,
    ease: 'none',
    scrollTrigger: {
      trigger: '#quote-text-block',
      start: 'top 80%',
      end: 'bottom 80%',
      scrub: 1.5,
    }
  });
}

// CTA Parallax Background
function initCTA() {
  const ctaBg = document.getElementById('cta-parallax-wrapper');
  if(ctaBg) {
    gsap.fromTo(ctaBg, 
      { yPercent: 0 },
      {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ctaBg.parentElement.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  }
}

// Preloader Logic
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const logo   = document.getElementById('preloader-logo');
  const circle = document.getElementById('preloader-circle');
  const text   = document.getElementById('preloader-text');
  const pct    = document.getElementById('preloader-pct');

  // Culinary & preservation themed phrases cycling during loading
  const loadingPhrases = [
    { threshold: 20, text: "Analyzing Cellular Integrity" },
    { threshold: 40, text: "Calibrating Hermetic Seal" },
    { threshold: 60, text: "Optimizing Preservation Chambers" },
    { threshold: 80, text: "Synchronizing Culinary Systems" },
    { threshold: 95, text: "Staging Premium Experience" },
    { threshold: 100, text: "Gastronomy Perfected" }
  ];

  // ── Session skip: if already shown this session, hide immediately ──
  if (sessionStorage.getItem('preloader_done') === '1') {
    preloader.style.display = 'none';
    preloadFrames(); // Still preload in background to populate canvasImages
    setTimeout(() => {
        lenis.start();
        initHeroAnimations();
        initSequence();
        initScrollTextReveal();
        initAdvancedScrollAnimations();
        initCTA();
        ScrollTrigger.refresh();
    }, 50);
    return;
  }

  // ── First visit in this session: run the full preloader ──
  lenis.stop();

  // Premium GSAP fade & scale for logo
  if (logo) {
    gsap.fromTo(logo, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.1 }
    );
  }

  preloadFrames(
    (progressFraction) => {
        let progress = Math.floor(progressFraction * 100);
        if (progress > 100) progress = 100;

        // Update progress circle SVG dashoffset (515.2 circumference)
        if (circle) {
            const offset = 515.2 - (progress / 100) * 515.2;
            gsap.to(circle, { strokeDashoffset: offset, duration: 0.3, ease: 'power1.out' });
        }
        if (pct) pct.textContent = `${progress}%`;

        // Find and update current culinary loading phrase
        if (text) {
            const currentPhrase = loadingPhrases.find(p => progress <= p.threshold);
            if (currentPhrase && text.textContent !== currentPhrase.text) {
                // Subtle fade transition for the text
                gsap.to(text, {
                    opacity: 0,
                    duration: 0.15,
                    onComplete: () => {
                        text.textContent = currentPhrase.text;
                        gsap.to(text, { opacity: 1, duration: 0.15 });
                    }
                });
            }
        }
    },
    () => {
        setTimeout(() => {
            // Trigger hero animations as the preloader fades out for a seamless transition
            initHeroAnimations();
            
            gsap.to(preloader, {
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                    preloader.style.display = 'none';
                    sessionStorage.setItem('preloader_done', '1'); // mark as shown
                    
                    setTimeout(() => {
                        lenis.start();

                        initSequence();
                        initScrollTextReveal();
                        initAdvancedScrollAnimations();
                        initCTA();

                        ScrollTrigger.refresh();
                    }, 50);
                }
            });
        }, 500);
    }
  );
}

// Initialize all
document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
});
