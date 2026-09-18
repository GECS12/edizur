/* Shared i18n + theme + header chrome for Edizur pages. */

const I18N = {
  pt: {
    skipListings: 'Saltar para os imóveis',
    skipProjects: 'Saltar para os projetos',
    skipAbout: 'Saltar para Sobre nós',
    brandTagline: 'Construção e Imobiliária',
    navHome: 'Início',
    navProjects: 'Projetos',
    navListings: 'Imóveis',
    navAbout: 'Sobre nós',
    navContact: 'Contactos',
    openMenu: 'Abrir menu',
    themeToggle: 'Alternar tema escuro',
    themeToggleLight: 'Alternar tema claro',
    themeHint: 'Alternar tema escuro',
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
    aboutEyebrow: 'Quem somos',
    aboutTitle: 'Sobre nós',
    aboutLead:
      'A Edizur junta construção e imobiliária no Porto e região. Conhecemos o terreno, as obras e o mercado — e acompanhamos cada cliente até à entrega.',
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
    formError: 'Não foi possível enviar automaticamente. Abrimos o Gmail para concluir.',
    formSending: 'A enviar…',
    price: 'Preço',
    filterAllTypes: 'Todas',
    filterAllPrices: 'Qualquer preço',
    priceTo250: 'Até 250 000 €',
    price250to500: '250 000 € – 500 000 €',
    price500to1m: '500 000 € – 1 000 000 €',
    priceFrom1m: 'Acima de 1 000 000 €',
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
    areaBrutaShort: 'bruta',
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
    skipListings: 'Skip to properties',
    skipProjects: 'Skip to projects',
    skipAbout: 'Skip to About us',
    brandTagline: 'Construction & Real Estate',
    navHome: 'Home',
    navProjects: 'Projects',
    navListings: 'Properties',
    navAbout: 'About us',
    navContact: 'Contact',
    openMenu: 'Open menu',
    themeToggle: 'Toggle dark theme',
    themeToggleLight: 'Toggle light theme',
    themeHint: 'Toggle dark theme',
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
    aboutEyebrow: 'Who we are',
    aboutTitle: 'About us',
    aboutLead:
      'Edizur brings construction and real estate together in Porto and the surrounding region. We know the ground, the building work and the market — and we stay with each client through to completion.',
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
    formError: 'We could not send automatically. Gmail will open so you can finish.',
    formSending: 'Sending…',
    price: 'Price',
    filterAllTypes: 'All types',
    filterAllPrices: 'Any price',
    priceTo250: 'Up to €250,000',
    price250to500: '€250,000 – €500,000',
    price500to1m: '€500,000 – €1,000,000',
    priceFrom1m: 'Over €1,000,000',
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
    areaBrutaShort: 'gross',
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

    root.querySelectorAll('[data-i18n-title]').forEach((node) => {
      const value = this.t(node.dataset.i18nTitle);
      if (value) {
        node.setAttribute('title', value);
        node.setAttribute('data-tooltip', value);
      }
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
      const label = this.t(this.theme === 'dark' ? 'themeToggleLight' : 'themeToggle');
      const hint = this.t('themeHint');
      toggle.setAttribute('aria-pressed', String(this.theme === 'dark'));
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', hint);
      toggle.setAttribute('data-tooltip', hint);
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
