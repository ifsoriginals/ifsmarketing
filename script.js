const cursor = document.querySelector('.cursor');
if (cursor) {
  document.addEventListener('pointermove', e => {
    document.documentElement.style.setProperty('--mx', e.clientX+'px');
    document.documentElement.style.setProperty('--my', e.clientY+'px');
    cursor.style.left=e.clientX+'px';
    cursor.style.top=e.clientY+'px';
  });
  document.querySelectorAll('a,button,.project').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('big'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('big'));
  });
}

const io = new IntersectionObserver(entries => entries.forEach(e => {
  if(e.isIntersecting) e.target.classList.add('in');
}), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const modal = document.getElementById('modal');
const title = document.getElementById('modal-title');
const copy = document.getElementById('modal-copy');
const modalVideo = document.getElementById('modal-video');

document.querySelectorAll('.project').forEach(card=>{
  const preview = card.querySelector('video');

  if (preview) {
    preview.addEventListener('mouseenter',()=>preview.play().catch(()=>{}));
    preview.addEventListener('mouseleave',()=>{
      preview.pause();
      try { preview.currentTime = 0; } catch (_) {}
    });
  }

  card.addEventListener('click',()=>{
    if (!modal || !title || !copy || !modalVideo) return;
    title.textContent = card.dataset.title || '';
    copy.textContent = card.dataset.copy || '';
    if (card.dataset.video) modalVideo.src = card.dataset.video;
    modal.classList.add('open');
    document.body.style.overflow='hidden';
    modalVideo.play().catch(()=>{});
  });
});

const closeModal=()=>{
  if (!modal) return;
  modal.classList.remove('open');
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
  }
  if (!document.body.classList.contains('mobile-menu-open')) {
    document.body.style.overflow='';
  }
};

document.getElementById('close')?.addEventListener('click',closeModal);
modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.getElementById('modal-action')?.addEventListener('click',closeModal);

const aiSubfilters = document.getElementById('aiSubfilters');
const portfolioGrid = document.getElementById('portfolioGrid');
let activeMainFilter = 'all';
let activeAISubfilter = 'all';

function applyPortfolioFilter(){
  document.querySelectorAll('.project').forEach(card=>{
    const mainMatch = activeMainFilter === 'all' || card.dataset.category === activeMainFilter;
    const aiMatch = activeMainFilter !== 'ai' ||
      activeAISubfilter === 'all' ||
      card.dataset.subcategory === activeAISubfilter;
    card.classList.toggle('is-hidden', !(mainMatch && aiMatch));
  });

  aiSubfilters?.classList.toggle('show', activeMainFilter === 'ai');
  portfolioGrid?.classList.toggle('ai-mode', activeMainFilter === 'ai');
  portfolioGrid?.classList.toggle('all-mode', activeMainFilter === 'all');
}

document.querySelectorAll('.filter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeMainFilter = btn.dataset.filter;
    if(activeMainFilter !== 'ai'){
      activeAISubfilter = 'all';
      document.querySelectorAll('.subfilter').forEach(b=>b.classList.remove('active'));
      document.querySelector('.subfilter[data-subfilter="all"]')?.classList.add('active');
    }
    applyPortfolioFilter();
  });
});

document.querySelectorAll('.subfilter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.subfilter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeAISubfilter = btn.dataset.subfilter;
    applyPortfolioFilter();
  });
});

applyPortfolioFilter();

/* Mobile navigation — single source of truth */
(() => {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.getElementById('mobileNav');
  const close = document.querySelector('.mobile-nav-close');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    nav.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('mobile-menu-open', open);

    if (open) {
      document.body.style.overflow = 'hidden';
    } else if (!modal?.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  };

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!nav.classList.contains('open'));
  });

  close?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
  });

  nav.addEventListener('click', (event) => {
    if (event.target === nav) setOpen(false);
  });

  nav.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      closeModal();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setOpen(false);
  });
})();

/* Reliable in-page navigation */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();

    const menu = document.getElementById('mobileNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (menu?.classList.contains('open')) {
      menu.classList.remove('open');
      toggle?.classList.remove('active');
      toggle?.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-hidden','true');
      document.body.classList.remove('mobile-menu-open');
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const headerOffset = window.innerWidth <= 900 ? 76 : 92;
    const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: Math.max(0, y),
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  });
});
