const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

const skillCards = document.querySelectorAll('.skill-card');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const bar = e.target.querySelector('.skill-bar');
      if (bar) {
        const pct = e.target.dataset.pct || 0;
        bar.style.width = pct + '%';
      }
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
skillCards.forEach(c => barObserver.observe(c));

function submitRec() {
  const name   = document.getElementById('rec-name').value.trim();
  const role   = document.getElementById('rec-role').value.trim();
  const text   = document.getElementById('rec-text').value.trim();
  const rating = parseInt(document.getElementById('rec-rating').value);

  if (!name) { shake('rec-name'); return; }
  if (!text)  { shake('rec-text');  return; }

  const stars    = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const card = document.createElement('div');
  card.className = 'rec-card';
  card.innerHTML = `
    <div class="rec-quote">"</div>
    <p class="rec-text">${escHtml(text)}</p>
    <div class="rec-author">
      <div class="rec-avatar">${initials}</div>
      <div class="rec-author-info">
        <strong>${escHtml(name)}</strong>
        <span>${escHtml(role || 'Visitor')}</span>
      </div>
    </div>
    <div class="rec-stars">${stars}</div>
  `;

  const list = document.getElementById('rec-list');
  list.prepend(card);

  const emptyState = document.getElementById('rec-empty-state');
  if (emptyState) emptyState.style.display = 'none';

  document.getElementById('rec-name').value   = '';
  document.getElementById('rec-role').value   = '';
  document.getElementById('rec-text').value   = '';
  document.getElementById('rec-rating').value = '5';

  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);

  setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
}

document.getElementById('rec-submit-btn').addEventListener('click', submitRec);

function shake(id) {
  const el = document.getElementById(id);
  el.style.borderColor = 'var(--coral)';
  el.style.boxShadow   = '0 0 0 3px rgba(255,107,107,0.2)';
  el.focus();
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.boxShadow   = '';
  }, 1800);
}

function escHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}


const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

const scrollSpy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active && !active.classList.contains('nav-home-icon')) {
        active.style.color = 'var(--accent2)';
      }
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => scrollSpy.observe(s));
