# Edizur — site institucional + gestão de imóveis

Site estático (landing page + catálogo de imóveis) alimentado por um CMS onde os
dois consultores inserem, editam e apagam imóveis com fotografias, sem tocar em código.

| Peça | Tecnologia | Onde vive |
| --- | --- | --- |
| Site público | HTML + CSS + JavaScript puro, sem build | `site/` → Netlify |
| Gestão de conteúdo | Sanity Studio (React) | `studio/` → https://edizur.sanity.studio |
| Base de dados + imagens | Sanity Content Lake + CDN de imagens | serviço alojado |

- **Project ID do Sanity:** `a5nclqso`
- **Dataset:** `production` (público — leitura sem autenticação)
- **Studio:** https://edizur.sanity.studio

## Como funciona

O `site/index.html` é servido como ficheiros estáticos. Em tempo de execução, o
`app.js` faz **um único pedido** GROQ à CDN do Sanity e desenha os imóveis, a equipa
e os textos da página inicial.

Consequência prática: quando um consultor publica um imóvel no Studio, o site mostra-o
ao recarregar a página — **não é preciso fazer deploy nem mexer em código**.

## Estrutura

```
edizur/
├── site/                  # o que vai para a Netlify
│   ├── index.html         # marcação e conteúdos estáticos (SEO)
│   ├── styles.css         # design (cores/tipografia da identidade Edizur)
│   ├── app.js             # consulta ao Sanity, filtros, galeria, modal
│   ├── hero.jpg           # imagem de reserva, caso as Definições não tenham imagem
│   └── favicon.svg
├── studio/                # Sanity Studio (o "painel de gestão")
│   ├── schemaTypes/       # modelo de conteúdo (Imóvel, Consultor, Definições)
│   ├── structure/         # organização do menu lateral do Studio
│   ├── scripts/seed.mjs   # conteúdo de exemplo (já executado)
│   ├── sanity.config.ts
│   └── sanity.cli.ts
└── netlify.toml           # publica a pasta site/, sem build
```

## Desenvolvimento local

**Site público** (qualquer servidor estático serve):

```bash
cd site
python3 -m http.server 4173
# abrir http://localhost:4173
```

O domínio tem de estar autorizado em CORS no Sanity, senão o pedido é bloqueado
pelo browser. Já estão autorizados: `http://localhost:4173`, `http://127.0.0.1:4173`,
`http://localhost:8080` e `https://*.netlify.app`. O endereço na barra do browser
tem de corresponder exatamente a um destes — abrir o `index.html` com duplo clique
(`file://`) nunca funciona.

**Studio:**

```bash
cd studio
npm install     # só na primeira vez
npm run dev     # http://localhost:3333
```

## Publicar

### Site → Netlify

Opção A, sem git (mais rápida): arrastar a pasta `site/` para
[app.netlify.com/drop](https://app.netlify.com/drop).

Opção B, com git (recomendada): iniciar um repositório (`git init`), publicá-lo no
GitHub e ligá-lo à Netlify — cada `git push` passa a atualizar o site. O
`netlify.toml` já define `publish = "site"` e comando de build vazio.

Depois do primeiro deploy, **autorizar o domínio final** no Sanity:

```bash
cd studio
npx sanity cors add https://edizur.pt          # sem credenciais
npx sanity cors add https://www.edizur.pt
```

(`https://*.netlify.app` já está autorizado, portanto o URL provisório da Netlify
funciona de imediato.)

### Studio → Sanity hosting

```bash
cd studio
npx sanity deploy
```

Volta a publicar em https://edizur.sanity.studio. Só é necessário quando o **modelo
de conteúdo** muda (campos novos), não quando se adicionam imóveis.

Se alterar ficheiros em `studio/schemaTypes/`, correr também:

```bash
npx sanity schemas deploy
```

## Dar acesso aos dois consultores

O plano gratuito do Sanity inclui 20 lugares, mas só os papéis **Administrator** e
**Viewer**. Os consultores têm portanto de entrar como administradores — o que
significa que também conseguem convidar pessoas e alterar definições do projeto.
Para uma equipa de duas pessoas de confiança isto é aceitável; se quiser restringir
permissões (papel *Editor*), é o plano Growth, 15 $/mês por lugar.

```bash
cd studio
npx sanity users invite ricardo@exemplo.pt --role administrator
npx sanity users invite fernando@exemplo.pt --role administrator
```

Alternativa por interface: [sanity.io/manage](https://www.sanity.io/manage) →
projeto Edizur → *Members* → *Invite members*.

Cada um recebe um convite por e-mail, escolhe como entrar (Google ou e-mail +
password) e a partir daí usa apenas https://edizur.sanity.studio. Entrega-lhes o
[GUIA-AGENTES.md](./GUIA-AGENTES.md), escrito para quem nunca usou um CMS.

## Modelo de conteúdo

**Imóvel** — título, tipo de anúncio (`venda` ou `procura`), estado
(disponível/reservado/vendido), localização, preço, preço sob consulta, consultor
responsável, destaque, descrição, tipologia, área, quartos, casas de banho,
certificado energético, características, referência interna, data de publicação e
galeria de fotografias (a primeira é a capa, arrastáveis para reordenar).

**Consultor** — nome, função, telefone, e-mail, fotografia, ordem na página.

**Definições do Site** — documento único com título e subtítulo da página inicial,
imagem principal, textos dos serviços Vender/Comprar, zona de atuação, e-mail e
telefone gerais, morada, Instagram, Facebook e frase do rodapé.

A distinção `venda` / `procura` é o que alimenta os filtros *Para venda* e
*Procuras* no site: "procura" serve para publicar o que um cliente comprador anda
a procurar.

## Antes de ir para o ar

- [ ] Apagar os 4 imóveis de exemplo no Studio (as fotografias são do Unsplash).
- [ ] Substituir a imagem principal em *Definições do Site* por uma fotografia real.
- [ ] Carregar as fotografias do Ricardo e do Fernando em *Consultores* (sem
      fotografia, o site mostra as iniciais num círculo).
- [ ] Confirmar os contactos e o e-mail geral.
- [ ] Ligar o domínio `edizur.pt` na Netlify e autorizá-lo em CORS.

## Custos

| Serviço | Plano | Custo |
| --- | --- | --- |
| Netlify | Free | 0 € — 100 GB de tráfego/mês |
| Sanity | Free | 0 € — 20 lugares, 10 000 documentos, 100 GB de imagens |
| Domínio | registo próprio | ~10-15 €/ano |

Para uma imobiliária local com dezenas ou centenas de imóveis, os limites gratuitos
não são um problema.

## Notas técnicas

- O site não tem passo de compilação — é HTML/CSS/JS legível. Editar `styles.css`
  chega para mudar o aspeto.
- As imagens são pedidas à CDN do Sanity já redimensionadas (`?w=760&h=570&fit=crop`)
  e em WebP/AVIF quando o browser suporta (`auto=format`), respeitando o ponto focal
  definido no Studio.
- Rascunhos não aparecem no site: a consulta exclui `drafts.**`. Só documentos
  publicados são visíveis.
- Cada imóvel tem um link partilhável: `…/#imovel-<id>` abre a ficha diretamente.
- O catálogo é desenhado no browser. Se um dia o SEO das fichas individuais passar a
  ser prioritário, o passo seguinte natural é gerar páginas estáticas com Astro +
  webhook da Netlify (o modelo de conteúdo não precisa de mudar).
