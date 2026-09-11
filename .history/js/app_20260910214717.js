/**
 * Miels Flores - Modern Portfolio Main Application Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  initRoleTyping();
  initNavbar();
  initPortfolio();
  initContactForm();
  initClipboard();
  initHorizontalCardGlow();
});

/* -------------------------------------------------------------------------- */
/* 1. Dynamic Typing Effect for Hero Subtitle                                 */
/* -------------------------------------------------------------------------- */
function initRoleTyping() {
  const target = document.getElementById("hero-role-rotator");
  if (!target) return;

  const roles = [
    "Graphic Designer & Visual Artist",
    "Modern Web Developer",
    "Canva & Excel Specialist",
    "IT Student"
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 90;

  function tick() {
    const current = roles[roleIdx];
    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 40;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 90;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      delay = 2000; // Pause at full word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* -------------------------------------------------------------------------- */
/* 2. Navbar Scrollspy & Mobile Hamburger Drawer                             */
/* -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById("main-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-nav-drawer");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  // Sticky blur on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Scrollspy active state
    const scrollPos = window.scrollY + 180;
    const sections = document.querySelectorAll("section[id]");

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("open");
      mobileToggle.classList.toggle("active", isOpen);
      mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    drawerLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
        mobileToggle.classList.remove("active");
        mobileToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 3. Portfolio Projects Rendering, Filtering & Case Study Modal              */
/* -------------------------------------------------------------------------- */
function initPortfolio() {
  const grid = document.getElementById("portfolio-grid");
  const filterBtns = document.querySelectorAll(".portfolio-filter-btn");
  const modal = document.getElementById("project-modal");
  const modalContentContainer = document.getElementById("modal-project-details");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  if (!grid || !window.portfolioProjects) return;

  function renderProjects(filter = "all") {
    grid.innerHTML = "";

    const filtered = filter === "all"
      ? portfolioProjects
      : portfolioProjects.filter(p => p.category === filter);

    filtered.forEach((project, index) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.style.animationDelay = `${index * 0.08}s`;
      card.setAttribute("data-category", project.category);

      let catBadgeClass = "badge-design";
      if (project.category === "web-dev") catBadgeClass = "badge-web";
      if (project.category === "excel") catBadgeClass = "badge-excel";

      card.innerHTML = `
        <div class="project-thumb-container">
          <img src="${project.thumbnail}" alt="${project.title}" loading="lazy" class="project-thumb-img"/>
          <div class="project-thumb-overlay">
            <span class="preview-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View Case Study
            </span>
          </div>
          <span class="project-category-badge ${catBadgeClass}">${project.categoryLabel}</span>
        </div>
        <div class="project-body">
          <div class="project-header-row">
            <span class="project-badge-pill">${project.badge}</span>
            <span class="project-highlight-stat">${project.highlight}</span>
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.shortDesc}</p>
          <div class="project-tools-row">
            ${project.tools.map(tool => `<span class="tool-pill">${tool}</span>`).join("")}
          </div>
          <button type="button" class="project-action-btn" data-project-id="${project.id}">
            <span>Inspect Blueprint</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      `;

      // Click event for modal
      card.addEventListener("click", (e) => {
        openModal(project);
      });

      grid.appendChild(card);
    });
  }

  // Filter button clicks
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter");
      renderProjects(category);
    });
  });

  // Modal Open
  function openModal(project) {
    if (!modal || !modalContentContainer) return;

    let catBadgeClass = "badge-design";
    if (project.category === "web-dev") catBadgeClass = "badge-web";
    if (project.category === "excel") catBadgeClass = "badge-excel";

    modalContentContainer.innerHTML = `
      <div class="modal-case-header">
        <div class="modal-badges-row">
          <span class="project-category-badge ${catBadgeClass}">${project.categoryLabel}</span>
          <span class="modal-badge-accent">${project.badge}</span>
          <span class="modal-metric-pill">🏆 ${project.highlight}</span>
        </div>
        <h2 class="modal-title">${project.title}</h2>
      </div>

      <div class="modal-banner-img-wrap">
        <img src="${project.thumbnail}" alt="${project.title}" class="modal-banner-img" />
        <div class="modal-banner-glow-line"></div>
      </div>

      <div class="modal-case-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Client / Scope</span>
          <span class="meta-value">${project.caseStudy.client}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Project Timeline</span>
          <span class="meta-value">${project.caseStudy.duration}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Miels's Role</span>
          <span class="meta-value">${project.caseStudy.role}</span>
        </div>
      </div>

      <div class="modal-case-section">
        <h4 class="modal-section-title">Overview & Architecture</h4>
        <p class="modal-prose">${project.fullDesc}</p>
      </div>

      <div class="modal-case-split-grid">
        <div class="split-card problem-card">
          <div class="split-header">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f87171" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h5>The Challenge</h5>
          </div>
          <p>${project.caseStudy.challenge}</p>
        </div>

        <div class="split-card solution-card">
          <div class="split-header">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#34d399" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h5>The Solution</h5>
          </div>
          <p>${project.caseStudy.solution}</p>
        </div>
      </div>

      <div class="modal-case-section">
        <h4 class="modal-section-title">Key Engineering & Design Deliverables</h4>
        <ul class="modal-features-list">
          ${project.caseStudy.keyFeatures.map(f => `
            <li>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#38bdf8" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>${f}</span>
            </li>
          `).join("")}
        </ul>
      </div>

      ${project.caseStudy.formulaHighlight ? `
        <div class="modal-case-section">
          <h4 class="modal-section-title">${project.category === 'excel' ? 'Formula Architecture' : 'Core Logic / Specification'}</h4>
          <div class="formula-code-box">
            <div class="code-box-header">
              <span>${project.caseStudy.formulaHighlight.label}</span>
              <span class="code-tag">${project.category === 'excel' ? 'Excel Formula' : 'Code Matrix'}</span>
            </div>
            <pre><code>${project.caseStudy.formulaHighlight.code}</code></pre>
          </div>
        </div>
      ` : ''}

      <div class="modal-case-section">
        <h4 class="modal-section-title">Technologies & Tooling</h4>
        <div class="modal-tools-wrap">
          ${project.tools.map(tool => `<span class="tool-pill">${tool}</span>`).join("")}
        </div>
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("modal-backdrop")) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Initial render
  renderProjects("all");
}

/* -------------------------------------------------------------------------- */
/* 4. Horizontal Card Spotlight Lighting                                      */
/* -------------------------------------------------------------------------- */
function initHorizontalCardGlow() {
  const cards = document.querySelectorAll(".glow-hover-card, .project-card, .pillar-card, .stat-counter-card");
  
  document.addEventListener("mousemove", (e) => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate horizontal percentage across card width
      const xPercent = (x / rect.width) * 100;
      card.style.setProperty("--mouse-x", `${xPercent}%`);
      card.style.setProperty("--mouse-px-x", `${x}px`);
      card.style.setProperty("--mouse-px-y", `${y}px`);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 5. Contact Form Validation & Toast                                         */
/* -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#contact-name").value.trim();
    const email = form.querySelector("#contact-email").value.trim();
    const subject = form.querySelector("#contact-subject").value.trim();
    const message = form.querySelector("#contact-message").value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please provide a valid email address.", "error");
      return;
    }

    // Transmit via PHP Backend (PHPMailer + XAMPP MySQL)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      <span>Transmitting via PHPMailer...</span>
    `;

    const payload = { name, email, subject, message };

    fetch("backend/send-message.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(async (response) => {
        let data;
        try {
          data = await response.json();
        } catch (err) {
          throw new Error("Invalid server response. Please make sure PHP & Apache are running in XAMPP.");
        }

        if (response.ok && data.success) {
          form.reset();
          if (data.email_sent) {
            showToast("Message transmitted! Email delivered to mielsflores101@gmail.com and recorded in MySQL.", "success");
          } else if (data.needs_config) {
            showToast("Saved to XAMPP database! Next step: add your Gmail App Password in backend/config.php.", "info");
          } else {
            showToast(data.message || "Message recorded successfully!", "success");
          }
        } else {
          showToast(data.message || "Unable to transmit message. Please check backend configuration.", "error");
        }
      })
      .catch((error) => {
        // Helpful diagnostic if running via file:// instead of http://localhost/
        if (window.location.protocol === "file:") {
          showToast("XAMPP Notice: Please run via http://localhost/ (XAMPP Apache) so PHP and MySQL can process the message!", "error");
        } else {
          showToast(error.message || "Network error. Please ensure Apache and MySQL are running in XAMPP.", "error");
        }
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Copy Email & Toast Utility                                              */
/* -------------------------------------------------------------------------- */
function initClipboard() {
  const copyBtn = document.getElementById("copy-email-btn");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", () => {
    const email = "mielsflores101@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      showToast("Copied 'mielsflores101@gmail.com' to clipboard!", "success");
    }).catch(() => {
      showToast("Email: mielsflores101@gmail.com", "info");
    });
  });
}

function initProjectsClipboard() {
  const copyBtn = document.getElementById("copy-projects-btn");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", () => {
    const link = "https://canva.link/aps97xjmtblhu00";
    navigator.clipboard.writeText(link).then(() => {
      showToast("Copied Canva projects link to clipboard!", "success");
    }).catch(() => {
      showToast("Projects link: " + link, "info");
    });
  });
}

// Run it after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  initProjectsClipboard();
});


function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#38bdf8" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  `;
  if (type === "success") {
    icon = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#34d399" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    `;
  } else if (type === "error") {
    icon = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f87171" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    `;
  }

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-text">${message}</div>
    <button class="toast-close" type="button" aria-label="Dismiss">&times;</button>
  `;

  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.remove();
  });

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

