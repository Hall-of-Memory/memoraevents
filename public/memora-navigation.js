const toggle = document.querySelector('.memora-menu-toggle');
  const nav = document.querySelector('#memora-navigation');
  if (toggle && nav) {
    const mobile = window.matchMedia('(max-width: 600px)');
    const setExpanded = (expanded) => {
      toggle.setAttribute('aria-expanded', String(expanded));
      nav.hidden = mobile.matches && !expanded;
    };
    const sync = () => { toggle.hidden = !mobile.matches; setExpanded(false); };
    sync(); mobile.addEventListener('change', sync);
    toggle.addEventListener('click', () => setExpanded(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (event) => { if (event.target instanceof Element && event.target.closest('a')) setExpanded(false); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && mobile.matches && toggle.getAttribute('aria-expanded') === 'true') { setExpanded(false); toggle.focus(); } });
  }
