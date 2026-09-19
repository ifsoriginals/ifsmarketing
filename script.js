const cursor = document.querySelector('.cursor');
  document.addEventListener('pointermove', e => { document.documentElement.style.setProperty('--mx', e.clientX+'px'); document.documentElement.style.setProperty('--my', e.clientY+'px'); cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px'; });
  document.querySelectorAll('a,button,.project').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('big'));el.addEventListener('mouseleave',()=>cursor.classList.remove('big'));});

  const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); }), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  const modal = document.getElementById('modal'), title = document.getElementById('modal-title'), copy = document.getElementById('modal-copy'), modalVideo = document.getElementById('modal-video');
  document.querySelectorAll('.project').forEach(card=>{
    const preview = card.querySelector('video');
    preview.addEventListener('mouseenter',()=>preview.play().catch(()=>{}));
    preview.addEventListener('mouseleave',()=>{preview.pause(); preview.currentTime = 0;});
    card.addEventListener('click',()=>{
      title.textContent = card.dataset.title;
      copy.textContent = card.dataset.copy;
      modalVideo.src = card.dataset.video;
      modal.classList.add('open');
      document.body.style.overflow='hidden';
      modalVideo.play().catch(()=>{});
    });
  });
  const close=()=>{
    modal.classList.remove('open');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    document.body.style.overflow='';
  };
  document.getElementById('close').addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target===modal)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  document.getElementById('modal-action').addEventListener('click',close);


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
    aiSubfilters.classList.toggle('show', activeMainFilter === 'ai');
    portfolioGrid.classList.toggle('ai-mode', activeMainFilter === 'ai');
    portfolioGrid.classList.toggle('all-mode', activeMainFilter === 'all');
  }

  document.querySelectorAll('.filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeMainFilter = btn.dataset.filter;
      if(activeMainFilter !== 'ai'){
        activeAISubfilter = 'all';
        document.querySelectorAll('.subfilter').forEach(b=>b.classList.remove('active'));
        document.querySelector('.subfilter[data-subfilter="all"]').classList.add('active');
      }
      applyPortfolioFilter();
      if(activeMainFilter === 'ai'){
        document.getElementById('work').scrollIntoView({behavior:'smooth', block:'start'});
      }
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


/* Mobile navigation */
(() => {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.getElementById('mobileNav');
  const close = document.querySelector('.mobile-nav-close');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    document.body.classList.toggle('mobile-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    nav.setAttribute('aria-hidden', String(!open));
  };

  toggle.addEventListener('click', () => setOpen(true));
  close?.addEventListener('click', () => setOpen(false));

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
})();
