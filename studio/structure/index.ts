import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {SearchIcon} from '@sanity/icons/Search'
import {StarIcon} from '@sanity/icons/Star'
import {UserIcon} from '@sanity/icons/User'

export const SINGLETONS = ['siteSettings']

const propertyList = (
  S: Parameters<StructureResolver>[0],
  title: string,
  filter: string,
  params: Record<string, unknown> = {},
) =>
  S.documentTypeList('property')
    .title(title)
    .filter(`_type == "property" && ${filter}`)
    .params(params)
    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Edizur')
    .items([
      S.listItem()
        .title('Imóveis para venda')
        .icon(HomeIcon)
        .child(propertyList(S, 'Imóveis para venda', 'listingType == "venda"')),

      S.listItem()
        .title('Procuras de clientes')
        .icon(SearchIcon)
        .child(propertyList(S, 'Procuras de clientes', 'listingType == "procura"')),

      S.listItem()
        .title('Em destaque')
        .icon(StarIcon)
        .child(propertyList(S, 'Em destaque', 'featured == true')),

      S.divider(),

      S.listItem()
        .title('Todos os imóveis')
        .icon(HomeIcon)
        .child(S.documentTypeList('property').title('Todos os imóveis')),

      S.listItem()
        .title('Consultores')
        .icon(UserIcon)
        .child(S.documentTypeList('agent').title('Consultores')),

      S.divider(),

      S.listItem()
        .title('Definições do Site')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Definições do Site'),
        ),
    ])
