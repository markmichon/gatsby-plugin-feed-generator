import { Feed } from 'feed'
import urlJoin from 'url-join'

const buildFeed = ({ site, items, name, options = {} }) => {
  const { siteUrl, description, title, author } = site.siteMetadata
  const feed = new Feed({
    title: title,
    description: description,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${author}`,
    id: siteUrl,
    link: siteUrl,
    // image: urlJoin(siteUrl, 'image.png'),
    favicon: urlJoin(siteUrl, 'favicon.ico'),
    generator: 'GatsbyJS',
    feedLinks: {
      json: urlJoin(siteUrl, name).replace(/\/+$/, '') + '.json',
      rss: urlJoin(siteUrl, name).replace(/\/+$/, '') + '.xml',
    },
    author: {
      name: author,
    },
    ...options,
  })

  for (let item of items) {
    const { title, url, date, html, excerpt = '', ...rest } = item
    const d = typeof date === 'object' ? date : new Date(date)
    feed.addItem({
      title,
      link: url,
      description: excerpt,
      content: html,
      id: url,
      date: d,
      ...rest,
    })
  }
  return feed
}

export { buildFeed }
