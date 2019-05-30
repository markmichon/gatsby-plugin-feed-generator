import path from 'path'
import RSS from 'rss'
const buildJsonFeed = ({ site, items, name = 'feed.json' }) => {
  const { siteUrl, description, title, author } = site.siteMetadata
  const feedURL = path.join(site.siteMetadata.siteUrl, name)
  return {
    version: 'https://jsonfeed.org/version/1',
    title: title,
    description: description,
    home_page_url: siteUrl,
    feed_url: feedURL,
    user_comment: `This feed allows you to read the posts from this site in any feed reader that supports the JSON Feed format. To add this feed to your reader, copy the following URL — ${feedURL} — and add it your reader.`,
    favicon: path.join(siteUrl, 'icon.png'),
    author: {
      name: author,
    },
    items: buildJsonItems(items),
  }
}

const buildRSSFeed = ({ site, items, name = 'feed.rss' }) => {
  const { siteUrl, description, title, author } = site.siteMetadata
  const rss = new RSS({
    title: title,
    description: description,
    feed_url: path.join(siteUrl, 'feed.rss'),
    site_url: siteUrl,
    image_url: path.join(siteUrl, 'icon.png'),
  })
  const feedItems = buildRSSItems(items, site)
  feedItems.forEach(i => {
    rss.item(i)
  })

  return rss.xml()
}

const buildJsonItems = items =>
  items.map(({ title, url, date, html }) => ({
    url,
    title,
    id: url,
    date_published: new Date(date).toISOString(),
    date_modified: new Date(date).toISOString(),
    content_html: html,
  }))

const buildRSSItems = (items = [], site = {}) =>
  items.map(({ title, url, date, html }) => ({
    title,
    url,
    guid: url,
    description: html,
    author: site.siteMetadata.author,
    date: new Date(date).toISOString(),
  }))

export { buildJsonFeed, buildRSSFeed }
