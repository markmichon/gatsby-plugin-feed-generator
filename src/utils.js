import path from 'path'
import { Feed } from 'feed'

const buildFeed = ({ site, items, name, options = {} }) => {
  const { siteUrl, description, title, author } = site.siteMetadata
  const feed = new Feed({
    title: title,
    description: description,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${author}`,
    id: siteUrl,
    link: siteUrl,
    image: path.join(siteUrl, 'image.png'),
    favicon: path.join(siteUrl, 'favicon.ico'),
    generator: 'GatsbyJS',
    feedLinks: {
      json: path.join(siteUrl, name, '.json'),
      rss: path.join(siteUrl, name, '.xml'),
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
