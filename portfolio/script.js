// ========================
// STARFIELD
// ========================
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const STAR_COUNT = 200;
const stars = [];

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.2,
    alpha: Math.random(),
    speed: Math.random() * 0.3 + 0.05,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinkleDir: Math.random() > 0.5 ? 1 : -1
  });
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.alpha += s.twinkleSpeed * s.twinkleDir;
    if (s.alpha >= 1) { s.alpha = 1; s.twinkleDir = -1; }
    if (s.alpha <= 0.1) { s.alpha = 0.1; s.twinkleDir = 1; }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(160, 180, 255, ${s.alpha})`;
    ctx.fill();

    // Occasional bright star glow
    if (s.r > 1.2) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${s.alpha * 0.15})`;
      ctx.fill();
    }
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// ========================
// TYPEWRITER EFFECT
// ========================
const roles = [
  "BCA Student",
  "Web Developer",
  "Problem Solver",
  "Frontend Dev",
  "Tech Enthusiast"
];

let roleIdx = 0, charIdx = 0, deleting = false;
const roleEl = document.getElementById("role-text");

function typeRole() {
  const current = roles[roleIdx];
  if (!deleting) {
    roleEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeRole, 2000);
      return;
    }
  } else {
    roleEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 55 : 100);
}
typeRole();

// ========================
// NAVBAR SCROLL
// ========================
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.style.background = window.scrollY > 60
    ? "rgba(4,4,15,0.95)"
    : "rgba(4,4,15,0.7)";
});

// ========================
// HAMBURGER
// ========================
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.toggle("open");
});
function closeMobile() {
  document.getElementById("mobileMenu").classList.remove("open");
}

// ========================
// SCROLL REVEAL
// ========================
const targets = document.querySelectorAll(
  ".about-grid, .skills-grid, .projects-grid, .ach-grid, .contact-cards, .skill-card, .project-card, .ach-card, .contact-card, .info-card"
);
targets.forEach(el => el.classList.add("reveal"));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const idx = Array.from(targets).indexOf(entry.target);
      setTimeout(() => entry.target.classList.add("visible"), (idx % 6) * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

targets.forEach(el => observer.observe(el));

// ========================
// ACTIVE NAV
// ========================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute("id");
  });
  navLinks.forEach(link => {
    link.style.color = "";
    link.style.textShadow = "";
    if (link.getAttribute("href") === `#${current}`) {
      link.style.color = "#00e5ff";
      link.style.textShadow = "0 0 20px rgba(0,229,255,0.4)";
    }
  });
});