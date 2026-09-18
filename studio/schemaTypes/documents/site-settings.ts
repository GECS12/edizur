import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Definições do Site',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'destaque', title: 'Página inicial', default: true},
    {name: 'contactos', title: 'Contactos'},
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Título principal',
      type: 'string',
      group: 'destaque',
      initialValue: 'Compramos e Vendemos Imóveis.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtítulo',
      type: 'text',
      rows: 2,
      group: 'destaque',
      initialValue: 'Do primeiro contacto até à escritura, estamos ao seu lado.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagem principal',
      description: 'Fotografia grande da página inicial. Formato vertical funciona melhor.',
      type: 'image',
      group: 'destaque',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Descrição da imagem', type: 'string'}),
      ],
    }),
    defineField({
      name: 'sellText',
      title: 'Texto do serviço "Vender"',
      type: 'text',
      rows: 3,
      group: 'destaque',
      initialValue:
        'Valorizamos o seu imóvel, divulgamo-lo com eficácia e acompanhamos todo o processo até à escritura.',
    }),
    defineField({
      name: 'buyText',
      title: 'Texto do serviço "Comprar"',
      type: 'text',
      rows: 3,
      group: 'destaque',
      initialValue:
        'Diga-nos o que procura. Ajudamo-lo a encontrar o imóvel certo e acompanhamos o processo de compra.',
    }),
    defineField({
      name: 'region',
      title: 'Zona de atuação',
      type: 'string',
      group: 'contactos',
      initialValue: 'Porto e região',
    }),
    defineField({
      name: 'email',
      title: 'E-mail geral',
      type: 'string',
      group: 'contactos',
      initialValue: 'edizur.imobiliaria@gmail.com',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Telefone geral',
      type: 'string',
      group: 'contactos',
    }),
    defineField({
      name: 'address',
      title: 'Morada',
      description: 'Rua e número numa linha, código postal e cidade na linha seguinte.',
      type: 'text',
      rows: 2,
      group: 'contactos',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      description: 'Endereço completo da página, começado por https://',
      type: 'url',
      group: 'contactos',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook',
      description: 'Endereço completo da página, começado por https://',
      type: 'url',
      group: 'contactos',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Frase do rodapé',
      type: 'string',
      group: 'contactos',
      initialValue: 'O seu imóvel, o nosso compromisso.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Definições do Site'}),
  },
})
