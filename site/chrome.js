/* Shared header, footer and icon sprite — injected on every public page. */

(() => {
  const page = document.body?.dataset?.page || 'home';
  const file = (location.pathname.split('/').pop() || 'index.html').replace(/\/$/, '') || 'index.html';

  const current = (href) => {
    const name = href.split('#')[0] || 'index.html';
    if (file === name || (file === 'index.html' && name === 'index.html' && href === 'index.html#inicio' && page === 'home')) {
      if (name === 'projetos.html' || name === 'contactos.html') {
        return ' class="is-current" aria-current="page"';
      }
    }
    if (file === 'projetos.html' && name === 'projetos.html') return ' class="is-current" aria-current="page"';
    if ((file === 'contactos.html' || page === 'contact') && name === 'contactos.html') {
      return ' class="is-current" aria-current="page"';
    }
    return '';
  };

  const skip = page === 'projects'
    ? { href: '#projetos', key: 'skipProjects', text: 'Saltar para os projetos' }
    : page === 'contact'
      ? { href: '#contacto', key: 'skipContact', text: 'Saltar para o formulário' }
      : { href: '#imoveis', key: 'skipListings', text: 'Saltar para os imóveis' };

  const sprite = `
<svg class="sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path d="M6.6 3h2.9l1.5 4-2 1.4a12 12 0 0 0 6.6 6.6l1.4-2 4 1.5v2.9A2.6 2.6 0 0 1 18.4 20 15.4 15.4 0 0 1 4 5.6 2.6 2.6 0 0 1 6.6 3Z"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="m3.8 6.6 8.2 6 8.2-6"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m4.5 12.5 5 5 10-11"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15m-5.5-6 6 6-6 6"/></symbol>
  <symbol id="i-chev-l" viewBox="0 0 24 24"><path d="m14.5 5-7 7 7 7"/></symbol>
  <symbol id="i-chev-r" viewBox="0 0 24 24"><path d="m9.5 5 7 7-7 7"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol>
  <symbol id="i-area" viewBox="0 0 24 24"><path d="M4 9V4h5M20 15v5h-5M4 15v5h5M20 9V4h-5"/></symbol>
  <symbol id="i-bed" viewBox="0 0 24 24"><path d="M3 18v-7h13a4 4 0 0 1 4 4v3M3 11V7m0 11h18M7 11V9h4v2"/></symbol>
  <symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13.5 3 6 13.5h4.5L10 21l7.5-10.5H13l.5-7.5Z"/></symbol>
  <symbol id="i-bath" viewBox="0 0 24 24"><path d="M4 11h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM7 11V6.5A2.5 2.5 0 0 1 12 6"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
  <symbol id="i-house" viewBox="0 0 24 24"><path d="M4 11 12 4l8 7M6 9.8V20h12V9.8"/><path d="M10 20v-5h4v5"/></symbol>
  <symbol id="i-key" viewBox="0 0 24 24"><circle cx="8.5" cy="8.5" r="4.5"/><path d="m11.8 11.8 7.7 7.7M16 16l2-2m-4.5-1.5 2-2"/></symbol>
  <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="4.8"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.1" cy="6.9" r=".6"/></symbol>
  <symbol id="i-facebook" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="4.8"/><path d="M15.2 8.1h-1.3c-1 0-1.6.6-1.6 1.6v10.8M10.2 12.4h4.3"/></symbol>
  <symbol id="i-message" viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 0 1-8.5 8 8.8 8.8 0 0 1-3.7-.9L4 20l1.3-3.7A8 8 0 1 1 20 11.5Z"/></symbol>
  <symbol id="i-grid" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="6.5" height="6.5" rx=".5"/><rect x="14" y="3.5" width="6.5" height="6.5" rx=".5"/><rect x="3.5" y="14" width="6.5" height="6.5" rx=".5"/><rect x="14" y="14" width="6.5" height="6.5" rx=".5"/></symbol>
</svg>`;

  const header = `
<a class="skip-link" href="${skip.href}" data-i18n="${skip.key}">${skip.text}</a>
<header class="site-header" id="header">
  <div class="wrap header-inner">
    <a class="brand" href="index.html#inicio" aria-label="Edizur — página inicial">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 100 100"><path d="M18 82V44l16 10 16-22 16 22 16-10v38Z"/><path d="M26 39V26h10v13M45 26V14h10v12M64 39V26h10v13"/></svg>
      </span>
      <span class="brand-text">
        <strong>edizur</strong>
        <small data-i18n="brandTagline">Construção e Imobiliária</small>
      </span>
    </a>
    <nav class="nav" id="nav" aria-label="Navegação principal">
      <a href="index.html#inicio" data-i18n="navHome">Início</a>
      <a href="projetos.html"${current('projetos.html')} data-i18n="navProjects">Projetos</a>
      <a href="index.html#imoveis" data-i18n="navListings">Imóveis</a>
      <a href="index.html#servicos" data-i18n="navServices">Serviços</a>
      <a href="index.html#equipa" data-i18n="navTeam">Equipa</a>
      <a href="contactos.html"${current('contactos.html')} data-i18n="navContact">Contactos</a>
    </nav>
    <div class="header-tools">
      <div class="lang-switch" role="group" aria-label="Language">
        <button type="button" class="is-active" data-lang="pt" aria-pressed="true">PT</button>
        <button type="button" data-lang="en" aria-pressed="false">EN</button>
      </div>
      <button type="button" class="theme-toggle" id="theme-toggle" aria-pressed="false" data-i18n-aria="themeToggle" aria-label="Ativar tema escuro">
        <span class="theme-toggle-track" aria-hidden="true"><span class="theme-toggle-thumb"></span></span>
      </button>
      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav" data-i18n-aria="openMenu" aria-label="Abrir menu">
        <svg class="ico"><use href="#i-menu"></use></svg>
      </button>
    </div>
  </div>
</header>`;

  const footer = `
<footer class="site-footer" id="rodape">
  <div class="wrap footer-top">
    <div class="footer-brand">
      <strong>edizur</strong>
      <small data-i18n="brandTagline">Construção e Imobiliária</small>
      <p class="footer-tagline" data-content="footerTagline" data-i18n-fallback="footerTagline">O seu imóvel, o nosso compromisso.</p>
      <div class="footer-social" id="footer-social" hidden></div>
    </div>
    <div class="footer-office">
      <a class="footer-email" id="footer-email" href="mailto:edizur.imobiliaria@gmail.com">
        <svg class="ico"><use href="#i-mail"></use></svg>
        <span id="footer-email-text">edizur.imobiliaria@gmail.com</span>
      </a>
      <a class="footer-phone" id="footer-phone" href="tel:+351965466225" hidden>
        <svg class="ico"><use href="#i-phone"></use></svg>
        <span id="footer-phone-text"></span>
      </a>
      <address class="footer-address" id="footer-address" hidden></address>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>&copy; <span id="year"></span> Edizur — <span data-i18n="rights">Todos os direitos reservados</span>.</p>
  </div>
</footer>`;

  const wrap = document.createElement('div');
  wrap.innerHTML = sprite + header;
  const nodes = [...wrap.childNodes];
  document.body.prepend(...nodes);

  const main = document.querySelector('main');
  const footerWrap = document.createElement('div');
  footerWrap.innerHTML = footer;
  const footerNode = footerWrap.firstElementChild;
  if (main?.nextSibling) main.parentNode.insertBefore(footerNode, main.nextSibling);
  else document.body.append(footerNode);
})();
