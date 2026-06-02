/* =========================================
   EARL CEDRIC GUEVARRA — Portfolio Script
   ========================================= */

// ========== CUSTOM CURSOR ==========
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  trail.style.left = trailX + 'px';
  trail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// ========== LOADING SCREEN ==========
const loadingScreen = document.getElementById('loadingScreen');
const loadingProgressFill = document.getElementById('loadingProgressFill');
const loadingText = document.getElementById('loadingText');
const loadingPct = document.getElementById('loadingPct');
const loadingStatus = document.getElementById('loadingStatus');

if (loadingScreen && loadingProgressFill) {
  document.body.style.overflow = 'hidden';
  const minLoadingMs = 2800;
  const loadingStart = performance.now();

  const phases = [
    { at: 20, text: 'Loading assets',     status: 'Booting systems'  },
    { at: 45, text: 'Building interface', status: 'Rendering UI'      },
    { at: 70, text: 'Compiling projects', status: 'Almost there'      },
    { at: 90, text: 'Finalizing',         status: 'Final checks'      },
    { at: 100,text: 'Ready.',             status: 'Systems online'    },
  ];

  let progress = 0;
  const tick = () => {
    const bump = 2 + Math.random() * 5;
    progress = Math.min(progress + bump, 92);
    loadingProgressFill.style.width = progress + '%';
    if (loadingPct) loadingPct.textContent = Math.floor(progress) + '%';
    for (const p of phases) {
      if (progress >= p.at - 1) {
        if (loadingText) loadingText.textContent = p.text;
        if (loadingStatus) loadingStatus.textContent = p.status;
      }
    }
    if (progress < 92) requestAnimationFrame(tick);
  };

  // Start progress after letters animate in
  setTimeout(() => requestAnimationFrame(tick), 2000);

  window.addEventListener('load', () => {
    const elapsed = performance.now() - loadingStart;
    const remaining = Math.max(0, minLoadingMs - elapsed);
    setTimeout(() => {
      progress = 100;
      loadingProgressFill.style.width = '100%';
      if (loadingPct) loadingPct.textContent = '100%';
      if (loadingText) loadingText.textContent = 'Ready.';
      if (loadingStatus) loadingStatus.textContent = 'Systems online';
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          if (loadingScreen.parentNode) loadingScreen.parentNode.removeChild(loadingScreen);
          document.body.style.overflow = '';
        }, 850);
      }, 400);
    }, remaining);
  });
}

// Cursor state on hover
document.querySelectorAll('a, button, .project-card, .cert-card, .tool-chip').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursor.style.background = 'var(--accent2)';
    trail.style.borderColor = 'rgba(124,58,237,0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--accent)';
    trail.style.borderColor = 'rgba(0,229,255,0.4)';
  });
});

// ========== NAV SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ========== MOBILE MENU ==========
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
    mobileMenu.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// ========== INTERSECTION OBSERVER ==========
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
};

// Reveal up elements
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

// ========== SKILL BAR ANIMATION ==========
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar) => {
        const targetWidth = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = targetWidth + '%';
        }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillBars = document.querySelector('.skill-bars');
if (skillBars) skillObserver.observe(skillBars);

// ========== COUNTER ANIMATION ==========
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + (target >= 10 ? '+' : '');
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        const count = parseInt(num.getAttribute('data-count'));
        animateCounter(num, count);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statObserver.observe(statsEl);

// ========== SMOOTH SECTION REVEAL ==========
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll(
        '.project-card, .cert-card, .exp-card, .tool-chip, .skills-column, .stat'
      );
      children.forEach((child, index) => {
        setTimeout(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }, index * 80);
      });
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Set initial hidden state for staggered elements
document.querySelectorAll('.project-card, .cert-card, .exp-card, .tool-chip').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)';
});

document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

// ========== 3D TILT EFFECT on Project Cards ==========
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ========== ACTIVE NAV LINK ==========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObserver.observe(s));

// Add active style dynamically
const styleEl = document.createElement('style');
styleEl.textContent = `.nav-links a.active { color: var(--accent) !important; }`;
document.head.appendChild(styleEl);

// ========== PARALLAX ORBS ==========
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.orb1');
  const orb2 = document.querySelector('.orb2');
  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
  if (orb2) orb2.style.transform = `translateY(${scrollY * -0.1}px)`;
});

// ========== HERO PHOTO FALLBACK ==========
// If user's photo isn't found, use a styled placeholder
const aboutPhoto = document.getElementById('aboutPhoto');
if (aboutPhoto) {
  aboutPhoto.addEventListener('error', () => {
    aboutPhoto.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%; aspect-ratio: 3/4;
      background: linear-gradient(135deg, #0d1428 0%, #111e38 50%, #0d1428 100%);
      border-radius: 20px; display: flex; align-items: center; justify-content: center;
      font-size: 5rem; position: relative; z-index: 1;
    `;
    placeholder.textContent = '👨‍💻';
    aboutPhoto.parentNode.insertBefore(placeholder, aboutPhoto);
  });
}

// ========== GLITCH TEXT EFFECT (Hero Name) ==========
const heroName = document.querySelector('.hero-name');
let glitchInterval;

function startGlitch(el) {
  const original = el.textContent;
  const chars = '!@#$%^&*<>?/\\|{}[]';
  let count = 0;
  glitchInterval = setInterval(() => {
    if (count > 6) {
      el.textContent = original;
      clearInterval(glitchInterval);
      return;
    }
    el.textContent = original.split('').map((c, i) => {
      if (i < count) return c;
      return c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    count++;
  }, 60);
}

// Subtle glitch every 8s on page title area
if (heroName) {
  const accentLine = heroName.querySelector('.accent-stroke');
  if (accentLine) {
    setInterval(() => startGlitch(accentLine), 8000);
  }
}

// ========== SCROLL PROGRESS BAR ==========
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 2px; z-index: 2000;
  background: linear-gradient(90deg, var(--accent2), var(--accent));
  width: 0%; transition: width 0.1s;
  box-shadow: 0 0 8px var(--accent);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollTotal) * 100;
  progressBar.style.width = scrolled + '%';
});

// ========== TYPING EFFECT - Hero Sub ==========
// Already animated via CSS, but we add a blinking cursor effect
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const blink = document.createElement('span');
  blink.style.cssText = `
    display: inline-block; width: 2px; height: 1em;
    background: var(--accent); margin-left: 4px;
    vertical-align: text-bottom;
    animation: blink 1s steps(1) infinite;
  `;
  const blinkStyle = document.createElement('style');
  blinkStyle.textContent = `@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`;
  document.head.appendChild(blinkStyle);
}

// ========== SMOOTH ANCHOR SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========== DOWNLOAD RESUME ==========
const downloadResumeBtn = document.getElementById('downloadResumeBtn');
if (downloadResumeBtn) {
  downloadResumeBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const resumeUrl = downloadResumeBtn.getAttribute('href');
    const fileName = downloadResumeBtn.getAttribute('download') || 'resume.pdf';

    try {
      const response = await fetch(resumeUrl);
      if (!response.ok) throw new Error('Resume file not found');

      const fileBlob = await response.blob();
      const blobUrl = window.URL.createObjectURL(fileBlob);

      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = fileName;
      document.body.appendChild(tempLink);
      tempLink.click();
      tempLink.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback so users can still open/download manually
      window.open(resumeUrl, '_blank');
    }
  });
}



// ========== CONSOLE EASTER EGG ==========
console.log(`
%c
  ███████╗ ██████╗ ██████╗ 
  ██╔════╝██╔════╝██╔════╝ 
  █████╗  ██║     ██║  ███╗
  ██╔══╝  ██║     ██║   ██║
  ███████╗╚██████╗╚██████╔╝
  ╚══════╝ ╚═════╝ ╚═════╝ 

  Earl Cedric D. Guevarra
  Full-Stack Developer & Systems Engineer
  📧 earlcedricguevarra@gmail.com
  
  Hey, you're a developer too! Let's connect. 🚀
`, 'color: #00e5ff; font-family: monospace;');
