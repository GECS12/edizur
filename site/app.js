/* Edizur — public site. Reads published content from the Sanity Content Lake. */

const CONFIG = {
  projectId: 'a5nclqso',
  dataset: 'production',
  apiVersion: 'v2026-09-18',
  fallbackEmail: 'edizur.imobiliaria@gmail.com',
  fallbackPhone: '+351 965 466 225',
  foundedYear: 2025,
  leafletCss: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  leafletCssIntegrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
  leafletJs: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  leafletJsIntegrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=',
};

const IMAGE_FIELDS = `alt, hotspot, "url": asset->url, "lqip": asset->metadata.lqip`;

const PAGE = document.body?.dataset?.page || 'home';

const SETTINGS_QUERY = `"settings": *[_id == "siteSettings"][0]{
  heroTitle, heroTitleEn, heroSubtitle, heroSubtitleEn, region, regionEn,
  email, phone, sellText, sellTextEn, buyText, buyTextEn,
  footerTagline, footerTaglineEn, address, instagram, facebook,
  "heroImage": heroImage{${IMAGE_FIELDS}}
}`;

const AGENTS_QUERY = `"agents": *[_type == "agent" && !(_id in path("drafts.**"))] | order(coalesce(sortOrder, 99) asc, name asc){
  _id, name, role, roleEn, bio, bioEn, phone, email, "photo": photo{${IMAGE_FIELDS}}
}`;

const PROPERTIES_QUERY = `"properties": *[_type == "property" && !(_id in path("drafts.**"))]
  | order(coalesce(featured, false) desc, coalesce(publishedAt, _createdAt) desc){
    _id, title, titleEn, listingType, status, price, priceOnRequest,
    location, locationEn, typology,
    area, areaUtil, areaBruta, areaTerreno, areaGaragem,
    bedrooms, suites, bathrooms, parkingSpaces, floor, yearBuilt, condoFee,
    energyRating, description, descriptionEn, features, reference, featured,
    mapLocation,
    "images": images[]{_key, ${IMAGE_FIELDS}},
    "agent": agent->{_id, name, role, roleEn, phone, email, "photo": photo{${IMAGE_FIELDS}}}
}`;

const PROJECTS_QUERY = `"projects": *[_type == "project" && !(_id in path("drafts.**"))]
  | order(coalesce(sortOrder, 99) asc, coalesce(publishedAt, _createdAt) desc){
    _id, title, titleEn, subtitle, subtitleEn, location, locationEn,
    summary, summaryEn, description, descriptionEn, sortOrder,
    "images": images[]{_key, ${IMAGE_FIELDS}}
}`;

const QUERY = PAGE === 'projects'
  ? `{${SETTINGS_QUERY}, ${PROJECTS_QUERY}}`
  : PAGE === 'contact'
    ? `{${SETTINGS_QUERY}}`
    : `{${SETTINGS_QUERY}, ${AGENTS_QUERY}, ${PROPERTIES_QUERY}}`;

const STATUS_WEIGHT = { disponivel: 0, reservado: 1, vendido: 2 };

const euro = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const t = (key) => (window.EdizurUI ? EdizurUI.t(key) : key);

function statusLabel(status) {
  if (status === 'reservado') return t('reserved');
  if (status === 'vendido') return t('sold');
  return '';
}

const state = {
  properties: [],
  projects: [],
  agents: [],
  settings: null,
  filter: 'all',
  typology: 'all',
  price: 'all',
  view: 'grid',
  gallery: null,
  modalKind: null,
  map: null,
  mapMarkers: null,
  leafletPromise: null,
};

function loc(doc, field) {
  if (!doc) return '';
  const lang = window.EdizurUI?.lang || 'pt';
  if (lang === 'en') {
    const english = doc[`${field}En`];
    if (typeof english === 'string' && english.trim()) return english.trim();
  }
  const value = doc[field];
  return typeof value === 'string' ? value.trim() : (value ?? '');
}

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);

const icon = (name) => `<svg class="ico" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

const digits = (value) => String(value || '').replace(/\D/g, '');

function contactPhone() {
  return (
    state.settings?.phone ||
    state.agents.find((agent) => agent.phone)?.phone ||
    CONFIG.fallbackPhone
  );
}

/* ---------- data ---------- */

function imageUrl(image, { width, height, q } = {}) {
  if (!image?.url) return null;
  const params = new URLSearchParams();
  if (width) params.set('w', String(width));
  if (height) params.set('h', String(height));
  if (width || height) params.set('fit', 'crop');
  if (typeof image.hotspot?.x === 'number' && typeof image.hotspot?.y === 'number') {
    params.set('crop', 'focalpoint');
    params.set('fp-x', image.hotspot.x.toFixed(3));
    params.set('fp-y', image.hotspot.y.toFixed(3));
  }
  params.set('auto', 'format');
  params.set('fm', 'webp');
  params.set('q', String(q ?? (width && width <= 800 ? 52 : 60)));
  return `${image.url}?${params}`;
}

async function loadContent() {
  const endpoint =
    `https://${CONFIG.projectId}.apicdn.sanity.io/${CONFIG.apiVersion}` +
    `/data/query/${CONFIG.dataset}?query=${encodeURIComponent(QUERY)}`;

  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Sanity respondeu ${response.status}`);
  const { result } = await response.json();
  return result ?? {};
}

function loadLeaflet() {
  if (window.L) return Promise.resolve();
  if (state.leafletPromise) return state.leafletPromise;

  state.leafletPromise = new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = CONFIG.leafletCss;
    css.integrity = CONFIG.leafletCssIntegrity;
    css.crossOrigin = '';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = CONFIG.leafletJs;
    script.integrity = CONFIG.leafletJsIntegrity;
    script.crossOrigin = '';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Leaflet não carregou'));
    document.body.appendChild(script);
  });

  return state.leafletPromise;
}

/* ---------- formatting ---------- */

function priceLabel(property) {
  if (property.priceOnRequest || typeof property.price !== 'number') return t('onRequest');
  return euro.format(property.price);
}

function typeLabel(property) {
  return property.listingType === 'procura' ? t('wanted') : t('sale');
}

function formatArea(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return `${new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 1 }).format(value)} m²`;
}

function usefulArea(property) {
  return typeof property.areaUtil === 'number' ? property.areaUtil : property.area;
}

function specs(property) {
  const util = usefulArea(property);
  return [
    property.typology && { icon: 'bed', value: property.typology },
    util && { icon: 'area', value: formatArea(util) },
    property.areaBruta && { icon: 'area', value: `${formatArea(property.areaBruta)} ${t('areaBrutaShort')}` },
    property.bathrooms && { icon: 'bath', value: `${property.bathrooms} WC` },
    property.energyRating && { icon: 'bolt', value: `Energia ${property.energyRating}` },
  ].filter(Boolean);
}

/* ---------- chrome / motion ---------- */

function bindHeaderScroll() {
  /* handled by i18n.js chrome */
}

function observeReveals(root = document) {
  const nodes = $$('.reveal, .project-row', root).filter((node) => !node.classList.contains('is-in'));
  if (!nodes.length) return;

  if (!('IntersectionObserver' in window)) {
    nodes.forEach((node) => node.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );

  nodes.forEach((node) => observer.observe(node));
}

function setOgImage(url) {
  if (!url) return;
  let meta = document.querySelector('meta[property="og:image"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', 'og:image');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', url);
}

/* ---------- rendering ---------- */

function applySettings(settings) {
  if (!settings) return;

  for (const node of $$('[data-content]')) {
    const value = loc(settings, node.dataset.content);
    if (value) {
      node.textContent = value;
      node.dataset.contentLocked = '1';
    } else {
      delete node.dataset.contentLocked;
    }
  }

  if (window.EdizurUI?.lang === 'en') {
    $$('[data-i18n-fallback]').forEach((node) => {
      if (node.dataset.contentLocked === '1') return;
      const value = t(node.dataset.i18nFallback);
      if (value) node.textContent = value;
    });
  }

  const email = settings.email || CONFIG.fallbackEmail;
  const emailLink = $('#footer-email');
  if (emailLink) {
    emailLink.href = `mailto:${email}`;
    const emailText = $('#footer-email-text');
    if (emailText) emailText.textContent = email;
  }

  const phone = settings.phone || CONFIG.fallbackPhone;
  const phoneLink = $('#footer-phone');
  if (phone && phoneLink) {
    phoneLink.href = `tel:${digits(phone)}`;
    const phoneText = $('#footer-phone-text');
    if (phoneText) phoneText.textContent = phone;
    phoneLink.hidden = false;
  }

  const addressLines = (settings.address || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const footerAddress = $('#footer-address');
  if (footerAddress) {
    footerAddress.textContent = addressLines.join('\n');
    footerAddress.hidden = !addressLines.length;
  }

  renderSocial(settings);

  const heroSource = settings.heroImage;
  const heroUrl = imageUrl(heroSource, { width: 1600, height: 1100, q: 68 });
  const hero = $('#hero-image');
  if (heroUrl && hero) {
    hero.src = heroUrl;
    hero.alt = heroSource?.alt || 'Edizur';
    setOgImage(imageUrl(heroSource, { width: 1200, height: 630, q: 72 }));
  }
}

function renderSocial(settings) {
  const networks = [
    { name: 'Instagram', url: settings.instagram, icon: 'instagram' },
    { name: 'Facebook', url: settings.facebook, icon: 'facebook' },
  ].filter((network) => network.url);

  const container = $('#footer-social');
  if (!container) return;
  container.hidden = !networks.length;
  container.innerHTML = networks
    .map(
      (network) =>
        `<a href="${escapeHtml(network.url)}" target="_blank" rel="noopener"
            aria-label="${escapeHtml(network.name)}">${icon(network.icon)}<span>${escapeHtml(network.name)}</span></a>`,
    )
    .join('');
}

function propertyCard(property) {
  const images = property.images || [];
  const title = loc(property, 'title');
  const location = loc(property, 'location') || loc(state.settings, 'region') || 'Porto e região';
  const description = loc(property, 'description');
  const coverUrl = imageUrl(images[0], { width: 640, height: 480 });
  const status = statusLabel(property.status);
  const count = images.length;
  const specList = specs(property);
  const lqip = images[0]?.lqip;
  const slides = images
    .map((image, index) => {
      const url = imageUrl(image, { width: 640, height: 480 });
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(image.alt || title)}"
        data-card-slide="${index}" ${index ? 'hidden loading="lazy"' : 'loading="lazy"'}
        decoding="async"
        style="${index || !lqip ? '' : `background:url('${escapeHtml(lqip)}') center/cover`}">`;
    })
    .join('');

  return `
    <article class="card reveal" data-id="${escapeHtml(property._id)}" data-card-index="0">
      <div class="card-media${coverUrl ? '' : ' is-empty'}">
        ${slides}
        <span class="badge${property.listingType === 'procura' ? ' is-procura' : ''}">${typeLabel(property)}</span>
        ${status ? `<span class="badge-status">${status}</span>` : ''}
        <span class="card-price">${escapeHtml(priceLabel(property))}</span>
        ${count > 1
          ? `<button class="card-carousel-nav prev" type="button" data-card-step="-1"
                aria-label="Fotografia anterior">${icon('chev-l')}</button>
             <button class="card-carousel-nav next" type="button" data-card-step="1"
                aria-label="Fotografia seguinte">${icon('chev-r')}</button>
             <span class="photo-count" data-card-count aria-live="polite">1 / ${count}</span>`
          : ''}
      </div>
      <button class="card-body" type="button" data-open-property
        aria-label="${escapeHtml(t('seeDetails'))}: ${escapeHtml(title)}">
        <p class="card-meta">
          ${icon('pin')}<span>${escapeHtml(location)}</span>
        </p>
        <h3>${escapeHtml(title)}</h3>
        ${specList.length
          ? `<p class="specs">${specList.map((s) => `<span>${icon(s.icon)}${escapeHtml(s.value)}</span>`).join('')}</p>`
          : ''}
        ${description ? `<p class="card-excerpt">${escapeHtml(description)}</p>` : ''}
        <span class="card-foot">
          <span class="card-agent">${escapeHtml(property.agent?.name || t('teamDefault'))}</span>
          <span class="card-cta">${escapeHtml(t('seeDetails'))} ${icon('arrow')}</span>
        </span>
      </button>
    </article>`;
}

function stepCardGallery(card, step) {
  const slides = $$('[data-card-slide]', card);
  if (slides.length < 2) return;

  const current = Number(card.dataset.cardIndex) || 0;
  const next = (current + step + slides.length) % slides.length;
  card.dataset.cardIndex = String(next);
  slides.forEach((slide, index) => { slide.hidden = index !== next; });
  $('[data-card-count]', card).textContent = `${next + 1} / ${slides.length}`;
}

async function ensureMap() {
  if (state.map) return true;

  try {
    await loadLeaflet();
  } catch {
    return false;
  }

  if (!window.L) return false;

  state.map = L.map('property-map', { scrollWheelZoom: false }).setView([41.1579, -8.6291], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(state.map);
  state.mapMarkers = L.layerGroup().addTo(state.map);
  return true;
}

async function renderMap(properties) {
  const empty = $('#map-empty');
  const positioned = properties.filter(
    (property) =>
      Number.isFinite(property.mapLocation?.lat) &&
      Number.isFinite(property.mapLocation?.lng),
  );

  empty.textContent = t('mapLoading');
  empty.hidden = false;

  if (!(await ensureMap())) {
    empty.textContent = t('mapFail');
    empty.hidden = false;
    return;
  }

  state.mapMarkers.clearLayers();
  empty.textContent = t('emptyMap');
  empty.hidden = positioned.length > 0;

  const bounds = [];
  for (const property of positioned) {
    const coordinates = [property.mapLocation.lat, property.mapLocation.lng];
    bounds.push(coordinates);

    const marker = L.circleMarker(coordinates, {
      radius: 9,
      color: '#fff',
      weight: 2,
      fillColor: '#9a7f52',
      fillOpacity: 1,
    });
    marker.bindTooltip(
      `<strong class="map-tooltip-title">${escapeHtml(loc(property, 'title'))}</strong>` +
      `<span class="map-tooltip-price">${escapeHtml(priceLabel(property))}</span>`,
      { className: 'edizur-map-tooltip', direction: 'top', offset: [0, -7] },
    );
    marker.on('click', () => openProperty(property._id));
    marker.addTo(state.mapMarkers);
  }

  requestAnimationFrame(() => {
    state.map.invalidateSize({ pan: false });
    if (bounds.length === 1) state.map.setView(bounds[0], 14);
    if (bounds.length > 1) state.map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
  });
}

function renderProperties() {
  const grid = $('#grid');
  const empty = $('#empty');
  const mapView = $('#map-view');
  if (!grid) return;

  const visible = state.properties
    .filter((p) => state.filter === 'all' || p.listingType === state.filter)
    .filter((p) => state.typology === 'all' || p.typology === state.typology)
    .filter((p) => matchesPrice(p, state.price))
    .sort((a, b) => (STATUS_WEIGHT[a.status] ?? 0) - (STATUS_WEIGHT[b.status] ?? 0));

  grid.removeAttribute('aria-busy');
  grid.hidden = state.view !== 'grid';
  if (mapView) mapView.hidden = state.view !== 'map';

  if (state.view === 'map') {
    if (empty) empty.hidden = true;
    renderMap(visible);
    return;
  }

  grid.innerHTML = visible.map(propertyCard).join('');
  if (empty) {
    empty.textContent = t('emptyListings');
    empty.hidden = visible.length > 0;
  }
  observeReveals(grid);
}

function renderTeam() {
  const container = $('#team');
  if (!container) return;

  if (!state.agents.length) {
    container.closest('section').hidden = true;
    return;
  }

  container.closest('section').hidden = false;
  container.innerHTML = state.agents
    .map((agent) => {
      const photo = imageUrl(agent.photo, { width: 480, height: 600, q: 62 });
      const bio = loc(agent, 'bio');
      const initials = agent.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');

      return `
        <article class="member reveal">
          <div class="member-photo">
            ${photo
              ? `<img src="${escapeHtml(photo)}" alt="${escapeHtml(agent.name)}" loading="lazy" decoding="async">`
              : `<span class="member-initials" aria-hidden="true">${escapeHtml(initials)}</span>`}
          </div>
          <div class="member-copy">
            <h3>${escapeHtml(agent.name)}</h3>
            <p class="role">${escapeHtml(loc(agent, 'role') || t('roleDefault'))}</p>
            ${bio ? `<p class="member-bio">${escapeHtml(bio)}</p>` : ''}
            <div class="member-links">
              ${agent.phone ? `<a class="chip" href="tel:${escapeHtml(agent.phone.replace(/\s/g, ''))}">${icon('phone')}${escapeHtml(agent.phone)}</a>` : ''}
              ${agent.email ? `<a class="chip" href="mailto:${escapeHtml(agent.email)}">${icon('mail')}${escapeHtml(agent.email)}</a>` : ''}
            </div>
          </div>
        </article>`;
    })
    .join('');

  observeReveals(container);
}

function projectCard(project) {
  const images = project.images || [];
  const title = loc(project, 'title');
  const location = loc(project, 'location') || loc(state.settings, 'region') || 'Porto e região';
  const subtitle = loc(project, 'subtitle');
  const summary = loc(project, 'summary');
  const coverUrl = imageUrl(images[0], { width: 1100, height: 700 });
  const lqip = images[0]?.lqip;

  return `
    <article class="project-row reveal" data-project-id="${escapeHtml(project._id)}">
      <div class="project-row-media${coverUrl ? '' : ' is-empty'}">
        ${coverUrl
          ? `<img src="${escapeHtml(coverUrl)}" alt="${escapeHtml(images[0]?.alt || title)}"
              loading="lazy" decoding="async"
              style="${lqip ? `background:url('${escapeHtml(lqip)}') center/cover` : ''}">`
          : ''}
      </div>
      <button class="project-row-body" type="button" data-open-project
        aria-label="${escapeHtml(t('seeProject'))}: ${escapeHtml(title)}">
        <p class="card-meta">
          ${icon('pin')}<span>${escapeHtml(location)}</span>
        </p>
        <h3>${escapeHtml(title)}</h3>
        ${subtitle ? `<p class="card-subtitle">${escapeHtml(subtitle)}</p>` : ''}
        ${summary ? `<p class="card-excerpt">${escapeHtml(summary)}</p>` : ''}
        <span class="card-foot">
          <span class="card-cta">${escapeHtml(t('seeProject'))} ${icon('arrow')}</span>
        </span>
      </button>
    </article>`;
}

function renderProjects() {
  const grid = $('#projects-grid');
  const empty = $('#projects-empty');
  if (!grid) return;

  grid.removeAttribute('aria-busy');
  grid.innerHTML = state.projects.map(projectCard).join('');
  if (empty) {
    empty.textContent = t('emptyProjects');
    empty.hidden = state.projects.length > 0;
  }
  grid.closest('section')?.removeAttribute('hidden');
  $$('.project-row', grid).forEach((node) => node.classList.add('is-in'));
}

/* ---------- detail modal ---------- */

function galleryMarkup(item) {
  const images = item.images || [];
  if (!images.length) return '';

  const slides = images
    .map((image, index) => {
      const url = imageUrl(image, { width: 1000, height: 680 });
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(image.alt || loc(item, 'title'))}"
        data-slide="${index}" ${index ? 'hidden' : ''} ${index ? 'loading="lazy"' : ''}>`;
    })
    .join('');

  const controls = images.length > 1
    ? `<button class="gallery-nav prev" data-step="-1" aria-label="Foto anterior">${icon('chev-l')}</button>
       <button class="gallery-nav next" data-step="1" aria-label="Foto seguinte">${icon('chev-r')}</button>
       <div class="gallery-dots">${images
         .map((_, i) => `<button data-goto="${i}" class="${i ? '' : 'is-active'}" aria-label="Foto ${i + 1}"></button>`)
         .join('')}</div>`
    : '';

  return `<div class="gallery" id="gallery">${slides}${controls}</div>`;
}

function detailMarkup(property) {
  const agent = property.agent;
  const title = loc(property, 'title');
  const description = loc(property, 'description');
  const place = loc(property, 'location');
  const email = agent?.email || state.settings?.email || CONFIG.fallbackEmail;
  const phone = digits(agent?.phone || contactPhone());
  const propertyUrl = new URL(window.location.href);
  propertyUrl.search = '';
  propertyUrl.hash = `imovel-${property._id}`;

  const message = `Olá, tenho interesse em "${title}".\n\n${propertyUrl.href}`;
  const subject = `Interesse: ${title}`;
  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : '';
  const emailUrl =
    'https://mail.google.com/mail/?view=cm&fs=1' +
    `&to=${encodeURIComponent(email)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(message)}`;
  const status = statusLabel(property.status);

  const util = usefulArea(property);
  const rows = [
    property.reference && [t('reference'), property.reference],
    property.location && [t('location'), place],
    property.typology && [t('typology'), property.typology],
    util && [t('areaUtil'), formatArea(util)],
    typeof property.areaBruta === 'number' && [t('areaBruta'), formatArea(property.areaBruta)],
    typeof property.areaTerreno === 'number' && [t('areaLand'), formatArea(property.areaTerreno)],
    typeof property.areaGaragem === 'number' && [t('areaGarage'), formatArea(property.areaGaragem)],
    property.bedrooms && [t('bedrooms'), property.bedrooms],
    typeof property.suites === 'number' && property.suites > 0 && [t('suites'), property.suites],
    property.bathrooms && [t('bathrooms'), property.bathrooms],
    typeof property.parkingSpaces === 'number' && property.parkingSpaces > 0 && [t('parking'), property.parkingSpaces],
    property.floor && [t('floor'), property.floor],
    property.yearBuilt && [t('yearBuilt'), property.yearBuilt],
    typeof property.condoFee === 'number' && [t('condoFee'), `${euro.format(property.condoFee)} / ${t('month')}`],
    property.energyRating && [t('energy'), property.energyRating],
    status && [t('status'), status],
  ].filter(Boolean);

  return `
    ${galleryMarkup(property)}
    <div class="modal-content">
      <p class="eyebrow"><span class="dot"></span>${typeLabel(property)}${property.featured ? ` · ${t('featured')}` : ''}</p>
      <h2 id="modal-title">${escapeHtml(title)}</h2>
      <p class="modal-price">
        ${property.listingType === 'procura' && !property.priceOnRequest ? t('budgetUpTo') : ''}${escapeHtml(priceLabel(property))}
      </p>

      ${rows.length
        ? `<dl class="spec-grid">${rows
            .map(([label, value]) => `<div class="spec"><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`)
            .join('')}</dl>`
        : ''}

      ${description ? `<p class="modal-desc">${escapeHtml(description)}</p>` : ''}

      ${property.features?.length
        ? `<ul class="feature-list">${property.features
            .map((feature) => `<li>${icon('check')}${escapeHtml(feature)}</li>`)
            .join('')}</ul>`
        : ''}

      <div class="modal-agent">
        ${agent?.photo
          ? `<img src="${escapeHtml(imageUrl(agent.photo, { width: 140, height: 140 }))}" alt="${escapeHtml(agent.name)}">`
          : ''}
        <span class="who">
          <strong>${escapeHtml(agent?.name || t('teamDefault'))}</strong>
          <span>${escapeHtml(loc(agent, 'role') || t('roleDefault'))}</span>
        </span>
        <span class="modal-actions">
          ${whatsappUrl
            ? `<a class="btn btn-gold" href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener">${icon('message')}${escapeHtml(t('sendMessage'))}</a>`
            : ''}
          <a class="btn btn-ghost" href="${escapeHtml(emailUrl)}" target="_blank" rel="noopener">${icon('mail')}${escapeHtml(t('sendEmail'))}</a>
        </span>
      </div>
    </div>`;
}

function projectDetailMarkup(project) {
  const title = loc(project, 'title');
  const subtitle = loc(project, 'subtitle');
  const place = loc(project, 'location');
  const description = loc(project, 'description');
  const email = state.settings?.email || CONFIG.fallbackEmail;
  const phone = digits(contactPhone());
  const projectUrl = new URL(window.location.href);
  projectUrl.search = '';
  projectUrl.hash = `projeto-${project._id}`;

  const message = `Olá, gostaria de saber mais sobre o projeto "${title}".\n\n${projectUrl.href}`;
  const subject = `Projeto: ${title}`;
  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : '';
  const emailUrl =
    'https://mail.google.com/mail/?view=cm&fs=1' +
    `&to=${encodeURIComponent(email)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(message)}`;

  return `
    ${galleryMarkup(project)}
    <div class="modal-content">
      <p class="eyebrow"><span class="dot"></span>${escapeHtml(t('project'))}</p>
      <h2 id="modal-title">${escapeHtml(title)}</h2>
      ${subtitle ? `<p class="modal-subtitle">${escapeHtml(subtitle)}</p>` : ''}
      ${place
        ? `<dl class="spec-grid"><div class="spec"><dt>${escapeHtml(t('location'))}</dt><dd>${escapeHtml(place)}</dd></div></dl>`
        : ''}
      ${description ? `<p class="modal-desc">${escapeHtml(description)}</p>` : ''}
      <div class="modal-agent">
        <span class="who">
          <strong>Edizur</strong>
          <span>${escapeHtml(t('brandTagline'))}</span>
        </span>
        <span class="modal-actions">
          ${whatsappUrl
            ? `<a class="btn btn-gold" href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener">${icon('message')}${escapeHtml(t('sendMessage'))}</a>`
            : ''}
          <a class="btn btn-ghost" href="${escapeHtml(emailUrl)}" target="_blank" rel="noopener">${icon('mail')}${escapeHtml(t('sendEmail'))}</a>
        </span>
      </div>
    </div>`;
}

function showSlide(index) {
  const gallery = $('#gallery');
  if (!gallery) return;

  const slides = $$('[data-slide]', gallery);
  if (!slides.length) return;

  const next = (index + slides.length) % slides.length;
  const current = slides[state.gallery ?? 0];
  const incoming = slides[next];
  state.gallery = next;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !current || current === incoming) {
    slides.forEach((slide, i) => { slide.hidden = i !== next; });
  } else {
    current.classList.add('is-fading');
    window.setTimeout(() => {
      current.hidden = true;
      current.classList.remove('is-fading');
      incoming.hidden = false;
      incoming.classList.add('is-fading');
      requestAnimationFrame(() => incoming.classList.remove('is-fading'));
    }, 160);
  }

  $$('[data-goto]', gallery).forEach((dot, i) => dot.classList.toggle('is-active', i === next));
}

function openProperty(id, { updateHash = true } = {}) {
  const property = state.properties.find((item) => item._id === id);
  if (!property) return;

  state.modalKind = 'property';
  $('#modal-body').innerHTML = detailMarkup(property);
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
  state.gallery = 0;
  $('.modal-close').focus();

  if (updateHash) history.replaceState(null, '', `#imovel-${id}`);
}

function openProject(id, { updateHash = true } = {}) {
  const project = state.projects.find((item) => item._id === id);
  if (!project) return;

  state.modalKind = 'project';
  $('#modal-body').innerHTML = projectDetailMarkup(project);
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
  state.gallery = 0;
  $('.modal-close').focus();

  if (updateHash) {
    const base = PAGE === 'projects' ? '' : 'projetos.html';
    history.replaceState(null, '', `${base}#projeto-${id}`);
  }
}

function closeModal() {
  $('#modal').hidden = true;
  $('#modal-body').innerHTML = '';
  document.body.style.overflow = '';
  state.gallery = null;
  state.modalKind = null;
  if (/^#(imovel|projeto)-/.test(location.hash)) {
    history.replaceState(null, '', location.pathname);
  }
}

/* ---------- events ---------- */

function matchesPrice(property, bucket) {
  if (bucket === 'all') return true;
  if (typeof property.price !== 'number' || property.priceOnRequest) return false;
  if (bucket === '0-250000') return property.price < 250000;
  if (bucket === '250000-500000') return property.price >= 250000 && property.price < 500000;
  if (bucket === '500000-1000000') return property.price >= 500000 && property.price < 1000000;
  if (bucket === '1000000') return property.price >= 1000000;
  return true;
}

function fillListingFilters() {
  const typologySelect = $('#filter-typology');
  if (typologySelect) {
    const types = [...new Set(state.properties.map((item) => item.typology).filter(Boolean))].sort();
    const current = types.includes(state.typology) ? state.typology : 'all';
    typologySelect.innerHTML =
      `<option value="all">${escapeHtml(t('filterAllTypes'))}</option>` +
      types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('');
    typologySelect.value = current;
    state.typology = current;
  }

  const priceSelect = $('#filter-price');
  if (priceSelect) {
    const options = [
      ['all', t('filterAllPrices')],
      ['0-250000', t('priceTo250')],
      ['250000-500000', t('price250to500')],
      ['500000-1000000', t('price500to1m')],
      ['1000000', t('priceFrom1m')],
    ];
    priceSelect.innerHTML = options
      .map(([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`)
      .join('');
    priceSelect.value = state.price;
  }
}

function bindContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  const note = $('#form-note');
  const button = form.querySelector('[type="submit"]');
  const inbox = CONFIG.fallbackEmail;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (form.querySelector('[name="bot-field"]')?.value) return;

    if (!form.reportValidity()) return;

    const first = form.nome.value.trim();
    const last = form.sobrenome.value.trim();
    const email = form.email.value.trim();
    const message = form.mensagem.value.trim();
    const payload = {
      name: `${first} ${last}`.trim(),
      email,
      message,
      _subject: 'Contacto via edizur.pt',
      _template: 'table',
      _captcha: 'false',
    };

    if (button) {
      button.disabled = true;
      button.textContent = t('formSending');
    }
    if (note) {
      note.hidden = true;
      note.textContent = '';
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${inbox}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      if (note) {
        note.textContent = t('formThanks');
        note.hidden = false;
      }
    } catch {
      const subject = encodeURIComponent('Contacto via edizur.pt');
      const body = encodeURIComponent(`${payload.name}\n${payload.email}\n\n${payload.message}`);
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inbox)}&su=${subject}&body=${body}`,
        '_blank',
        'noopener',
      );
      if (note) {
        note.textContent = t('formError');
        note.hidden = false;
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = t('formSend');
      }
    }
  });
}

function bindEvents() {
  $('#nav-toggle')?.addEventListener('click', (event) => {
    const nav = $('#nav');
    if (!nav) return;
    const open = nav.classList.toggle('is-open');
    event.currentTarget.setAttribute('aria-expanded', String(open));
  });

  $('#nav')?.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') $('#nav').classList.remove('is-open');
  });

  $('#filters')?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;

    state.filter = button.dataset.filter;
    for (const tab of $$('#filters button')) {
      const active = tab === button;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    }
    renderProperties();
  });

  $('#filter-typology')?.addEventListener('change', (event) => {
    state.typology = event.target.value || 'all';
    renderProperties();
  });

  $('#filter-price')?.addEventListener('change', (event) => {
    state.price = event.target.value || 'all';
    renderProperties();
  });

  $('#view-switch')?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-view]');
    if (!button || button.dataset.view === state.view) return;

    state.view = button.dataset.view;
    for (const option of $$('#view-switch button')) {
      const active = option === button;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-pressed', String(active));
    }
    renderProperties();
  });

  $('#grid')?.addEventListener('click', (event) => {
    const step = event.target.closest('[data-card-step]');
    if (step) {
      stepCardGallery(step.closest('.card'), Number(step.dataset.cardStep));
      return;
    }

    if (!event.target.closest('[data-open-property]')) return;
    const card = event.target.closest('.card[data-id]');
    if (card) openProperty(card.dataset.id);
  });

  $('#projects-grid')?.addEventListener('click', (event) => {
    if (!event.target.closest('[data-open-project]')) return;
    const card = event.target.closest('[data-project-id]');
    if (card) openProject(card.dataset.projectId);
  });

  $('#modal')?.addEventListener('click', (event) => {
    if (event.target.closest('[data-close]')) return closeModal();

    const step = event.target.closest('[data-step]');
    if (step) return showSlide(state.gallery + Number(step.dataset.step));

    const goto = event.target.closest('[data-goto]');
    if (goto) showSlide(Number(goto.dataset.goto));
  });

  document.addEventListener('keydown', (event) => {
    if ($('#modal')?.hidden !== false) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowLeft') showSlide(state.gallery - 1);
    if (event.key === 'ArrowRight') showSlide(state.gallery + 1);
  });

  bindContactForm();

  window.addEventListener('edizur:lang', () => {
    applySettings(state.settings);
    if (PAGE === 'projects') renderProjects();
    else if (PAGE === 'home') {
      fillListingFilters();
      renderTeam();
      renderProperties();
    }
  });
}

/* ---------- boot ---------- */

async function init() {
  if (PAGE === 'home' && /^#(equipa|servicos)$/.test(location.hash)) {
    history.replaceState(null, '', `${location.pathname}#sobre`);
  }

  if (PAGE === 'home' && /^#projeto-/.test(location.hash)) {
    location.replace(`projetos.html${location.hash}`);
    return;
  }

  const year = new Date().getFullYear();
  const yearNode = $('#year');
  if (yearNode) {
    yearNode.textContent =
      year > CONFIG.foundedYear ? `${CONFIG.foundedYear}–${year}` : String(CONFIG.foundedYear);
  }
  bindEvents();
  bindHeaderScroll();
  observeReveals();

  try {
    const result = await loadContent();
    state.settings = result.settings || null;
    state.agents = result.agents || [];
    state.properties = result.properties || [];
    state.projects = result.projects || [];

    applySettings(state.settings);

    if (PAGE === 'contact') return;

    if (PAGE === 'projects') {
      renderProjects();
      const projectMatch = location.hash.match(/^#projeto-(.+)$/);
      if (projectMatch) openProject(projectMatch[1], { updateHash: false });
      return;
    }

    fillListingFilters();
    renderTeam();
    renderProperties();

    const propertyMatch = location.hash.match(/^#imovel-(.+)$/);
    if (propertyMatch) openProperty(propertyMatch[1], { updateHash: false });
  } catch (error) {
    console.error('[edizur] falha ao carregar conteúdo', error);
    if (PAGE === 'contact') return;
    if (PAGE === 'projects') {
      const grid = $('#projects-grid');
      const empty = $('#projects-empty');
      if (grid) {
        grid.innerHTML = '';
        grid.removeAttribute('aria-busy');
      }
      if (empty) {
        empty.textContent = t('loadFail');
        empty.hidden = false;
      }
      return;
    }

    const grid = $('#grid');
    if (grid) {
      grid.innerHTML = '';
      grid.removeAttribute('aria-busy');
    }
    const empty = $('#empty');
    if (empty) {
      empty.textContent = t('loadFail');
      empty.hidden = false;
    }
  }
}

init();
