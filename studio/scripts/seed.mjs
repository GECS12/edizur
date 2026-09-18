/**
 * Seeds the Edizur dataset with the two consultants, site settings and a few
 * example properties, so the site has something to show from day one.
 *
 * Safe to re-run: documents are matched by name/title and skipped if present.
 * Authentication reuses the local Sanity CLI session (`sanity login`).
 *
 *   node scripts/seed.mjs
 */
import {createClient} from '@sanity/client'
import {readFile} from 'node:fs/promises'
import {homedir} from 'node:os'
import {join} from 'node:path'

const PROJECT_ID = 'a5nclqso'
const DATASET = 'production'

async function cliToken() {
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN
  const configPath = join(homedir(), '.config', 'sanity', 'config.json')
  const {authToken} = JSON.parse(await readFile(configPath, 'utf8'))
  if (!authToken) throw new Error('No Sanity credentials found. Run: npx sanity login')
  return authToken
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-09-18',
  token: await cliToken(),
  useCdn: false,
})

async function uploadFromUrl(url, filename) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} ao descarregar ${filename}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, {filename})
  return asset._id
}

const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`

const imageField = (assetId, alt) => ({
  _type: 'image',
  asset: {_type: 'reference', _ref: assetId},
  alt,
})

const imageMember = (assetId, alt, key) => ({...imageField(assetId, alt), _key: key})

async function findByField(type, field, value) {
  return client.fetch(`*[_type == $type && ${field} == $value][0]._id`, {type, value})
}

/* ---------- consultants ---------- */

const AGENTS = [
  {
    name: 'Ricardo Ferreira',
    role: 'Consultor Imobiliário',
    phone: '+351 910 910 466',
    email: 'ricardo@edizur.pt',
    sortOrder: 1,
  },
  {
    name: 'Fernando Leite',
    role: 'Consultor Imobiliário',
    phone: '+351 936 096 204',
    email: 'fernando@edizur.pt',
    sortOrder: 2,
  },
]

const agentIds = {}

for (const agent of AGENTS) {
  const existing = await findByField('agent', 'name', agent.name)
  if (existing) {
    agentIds[agent.name] = existing
    console.log(`= consultor já existe: ${agent.name}`)
    continue
  }
  const created = await client.create({_type: 'agent', ...agent})
  agentIds[agent.name] = created._id
  console.log(`+ consultor criado: ${agent.name}`)
}

/* ---------- site settings ---------- */

const settingsExists = await client.fetch(`defined(*[_id == "siteSettings"][0]._id)`)

if (settingsExists) {
  console.log('= definições do site já existem')
} else {
  const heroAsset = await uploadFromUrl(
    unsplash('photo-1555881400-74d7acaacd8b'),
    'edizur-porto.jpg',
  )
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    heroTitle: 'Compramos e Vendemos Imóveis.',
    heroSubtitle: 'Do primeiro contacto até à escritura, estamos ao seu lado.',
    heroImage: imageField(heroAsset, 'Edifícios no Porto'),
    sellText:
      'Valorizamos o seu imóvel, divulgamo-lo com eficácia e acompanhamos todo o processo até à escritura.',
    buyText:
      'Diga-nos o que procura. Ajudamo-lo a encontrar o imóvel certo e acompanhamos o processo de compra.',
    region: 'Porto e região',
    email: 'geral@edizur.pt',
    footerTagline: 'O seu imóvel, o nosso compromisso.',
  })
  console.log('+ definições do site criadas')
}

/* ---------- example properties ---------- */

const PROPERTIES = [
  {
    title: 'Apartamento T3 com vista de rio, na Foz do Douro',
    listingType: 'venda',
    status: 'disponivel',
    location: 'Foz do Douro, Porto',
    price: 580000,
    typology: 'T3',
    area: 142,
    bedrooms: 3,
    bathrooms: 2,
    energyRating: 'B',
    featured: true,
    reference: 'EDZ-001',
    agentName: 'Ricardo Ferreira',
    features: ['Garagem', 'Elevador', 'Varanda', 'Vista de rio', 'Cozinha equipada', 'Suite'],
    description:
      'Apartamento T3 num edifício de 2018, a dois minutos da marginal da Foz. Sala ampla com varanda voltada a poente e vista desimpedida sobre o rio.\n\nTrês quartos, um deles em suite, cozinha totalmente equipada e dois lugares de garagem em box fechada. Pronto a habitar.',
    images: [
      ['photo-1600596542815-ffad4c1539a9', 'Sala de estar com luz natural'],
      ['photo-1600607687939-ce8a6c25118c', 'Cozinha equipada'],
      ['photo-1600566753086-00f18fb6b3ea', 'Quarto principal em suite'],
    ],
  },
  {
    title: 'Moradia T4+1 com jardim e piscina em Nevogilde',
    listingType: 'venda',
    status: 'disponivel',
    location: 'Nevogilde, Porto',
    price: 920000,
    typology: 'T4',
    area: 280,
    bedrooms: 5,
    bathrooms: 4,
    energyRating: 'A',
    featured: true,
    reference: 'EDZ-002',
    agentName: 'Fernando Leite',
    features: ['Garagem', 'Jardim', 'Piscina', 'Aquecimento central', 'Lareira', 'Painéis solares'],
    description:
      'Moradia isolada de arquitetura contemporânea, implantada em lote de 620 m² numa das zonas mais procuradas do Porto.\n\nPiso térreo com sala em dois ambientes, cozinha em open space e suite de apoio. No piso superior, três suites com varanda. Jardim com piscina aquecida e zona de refeições exterior.',
    images: [
      ['photo-1600585154340-be6161a56a0c', 'Fachada da moradia'],
      ['photo-1600566753190-17f0baa2a6c3', 'Sala em open space'],
      ['photo-1600607687920-4e2a09cf159d', 'Jardim com piscina'],
    ],
  },
  {
    title: 'Apartamento T2 remodelado junto à Boavista',
    listingType: 'venda',
    status: 'reservado',
    location: 'Boavista, Porto',
    price: 335000,
    typology: 'T2',
    area: 88,
    bedrooms: 2,
    bathrooms: 1,
    energyRating: 'C',
    reference: 'EDZ-003',
    agentName: 'Ricardo Ferreira',
    features: ['Elevador', 'Remodelado', 'Cozinha equipada', 'Ar condicionado'],
    description:
      'T2 totalmente remodelado em 2024, a cinco minutos a pé da Rotunda da Boavista. Excelente opção para investimento ou primeira habitação.',
    images: [
      ['photo-1502672260266-1c1ef2d93688', 'Sala remodelada'],
      ['photo-1484154218962-a197022b5858', 'Cozinha do apartamento'],
    ],
  },
  {
    title: 'Procuramos T3 em Matosinhos para cliente com financiamento aprovado',
    listingType: 'procura',
    status: 'disponivel',
    location: 'Matosinhos',
    price: 320000,
    typology: 'T3',
    area: 100,
    bedrooms: 3,
    reference: 'EDZ-P01',
    agentName: 'Fernando Leite',
    features: ['Elevador', 'Garagem'],
    description:
      'Cliente nosso, com crédito já aprovado, procura apartamento T3 em Matosinhos ou Leça da Palmeira, com pelo menos 100 m² e lugar de garagem.\n\nAceita imóvel para pequenas obras. Disponibilidade imediata para visitar. Se tem um imóvel com este perfil, fale connosco.',
    images: [['photo-1512917774080-9991f1c4c750', 'Zona residencial de Matosinhos']],
  },
]

for (const {images, agentName, ...property} of PROPERTIES) {
  const existing = await findByField('property', 'title', property.title)
  if (existing) {
    console.log(`= imóvel já existe: ${property.title}`)
    continue
  }

  const uploaded = []
  for (const [photoId, alt] of images) {
    try {
      const assetId = await uploadFromUrl(unsplash(photoId), `${property.reference}-${photoId}.jpg`)
      uploaded.push(imageMember(assetId, alt, photoId.slice(-10)))
    } catch (error) {
      console.warn(`  ! falha na imagem ${photoId}: ${error.message}`)
    }
  }

  await client.create({
    _type: 'property',
    ...property,
    publishedAt: new Date().toISOString(),
    agent: {_type: 'reference', _ref: agentIds[agentName]},
    images: uploaded,
  })
  console.log(`+ imóvel criado: ${property.title} (${uploaded.length} fotos)`)
}

console.log('\nConcluído.')
