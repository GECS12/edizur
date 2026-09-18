/* Edizur — public site. Reads published content from the Sanity Content Lake. */

const CONFIG = {
  projectId: 'a5nclqso',
  dataset: 'production',
  apiVersion: 'v2026-09-18',
  fallbackEmail: 'edizur.imobiliaria@gmail.com',
  foundedYear: 2025,
};

const IMAGE_FIELDS = `alt, hotspot, "url": asset->url, "lqip": asset->metadata.lqip`;

const QUERY = `{
  "settings": *[_id == "siteSettings"][0]{
    heroTitle, heroSubtitle, region, email, phone, sellText, buyText, footerTagline,
    address, instagram, facebook,
    "heroImage": heroImage{${IMAGE_FIELDS}}
  },
  "agents": *[_type == "agent" && !(_id in path("drafts.**"))] | order(coalesce(sortOrder, 99) asc, name asc){
    _id, name, role, phone, email, "photo": photo{${IMAGE_FIELDS}}
  },
  "properties": *[_type == "property" && !(_id in path("drafts.**"))]
    | order(coalesce(featured, false) desc, coalesce(publishedAt, _createdAt) desc){
      _id, title, listingType, status, price, priceOnRequest, location, typology,
      area, bedrooms, bathrooms, energyRating, description, features, reference, featured,
      "images": images[]{_key, ${IMAGE_FIELDS}},
      "agent": agent->{_id, name, role, phone, email, "photo": photo{${IMAGE_FIELDS}}}
  }
}`;

const STATUS_LABELS = { disponivel: '', reservado: 'Reservado', vendido: 'Vendido' };
const STATUS_WEIGHT = { disponivel: 0, reservado: 1, vendido: 2 };

const euro = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const state = { properties: [], agents: [], settings: null, filter: 'all', gallery: null };

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);

const icon = (name) => `<svg class="ico" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

/* ---------- data ---------- */

function imageUrl(image, { width, height } = {}) {
  if (!image?.url) return null;
  const params = new URLSearchParams();
  if (width) params.set('w', String(width));
  if (height) params.set('h', String(height));
  if (width || height) params.set('fit', 'crop');
  if (image.hotspot) {
    params.set('crop', 'focalpoint');
    params.set('fp-x', image.hotspot.x.toFixed(3));
    params.set('fp-y', image.hotspot.y.toFixed(3));
  }
  params.set('auto', 'format');
  params.set('q', '78');
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

/* ---------- formatting ---------- */

function priceLabel(property) {
  if (property.priceOnRequest || typeof property.price !== 'number') return 'Sob consulta';
  return euro.format(property.price);
}

function typeLabel(property) {
  return property.listingType === 'procura' ? 'Procura' : 'Venda';
}

function specs(property) {
  return [
    property.typology && { icon: 'bed', value: property.typology },
    property.area && { icon: 'area', value: `${property.area} m²` },
    property.bathrooms && { icon: 'bath', value: `${property.bathrooms} WC` },
    property.energyRating && { icon: 'bolt', value: `Energia ${property.energyRating}` },
  ].filter(Boolean);
}

/* ---------- rendering ---------- */

function applySettings(settings) {
  if (!settings) return;

  for (const node of $$('[data-content]')) {
    const value = settings[node.dataset.content];
    if (typeof value === 'string' && value.trim()) node.textContent = value.trim();
  }

  const email = settings.email || CONFIG.fallbackEmail;
  $('#footer-email').href = `mailto:${email}`;
  $('#footer-email-text').textContent = email;

  const addressLines = (settings.address || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const footerAddress = $('#footer-address');
  footerAddress.textContent = addressLines.join('\n');
  footerAddress.hidden = !addressLines.length;

  renderSocial(settings);

  const heroUrl = imageUrl(settings.heroImage, { width: 1100, height: 1300 });
  if (heroUrl) {
    const hero = $('#hero-image');
    hero.src = heroUrl;
    hero.alt = settings.heroImage.alt || 'Imóveis Edizur';
  }
}

function renderSocial(settings) {
  const networks = [
    { name: 'Instagram', url: settings.instagram, icon: 'instagram' },
    { name: 'Facebook', url: settings.facebook, icon: 'facebook' },
  ].filter((network) => network.url);

  const container = $('#footer-social');
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
  const coverUrl = imageUrl(images[0], { width: 760, height: 570 });
  const status = STATUS_LABELS[property.status] || '';
  const count = images.length;
  const specList = specs(property);
  const slides = images
    .map((image, index) => {
      const url = imageUrl(image, { width: 760, height: 570 });
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(image.alt || property.title)}"
        data-card-slide="${index}" ${index ? 'hidden loading="lazy"' : 'loading="lazy"'}
        decoding="async">`;
    })
    .join('');

  return `
    <article class="card" data-id="${escapeHtml(property._id)}" data-card-index="0">
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
        aria-label="Ver detalhes de ${escapeHtml(property.title)}">
        <p class="card-meta">
          ${icon('pin')}<span>${escapeHtml(property.location || 'Porto e região')}</span>
        </p>
        <h3>${escapeHtml(property.title)}</h3>
        ${specList.length
          ? `<p class="specs">${specList.map((s) => `<span>${icon(s.icon)}${escapeHtml(s.value)}</span>`).join('')}</p>`
          : ''}
        ${property.description ? `<p class="card-excerpt">${escapeHtml(property.description)}</p>` : ''}
        <span class="card-foot">
          <span class="card-agent">${escapeHtml(property.agent?.name || 'Equipa Edizur')}</span>
          <span class="card-cta">Ver detalhes ${icon('arrow')}</span>
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

function renderProperties() {
  const grid = $('#grid');
  const empty = $('#empty');

  const visible = state.properties
    .filter((p) => state.filter === 'all' || p.listingType === state.filter)
    .sort((a, b) => (STATUS_WEIGHT[a.status] ?? 0) - (STATUS_WEIGHT[b.status] ?? 0));

  grid.removeAttribute('aria-busy');
  grid.innerHTML = visible.map(propertyCard).join('');
  empty.hidden = visible.length > 0;
}

function renderTeam() {
  const container = $('#team');

  if (!state.agents.length) {
    container.closest('section').hidden = true;
    return;
  }

  container.closest('section').hidden = false;
  container.innerHTML = state.agents
    .map((agent) => {
      const photo = imageUrl(agent.photo, { width: 380, height: 380 });
      const initials = agent.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');

      return `
        <article class="member">
          <div class="member-photo">
            ${photo
              ? `<img src="${escapeHtml(photo)}" alt="${escapeHtml(agent.name)}" loading="lazy" decoding="async">`
              : `<span class="member-initials" aria-hidden="true">${escapeHtml(initials)}</span>`}
          </div>
          <h3>${escapeHtml(agent.name)}</h3>
          <p class="role">${escapeHtml(agent.role || 'Consultor Imobiliário')}</p>
          <div class="member-links">
            ${agent.phone ? `<a class="chip" href="tel:${escapeHtml(agent.phone.replace(/\s/g, ''))}">${icon('phone')}${escapeHtml(agent.phone)}</a>` : ''}
            ${agent.email ? `<a class="chip" href="mailto:${escapeHtml(agent.email)}">${icon('mail')}${escapeHtml(agent.email)}</a>` : ''}
          </div>
        </article>`;
    })
    .join('');
}

/* ---------- detail modal ---------- */

function galleryMarkup(property) {
  const images = property.images || [];
  if (!images.length) return '';

  const slides = images
    .map((image, index) => {
      const url = imageUrl(image, { width: 1200, height: 800 });
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(image.alt || property.title)}"
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
  const email = agent?.email || state.settings?.email || CONFIG.fallbackEmail;
  const phone = agent?.phone?.replace(/\D/g, '');
  const propertyUrl = new URL(location.href);
  propertyUrl.search = '';
  propertyUrl.hash = `imovel-${property._id}`;

  const message = `Olá, tenho interesse em "${property.title}".\n\n${propertyUrl.href}`;
  const subject = `Interesse: ${property.title}`;
  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : '';
  const emailUrl =
    'https://mail.google.com/mail/?view=cm&fs=1' +
    `&to=${encodeURIComponent(email)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(message)}`;
  const status = STATUS_LABELS[property.status] || '';

  const rows = [
    property.reference && ['Referência', property.reference],
    property.location && ['Localização', property.location],
    property.typology && ['Tipologia', property.typology],
    property.area && ['Área', `${property.area} m²`],
    property.bedrooms && ['Quartos', property.bedrooms],
    property.bathrooms && ['Casas de banho', property.bathrooms],
    property.energyRating && ['Certificado energético', property.energyRating],
    status && ['Estado', status],
  ].filter(Boolean);

  return `
    ${galleryMarkup(property)}
    <div class="modal-content">
      <p class="eyebrow"><span class="dot"></span>${typeLabel(property)}${property.featured ? ' · Destaque' : ''}</p>
      <h2 id="modal-title">${escapeHtml(property.title)}</h2>
      <p class="modal-price">
        ${property.listingType === 'procura' && !property.priceOnRequest ? 'Orçamento até ' : ''}${escapeHtml(priceLabel(property))}
      </p>

      ${rows.length
        ? `<dl class="spec-grid">${rows
            .map(([label, value]) => `<div class="spec"><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`)
            .join('')}</dl>`
        : ''}

      ${property.description ? `<p class="modal-desc">${escapeHtml(property.description)}</p>` : ''}

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
          <strong>${escapeHtml(agent?.name || 'Equipa Edizur')}</strong>
          <span>${escapeHtml(agent?.role || 'Consultor Imobiliário')}</span>
        </span>
        <span class="modal-actions">
          ${whatsappUrl
            ? `<a class="btn btn-gold" href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener">${icon('message')}Enviar mensagem</a>`
            : ''}
          <a class="btn btn-ghost" href="${escapeHtml(emailUrl)}" target="_blank" rel="noopener">${icon('mail')}Enviar e-mail</a>
        </span>
      </div>
    </div>`;
}

function showSlide(index) {
  const gallery = $('#gallery');
  if (!gallery) return;

  const slides = $$('[data-slide]', gallery);
  const next = (index + slides.length) % slides.length;
  state.gallery = next;

  slides.forEach((slide, i) => { slide.hidden = i !== next; });
  $$('[data-goto]', gallery).forEach((dot, i) => dot.classList.toggle('is-active', i === next));
}

function openProperty(id, { updateHash = true } = {}) {
  const property = state.properties.find((item) => item._id === id);
  if (!property) return;

  $('#modal-body').innerHTML = detailMarkup(property);
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
  state.gallery = 0;
  $('.modal-close').focus();

  if (updateHash) history.replaceState(null, '', `#imovel-${id}`);
}

function closeModal() {
  $('#modal').hidden = true;
  $('#modal-body').innerHTML = '';
  document.body.style.overflow = '';
  state.gallery = null;
  if (location.hash.startsWith('#imovel-')) history.replaceState(null, '', location.pathname);
}

/* ---------- events ---------- */

function bindEvents() {
  $('#nav-toggle').addEventListener('click', (event) => {
    const nav = $('#nav');
    const open = nav.classList.toggle('is-open');
    event.currentTarget.setAttribute('aria-expanded', String(open));
  });

  $('#nav').addEventListener('click', (event) => {
    if (event.target.tagName === 'A') $('#nav').classList.remove('is-open');
  });

  $('#filters').addEventListener('click', (event) => {
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

  $('#grid').addEventListener('click', (event) => {
    const step = event.target.closest('[data-card-step]');
    if (step) {
      stepCardGallery(step.closest('.card'), Number(step.dataset.cardStep));
      return;
    }

    if (!event.target.closest('[data-open-property]')) return;
    const card = event.target.closest('.card[data-id]');
    if (card) openProperty(card.dataset.id);
  });

  $('#modal').addEventListener('click', (event) => {
    if (event.target.closest('[data-close]')) return closeModal();

    const step = event.target.closest('[data-step]');
    if (step) return showSlide(state.gallery + Number(step.dataset.step));

    const goto = event.target.closest('[data-goto]');
    if (goto) showSlide(Number(goto.dataset.goto));
  });

  document.addEventListener('keydown', (event) => {
    if ($('#modal').hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowLeft') showSlide(state.gallery - 1);
    if (event.key === 'ArrowRight') showSlide(state.gallery + 1);
  });
}

/* ---------- boot ---------- */

async function init() {
  const year = new Date().getFullYear();
  $('#year').textContent =
    year > CONFIG.foundedYear ? `${CONFIG.foundedYear}–${year}` : String(CONFIG.foundedYear);
  bindEvents();

  try {
    const { settings, agents, properties } = await loadContent();
    state.settings = settings || null;
    state.agents = agents || [];
    state.properties = properties || [];

    applySettings(state.settings);
    renderTeam();
    renderProperties();

    const match = location.hash.match(/^#imovel-(.+)$/);
    if (match) openProperty(match[1], { updateHash: false });
  } catch (error) {
    console.error('[edizur] falha ao carregar conteúdo', error);
    $('#grid').innerHTML = '';
    $('#grid').removeAttribute('aria-busy');
    const empty = $('#empty');
    empty.textContent = 'Não foi possível carregar os imóveis. Por favor tente novamente mais tarde.';
    empty.hidden = false;
  }
}

init();
