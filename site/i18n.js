/* Shared i18n + theme + header chrome for Edizur pages. */

const I18N = {
  pt: {
    brandTagline: 'Construção e Imobiliária',
    navHome: 'Início',
    navProjects: 'Projetos',
    navListings: 'Imóveis',
    navServices: 'Serviços',
    navTeam: 'Equipa',
    navContact: 'Contactos',
    openMenu: 'Abrir menu',
    themeToggle: 'Ativar tema escuro',
    themeToggleLight: 'Ativar tema claro',
    heroTitle: 'Construção e imobiliária com rigor.',
    heroSubtitle: 'Obras, reabilitação e imóveis no Porto e região — do primeiro contacto até à entrega.',
    ctaProjects: 'Ver projetos',
    ctaContact: 'Fale connosco',
    projectsEyebrow: 'Portfólio',
    projectsTitle: 'Projetos desenvolvidos',
    projectsLead: 'Construção, remodelação e reabilitação — obras que reflectem rigor e experiência.',
    servicesEyebrow: 'Serviços personalizados',
    servicesTitle: 'Vender ou comprar,<br>começa por uma conversa.',
    sellLabel: 'Vender',
    buyLabel: 'Comprar',
    sellText: 'Valorizamos o seu imóvel, divulgamo-lo com eficácia e acompanhamos todo o processo até à escritura.',
    buyText: 'Diga-nos o que procura. Ajudamo-lo a encontrar o imóvel certo e acompanhamos o processo de compra.',
    listingsEyebrow: 'Catálogo',
    listingsTitle: 'Imóveis em destaque',
    filterListings: 'Filtrar imóveis',
    filterAll: 'Todos',
    filterSale: 'Para venda',
    filterWanted: 'Procuras',
    viewMode: 'Modo de visualização',
    viewList: 'Lista',
    viewMap: 'Mapa',
    teamEyebrow: 'Confiança, resultados, proximidade',
    teamTitle: 'A nossa equipa',
    footerTagline: 'O seu imóvel, o nosso compromisso.',
    rights: 'Todos os direitos reservados',
    contactTitle: 'Entre em contacto',
    contactIntro:
      'Venha conhecer melhor a Edizur e explorar oportunidades de aquisição de terrenos e imóveis para construção. Estamos disponíveis para apresentar soluções que agregam valor e confiança.',
    fieldFirstName: 'Nome',
    fieldLastName: 'Sobrenome',
    fieldEmail: 'E-mail',
    fieldMessage: 'Mensagem',
    phFirstName: 'Nome (obrigatório)',
    phLastName: 'Sobrenome (obrigatório)',
    phEmail: 'E-mail (obrigatório)',
    phMessage: 'Mensagem (obrigatório)',
    formSend: 'Enviar',
    formThanks: 'Obrigado. A sua mensagem foi enviada.',
    sale: 'Venda',
    wanted: 'Procura',
    project: 'Projeto',
    seeDetails: 'Ver detalhes',
    seeProject: 'Ver projeto',
    emptyListings: 'Não existem imóveis nesta categoria neste momento.',
    emptyProjects: 'Ainda não existem projetos publicados.',
    emptyMap: 'Não existem imóveis com posição no mapa nesta categoria.',
    mapLoading: 'A carregar o mapa…',
    mapFail: 'Não foi possível carregar o mapa. Por favor tente novamente mais tarde.',
    loadFail: 'Não foi possível carregar os imóveis. Por favor tente novamente mais tarde.',
    reserved: 'Reservado',
    sold: 'Vendido',
    onRequest: 'Sob consulta',
    budgetUpTo: 'Orçamento até ',
    location: 'Localização',
    reference: 'Referência',
    typology: 'Tipologia',
    area: 'Área',
    areaUtil: 'Área útil',
    areaBruta: 'Área bruta',
    areaLand: 'Área do terreno',
    areaGarage: 'Área da garagem',
    bedrooms: 'Quartos',
    suites: 'Suites',
    bathrooms: 'Casas de banho',
    parking: 'Estacionamento',
    floor: 'Piso',
    yearBuilt: 'Ano de construção',
    condoFee: 'Condomínio',
    month: 'mês',
    energy: 'Certificado energético',
    status: 'Estado',
    teamDefault: 'Equipa Edizur',
    roleDefault: 'Consultor Imobiliário',
    sendMessage: 'Enviar mensagem',
    sendEmail: 'Enviar e-mail',
    featured: 'Destaque',
  },
  en: {
    brandTagline: 'Construction & Real Estate',
    navHome: 'Home',
    navProjects: 'Projects',
    navListings: 'Properties',
    navServices: 'Services',
    navTeam: 'Team',
    navContact: 'Contact',
    openMenu: 'Open menu',
    themeToggle: 'Enable dark theme',
    themeToggleLight: 'Enable light theme',
    heroTitle: 'Construction and real estate with rigor.',
    heroSubtitle: 'Building, rehabilitation and property across Porto and the region — from first contact to completion.',
    ctaProjects: 'View projects',
    ctaContact: 'Talk to us',
    projectsEyebrow: 'Portfolio',
    projectsTitle: 'Completed projects',
    projectsLead: 'Construction, remodeling and rehabilitation — work defined by rigor and experience.',
    servicesEyebrow: 'Tailored services',
    servicesTitle: 'Buying or selling<br>starts with a conversation.',
    sellLabel: 'Sell',
    buyLabel: 'Buy',
    sellText: 'We value your property, market it effectively and guide the process through to completion.',
    buyText: 'Tell us what you need. We help you find the right property and support the purchase.',
    listingsEyebrow: 'Catalogue',
    listingsTitle: 'Featured properties',
    filterListings: 'Filter properties',
    filterAll: 'All',
    filterSale: 'For sale',
    filterWanted: 'Wanted',
    viewMode: 'View mode',
    viewList: 'List',
    viewMap: 'Map',
    teamEyebrow: 'Trust, results, proximity',
    teamTitle: 'Our team',
    footerTagline: 'Your property, our commitment.',
    rights: 'All rights reserved',
    contactTitle: 'Get in touch',
    contactIntro:
      'Get to know Edizur and explore opportunities to acquire land and properties for construction. We are ready to present solutions that add value and confidence.',
    fieldFirstName: 'First name',
    fieldLastName: 'Last name',
    fieldEmail: 'Email',
    fieldMessage: 'Message',
    phFirstName: 'First name (required)',
    phLastName: 'Last name (required)',
    phEmail: 'Email (required)',
    phMessage: 'Message (required)',
    formSend: 'Send',
    formThanks: 'Thank you. Your message has been sent.',
    sale: 'Sale',
    wanted: 'Wanted',
    project: 'Project',
    seeDetails: 'View details',
    seeProject: 'View project',
    emptyListings: 'There are no properties in this category right now.',
    emptyProjects: 'No projects published yet.',
    emptyMap: 'No mapped properties in this category.',
    mapLoading: 'Loading map…',
    mapFail: 'Could not load the map. Please try again later.',
    loadFail: 'Could not load properties. Please try again later.',
    reserved: 'Reserved',
    sold: 'Sold',
    onRequest: 'On request',
    budgetUpTo: 'Budget up to ',
    location: 'Location',
    reference: 'Reference',
    typology: 'Typology',
    area: 'Area',
    areaUtil: 'Net area',
    areaBruta: 'Gross area',
    areaLand: 'Plot area',
    areaGarage: 'Garage area',
    bedrooms: 'Bedrooms',
    suites: 'Suites',
    bathrooms: 'Bathrooms',
    parking: 'Parking spaces',
    floor: 'Floor',
    yearBuilt: 'Year built',
    condoFee: 'Condo fee',
    month: 'month',
    energy: 'Energy rating',
    status: 'Status',
    teamDefault: 'Edizur team',
    roleDefault: 'Real-estate consultant',
    sendMessage: 'Send message',
    sendEmail: 'Send email',
    featured: 'Featured',
  },
};

const EdizurUI = {
  lang: localStorage.getItem('edizur-lang') || 'pt',
  theme: localStorage.getItem('edizur-theme') || 'light',

  t(key) {
    return I18N[this.lang]?.[key] ?? I18N.pt[key] ?? key;
  },

  applyI18n(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((node) => {
      const value = this.t(node.dataset.i18n);
      if (value) node.textContent = value;
    });

    root.querySelectorAll('[data-i18n-html]').forEach((node) => {
      const value = this.t(node.dataset.i18nHtml);
      if (value) node.innerHTML = value;
    });

    root.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const value = this.t(node.dataset.i18nPlaceholder);
      if (value) node.setAttribute('placeholder', value);
    });

    root.querySelectorAll('[data-i18n-aria]').forEach((node) => {
      const key = node.dataset.i18nAria;
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      const value = key === 'themeToggle'
        ? this.t(dark ? 'themeToggleLight' : 'themeToggle')
        : this.t(key);
      if (value) node.setAttribute('aria-label', value);
    });

    root.querySelectorAll('[data-i18n-fallback]').forEach((node) => {
      if (node.dataset.contentLocked === '1') return;
      const value = this.t(node.dataset.i18nFallback);
      if (value) node.textContent = value;
    });

    document.documentElement.setAttribute('lang', this.lang === 'en' ? 'en' : 'pt-PT');
    document.documentElement.setAttribute('data-lang', this.lang);

    root.querySelectorAll('.lang-switch [data-lang]').forEach((button) => {
      const active = button.dataset.lang === this.lang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  },

  setLang(lang) {
    if (!I18N[lang]) return;
    this.lang = lang;
    localStorage.setItem('edizur-lang', lang);
    this.applyI18n();
    window.dispatchEvent(new CustomEvent('edizur:lang', { detail: { lang } }));
  },

  setTheme(theme) {
    this.theme = theme === 'dark' ? 'dark' : 'light';
    localStorage.setItem('edizur-theme', this.theme);
    if (this.theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(this.theme === 'dark'));
      toggle.setAttribute(
        'aria-label',
        this.t(this.theme === 'dark' ? 'themeToggleLight' : 'themeToggle'),
      );
    }
  },

  bindChrome() {
    document.querySelectorAll('.lang-switch [data-lang]').forEach((button) => {
      button.addEventListener('click', () => this.setLang(button.dataset.lang));
    });

    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    });

    const header = document.getElementById('header');
    if (header) {
      const onScroll = () => header.classList.toggle('is-compact', window.scrollY > 28);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    this.setTheme(this.theme);
    this.applyI18n();
  },
};

EdizurUI.bindChrome();
window.EdizurUI = EdizurUI;
