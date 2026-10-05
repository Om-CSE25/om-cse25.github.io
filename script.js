/**
 * Om Narayana - Personal Portfolio & Interactive Terminal Engine
 * GitHub: om-cse25
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypewriter();
  initProjectFilters();
  initTerminal();
  initClipboardToast();
  initScrollTop();
  initMobileMenu();
  initContactForm();
  initScrollSpy();
  updateCurrentYear();
});

/* ==========================================================================
   1. Interactive Constellation Canvas
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 18000), 70);
  const maxDistance = 120;

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.8 + 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(129, 140, 248, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const lineAlpha = (1 - distance / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const typedTarget = document.getElementById('typed-text');
  if (!typedTarget) return;

  const phrases = [
    'Spaceflight Omics & NASA OSDR Pipelines',
    'Deep Learning @ Matsuo Lab (U-Tokyo)',
    'High-Performance C++ & Algorithmic Systems',
    'Developer Communities with Google'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 90;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      delay = 40;
    } else {
      typedTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      delay = 85;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      delay = 2000; // Pause at end of sentence
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400; // Pause before typing new sentence
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 600);
}

/* ==========================================================================
   3. Project Filter Tabs
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Interactive Terminal Shell
   ========================================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const clearBtn = document.getElementById('terminal-clear-btn');
  const termChips = document.querySelectorAll('.term-chip');

  if (!input || !output) return;

  const history = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
<span class="term-cyan">Available commands:</span>
  <span class="term-yellow">about</span>          - Overview & biography
  <span class="term-yellow">nasa</span>           - NASA OSDR Analysis Working Group role
  <span class="term-yellow">tokyo</span>          - Matsuo-Iwasawa Lab U-Tokyo research
  <span class="term-yellow">google</span>         - Google Student Ambassador mission
  <span class="term-yellow">skills</span>         - Technical skills & stacks
  <span class="term-yellow">experience</span>     - Career & research timeline
  <span class="term-yellow">projects</span>       - Key projects & repositories
  <span class="term-yellow">certifications</span> - Awards, CS50x & hackathons
  <span class="term-yellow">education</span>      - DDU Gorakhpur University & schools
  <span class="term-yellow">contact</span>        - Email, LinkedIn & GitHub coordinates
  <span class="term-yellow">matrix</span>         - Trigger cosmic digital pulse
  <span class="term-yellow">clear</span>          - Clear terminal output
`,
    about: () => `
<span class="term-cyan">Om Narayana</span> | Aspiring Software Engineer & ML Researcher
<span class="term-dim">Location:</span> Bengaluru, Karnataka & Gorakhpur, India
<span class="term-dim">Education:</span> B.Tech in CSE (Class of 2029) @ DDU Gorakhpur University
<span class="term-dim">Affiliations:</span> NASA OSDR Analysis Working Group · U-Tokyo Matsuo Lab GCI · Google Student Ambassador
<span class="term-dim">Summary:</span> Merging spaceflight biological research datasets with deep learning algorithms and scalable software systems.
`,
    nasa: () => `
<span class="term-cyan">NASA Open Science Data Repository (OSDR) Analysis Working Group</span>
<span class="term-yellow">Role:</span> Active AWG Member (Sep 2026 - Present)
<span class="term-dim">Focus:</span> Spaceflight biological datasets, cosmic radiation adaptation, space biology informatics, and AI/ML applications in astronaut space medicine.
<span class="term-green">Portal:</span> <a href="https://osdr.nasa.gov/" target="_blank" rel="noopener">osdr.nasa.gov</a>
`,
    tokyo: () => `
<span class="term-purple">GCI World by Matsuo-Iwasawa Lab · The University of Tokyo</span>
<span class="term-yellow">Role:</span> Student / ML Researcher (Sep 2026 - Present)
<span class="term-dim">Focus:</span> Rigorous machine learning, predictive modeling, and data-driven approach to complex global challenges.
<span class="term-green">Institution:</span> The University of Tokyo (Tokyo, Japan)
`,
    google: () => `
<span class="term-cyan">Google Student Ambassador</span>
<span class="term-yellow">Tenure:</span> May 2026 - Present
<span class="term-dim">Focus:</span> Developer advocacy, campus workshops on Google technologies, cloud computing, and AI developer tools.
`,
    skills: () => `
<span class="term-cyan">Languages & Systems:</span> C++, Python, Data Structures & Algorithms, SQL, Bash, JavaScript
<span class="term-purple">AI & Data Science:</span> PyTorch, Scikit-Learn, Pandas, NumPy, Deep Learning, Statistical Analysis
<span class="term-yellow">Scientific Research:</span> NASA OSDR Datasets, Space Omics, Space Biology & Space Medicine Informatics
<span class="term-green">Tools & DevOps:</span> Git, GitHub Actions, Linux, Jupyter, VS Code
`,
    experience: () => `
<span class="term-cyan">[1] NASA OSDR Analysis Working Group</span> (Sep 2026 - Present)
    Spaceflight datasets & AI/ML in space biology.
<span class="term-purple">[2] GCI World @ Matsuo-Iwasawa Lab, U-Tokyo</span> (Sep 2026 - Present)
    Data Science & Deep Learning research program.
<span class="term-cyan">[3] Google Student Ambassador</span> (May 2026 - Present)
    Campus technical community & developer leadership.
<span class="term-yellow">[4] TechSphere - Technical Division</span> (Mar 2026 - Aug 2026)
    Technical infrastructure, workshops, and student coordination.
`,
    projects: () => `
<span class="term-cyan">1. AstroBio-ML: Spaceflight Omics Explorer</span> (NASA OSDR data exploration)
<span class="term-purple">2. Matsuo Deep Learning Workbench</span> (U-Tokyo GCI program modeling)
<span class="term-yellow">3. AlgoForge</span> (High-performance C++ algorithmic suite)
`,
    certifications: () => `
<span class="term-green">🏆 CS50x Puzzle Day 2026</span> - Harvard University
<span class="term-green">🏆 Global AI Hackathon</span> - USAII
<span class="term-green">🏆 Evolotek | Evolothon 1.0</span> - 24hr Technical Hackathon
`,
    education: () => `
<span class="term-cyan">Deen Dayal Upadhyaya Gorakhpur University</span>
  B.Tech in Computer Science & Engineering (2025 - 2029)
<span class="term-dim">A J J Academy Lashkarpur Sadar Varanasi UP (CBSE)</span>
  PCM (Physics, Chemistry, Mathematics) (2024 - 2025)
<span class="term-dim">Kendriya Vidyalaya (KV)</span>
  Science (2022 - 2023)
`,
    contact: () => `
<span class="term-cyan">Email:</span> omnarayan020907@gmail.com
<span class="term-cyan">Alternate Email:</span> omnarayana.cs@gmail.com
<span class="term-purple">LinkedIn:</span> linkedin.com/in/om-narayana-cse
<span class="term-green">GitHub:</span> github.com/om-cse25
`,
    matrix: () => {
      triggerMatrixEffect();
      return `<span class="term-green">System matrix stream initialized... Enjoy the cosmic rain.</span>`;
    },
    sudo: () => `<span class="term-yellow">Permission denied: You are already a root cosmic explorer.</span>`,
    date: () => new Date().toUTCString(),
    whoami: () => `visitor@om-portfolio (Authenticated Guest)`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Log user command
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="term-user">om@workspace</span>:<span class="term-dir">~</span>$ ${escapeHtml(rawCmd)}`;
    output.appendChild(userLine);

    if (cmd === 'clear') {
      output.innerHTML = '';
      return;
    }

    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-line';

    if (commands[cmd]) {
      const result = commands[cmd]();
      responseLine.innerHTML = result;
    } else {
      responseLine.innerHTML = `<span class="term-yellow">zsh: command not found: ${escapeHtml(cmd)}</span>. Type <span class="term-cyan">help</span> for a list of valid commands.`;
    }

    output.appendChild(responseLine);
    output.scrollTop = output.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      if (val.trim()) {
        history.push(val);
        historyIndex = history.length;
        executeCommand(val);
      }
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      output.innerHTML = '';
    });
  }

  termChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        input.focus();
      }
    });
  });

  function triggerMatrixEffect() {
    const originalBg = output.style.background;
    output.style.background = '#021008';
    setTimeout(() => {
      output.style.background = originalBg;
    }, 1500);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }
}

/* ==========================================================================
   5. Clipboard & Toast Notifications
   ========================================================================== */
function initClipboardToast() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');

  let toastTimeout;

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'omnarayan020907@gmail.com';

      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`);
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied ${email} to clipboard!`);
      });
    });
  });

  function showToast(msg) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = msg;

    toast.classList.add('active');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }
}

/* ==========================================================================
   6. Scroll to Top
   ========================================================================== */
function initScrollTop() {
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen.toString());
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   8. Contact Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    const recipient = 'omnarayan020907@gmail.com';
    const emailSubject = encodeURIComponent(`[Portfolio] ${subject} - from ${name}`);
    const emailBody = encodeURIComponent(`Hi Om,\n\n${message}\n\nBest regards,\n${name}\n${email}`);

    const mailtoLink = `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

    // Open mail client
    window.location.href = mailtoLink;

    // Toast feedback
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
      toastMsg.textContent = 'Opening your email client...';
      toast.classList.add('active');
      setTimeout(() => toast.classList.remove('active'), 3500);
    }
  });
}

/* ==========================================================================
   9. ScrollSpy for Navigation Links
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   10. Dynamic Current Year
   ========================================================================== */
function updateCurrentYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
