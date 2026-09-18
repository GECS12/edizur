import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const agent = defineType({
  name: 'agent',
  title: 'Consultor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Função',
      type: 'string',
      initialValue: 'Consultor Imobiliário',
    }),
    defineField({
      name: 'phone',
      title: 'Telefone',
      description: 'Ex.: +351 910 910 466',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'photo',
      title: 'Fotografia',
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
    defineField({
      name: 'sortOrder',
      title: 'Ordem na página',
      description: 'Número menor aparece primeiro (1, 2, 3…).',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'phone', media: 'photo'},
  },
})
