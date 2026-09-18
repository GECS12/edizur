import {defineArrayMember, defineField, defineType} from 'sanity'
import {ProjectsIcon} from '@sanity/icons/Projects'

export const project = defineType({
  name: 'project',
  title: 'Projeto',
  type: 'document',
  icon: ProjectsIcon,
  groups: [
    {name: 'principal', title: 'Principal', default: true},
    {name: 'fotos', title: 'Fotografias'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'principal',
      validation: (rule) => rule.required().min(3).max(110),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      description: 'Frase curta sob o título. Ex.: 5 moradias de design contemporâneo',
      type: 'string',
      group: 'principal',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'location',
      title: 'Localização',
      description: 'Ex.: Esmoriz · Rua Miguel Bombarda, Porto',
      type: 'string',
      group: 'principal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Resumo',
      description: 'Texto curto para o cartão no site.',
      type: 'text',
      rows: 3,
      group: 'principal',
      validation: (rule) => rule.max(320),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      description: 'Texto completo do projeto. Use parágrafos — são respeitados no site.',
      type: 'text',
      rows: 12,
      group: 'principal',
      validation: (rule) => rule.max(6000),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Ordem no site',
      description: 'Número menor aparece primeiro (1, 2, 3…).',
      type: 'number',
      group: 'principal',
      initialValue: 1,
      validation: (rule) => rule.min(0).max(999),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de publicação',
      type: 'datetime',
      group: 'principal',
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
      title: 'Ordem no site',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
      media: 'images.0',
    },
    prepare({title, location, media}) {
      return {
        title,
        subtitle: location,
        media,
      }
    },
  },
})
