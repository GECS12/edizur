import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

const LISTING_TYPES = [
  {title: 'Imóvel para venda', value: 'venda'},
  {title: 'Procura de cliente (queremos comprar)', value: 'procura'},
]

const STATUSES = [
  {title: 'Disponível', value: 'disponivel'},
  {title: 'Reservado', value: 'reservado'},
  {title: 'Vendido', value: 'vendido'},
]

const TYPOLOGIES = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6 ou superior', 'Terreno', 'Loja', 'Armazém', 'Outro']

const ENERGY_RATINGS = ['A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F', 'Isento', 'Em processo']

const FEATURES = [
  'Garagem',
  'Estacionamento',
  'Box',
  'Elevador',
  'Varanda',
  'Terraço',
  'Jardim',
  'Piscina',
  'Vista de mar',
  'Vista de rio',
  'Ar condicionado',
  'Aquecimento central',
  'Lareira',
  'Cozinha equipada',
  'Suite',
  'Arrecadação',
  'Painéis solares',
  'Para remodelar',
  'Remodelado',
  'Novo',
  'Mobiliado',
  'WCs partilhados',
]

export const property = defineType({
  name: 'property',
  title: 'Imóvel',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'principal', title: 'Principal', default: true},
    {name: 'detalhes', title: 'Detalhes'},
    {name: 'fotos', title: 'Fotografias'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      description: 'Ex.: Apartamento T3 com vista de rio, na Foz',
      type: 'string',
      group: 'principal',
      validation: (rule) => rule.required().min(8).max(110),
    }),
    defineField({
      name: 'listingType',
      title: 'Tipo de anúncio',
      description: 'Venda: imóvel que temos para vender. Procura: cliente à procura deste tipo de imóvel.',
      type: 'string',
      group: 'principal',
      initialValue: 'venda',
      options: {list: LISTING_TYPES, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      group: 'principal',
      initialValue: 'disponivel',
      options: {list: STATUSES, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Localização',
      description: 'Ex.: Foz do Douro, Porto',
      type: 'string',
      group: 'principal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mapLocation',
      title: 'Posição no mapa',
      description:
        'Latitude e longitude usadas na vista de mapa do site. Imóveis sem esta posição aparecem apenas na lista.',
      type: 'geopoint',
      group: 'principal',
    }),
    defineField({
      name: 'price',
      title: 'Preço (€)',
      description: 'Apenas números. Nas procuras, indique o orçamento máximo do cliente.',
      type: 'number',
      group: 'principal',
      validation: (rule) => rule.min(0).max(100_000_000),
    }),
    defineField({
      name: 'priceOnRequest',
      title: 'Mostrar "Sob consulta" em vez do preço',
      type: 'boolean',
      group: 'principal',
      initialValue: false,
    }),
    defineField({
      name: 'agent',
      title: 'Consultor responsável',
      type: 'reference',
      group: 'principal',
      to: [{type: 'agent'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Destacar (aparece primeiro no site)',
      type: 'boolean',
      group: 'principal',
      initialValue: false,
    }),

    defineField({
      name: 'description',
      title: 'Descrição',
      description: 'Texto livre. Pode usar parágrafos — são respeitados no site.',
      type: 'text',
      rows: 6,
      group: 'detalhes',
      validation: (rule) => rule.max(2000),
    }),
    defineField({
      name: 'typology',
      title: 'Tipologia',
      type: 'string',
      group: 'detalhes',
      options: {list: TYPOLOGIES},
    }),
    defineField({
      name: 'areaUtil',
      title: 'Área útil (m²)',
      description: 'Área habitável / privativa útil.',
      type: 'number',
      group: 'detalhes',
      validation: (rule) => rule.min(0).max(100_000),
    }),
    defineField({
      name: 'areaBruta',
      title: 'Área bruta (m²)',
      description: 'Área bruta de construção ou área bruta privativa, conforme o caso.',
      type: 'number',
      group: 'detalhes',
      validation: (rule) => rule.min(0).max(100_000),
    }),
    defineField({
      name: 'areaTerreno',
      title: 'Área do terreno (m²)',
      description: 'Preencher em moradias, terrenos ou quando houver lote.',
      type: 'number',
      group: 'detalhes',
      validation: (rule) => rule.min(0).max(1_000_000),
    }),
    defineField({
      name: 'areaGaragem',
      title: 'Área da garagem (m²)',
      description: 'Preencher apenas se existir garagem ou box mensurável.',
      type: 'number',
      group: 'detalhes',
      validation: (rule) => rule.min(0).max(10_000),
    }),
    defineField({
      name: 'area',
      title: 'Área (legado)',
      description: 'Campo antigo. Preferir Área útil. Mantido só para anúncios já publicados.',
      type: 'number',
      group: 'detalhes',
      hidden: ({document}) =>
        typeof document?.areaUtil === 'number' || typeof document?.areaBruta === 'number',
      validation: (rule) => rule.min(0).max(100_000),
    }),
    defineField({
      name: 'bedrooms',
      title: 'Quartos',
      type: 'number',
      group: 'detalhes',
      validation: (rule) => rule.min(0).max(50),
    }),
    defineField({
      name: 'suites',
      title: 'Suites',
      type: 'number',
      group: 'detalhes',
      validation: (rule) => rule.min(0).max(20),
    }),
    defineField({
      name: 'bathrooms',
      title: 'Casas de banho',
      type: 'number',
      group: 'detalhes',
      validation: (rule) => rule.min(0).max(50),
    }),
    defineField({
      name: 'parkingSpaces',
      title: 'Lugares de estacionamento',
      description: 'Número de lugares (garagem, box ou exterior).',
      type: 'number',
      group: 'detalhes',
      validation: (rule) => rule.min(0).max(50),
    }),
    defineField({
      name: 'floor',
      title: 'Piso',
      description: 'Ex.: R/C, 1º, 3º com elevador',
      type: 'string',
      group: 'detalhes',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'yearBuilt',
      title: 'Ano de construção',
      type: 'number',
      group: 'detalhes',
      validation: (rule) => rule.min(1800).max(2100).integer(),
    }),
    defineField({
      name: 'condoFee',
      title: 'Condomínio (€ / mês)',
      description: 'Valor aproximado do condomínio mensal, se aplicável.',
      type: 'number',
      group: 'detalhes',
      validation: (rule) => rule.min(0).max(50_000),
    }),
    defineField({
      name: 'energyRating',
      title: 'Certificado energético',
      type: 'string',
      group: 'detalhes',
      options: {list: ENERGY_RATINGS},
    }),
    defineField({
      name: 'features',
      title: 'Características',
      type: 'array',
      group: 'detalhes',
      of: [defineArrayMember({type: 'string'})],
      options: {list: FEATURES},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'reference',
      title: 'Referência interna',
      description: 'Código opcional para uso interno. Ex.: EDZ-014',
      type: 'string',
      group: 'detalhes',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de publicação',
      description: 'Define a ordem no site: as mais recentes aparecem primeiro.',
      type: 'datetime',
      group: 'detalhes',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'images',
      title: 'Fotografias',
      description: 'A primeira fotografia é a capa. Arraste para reordenar.',
      type: 'array',
      group: 'fotos',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Descrição da imagem',
              description: 'Breve descrição do que se vê (ajuda no Google e na acessibilidade).',
              type: 'string',
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(24),
    }),
  ],

  orderings: [
    {
      title: 'Mais recentes',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Preço (mais alto)',
      name: 'priceDesc',
      by: [{field: 'price', direction: 'desc'}],
    },
    {
      title: 'Preço (mais baixo)',
      name: 'priceAsc',
      by: [{field: 'price', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      location: 'location',
      price: 'price',
      priceOnRequest: 'priceOnRequest',
      status: 'status',
      listingType: 'listingType',
      media: 'images.0',
    },
    prepare({title, location, price, priceOnRequest, status, listingType, media}) {
      const money = priceOnRequest || typeof price !== 'number'
        ? 'Sob consulta'
        : new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
          }).format(price)

      const badges = [
        listingType === 'procura' ? 'Procura' : 'Venda',
        STATUSES.find((item) => item.value === status)?.title,
      ].filter(Boolean)

      return {
        title,
        subtitle: [location, money, badges.join(' · ')].filter(Boolean).join(' — '),
        media,
      }
    },
  },
})
