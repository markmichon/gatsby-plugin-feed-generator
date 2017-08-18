import path from "path"
import RSS from "rss"
import { defaultOptions, runQuery, writeFile } from "./internals"

const publicPath = "./public"

const buildFeed = () => {}

exports.onPostBuild = async ({ graphql }, pluginOptions) => {
  const siteQuery = await runQuery(graphql, defaultOptions.siteQuery)

  const { site: { siteMetadata: { title, description, siteUrl } } } = siteQuery

  const feedQuery = await runQuery(graphql, defaultOptions.feedQuery)

  const { allMarkdownRemark: { edges: data } } = feedQuery
  const items = data.map(i => {
    const { node: { html, frontmatter: { date, path, title } } } = i

    return {
      id: siteUrl + "" + path,
      url: siteUrl + "" + path,
      title: title,
      date_published: new Date(date).toISOString(),
      content_html: html
    }
  })

  const jsonFeed = {
    version: "https://jsonfeed.org/version/1",
    title: title,
    description: description,
    home_page_url: siteUrl,
    feed_url: "https://markmichon.com/feed.json",
    user_comment:
      "This feed allows you to read the posts from this site in any feed reader that supports the JSON Feed format. To add this feed to your reader, copy the following URL — https://markmichon.com/feed.json — and add it your reader.",
    favicon: "https://markmichon.com/icon.png",
    author: {
      name: "Mark Michon"
    },
    items: items
  }

  const rssFeed = new RSS({
    title: title,
    description: description,
    feed_url: "https://markmichon.com/feed.rss",
    site_url: "https://markmichon.com",
    image_url: "https://markmichon.com/icon.png"
  })

  items.forEach(i => {
    rssFeed.item({
      title: i.title,
      description: i.content_html,
      url: i.url,
      guid: i.url,
      author: "Mark Michon",
      date: i.date_published
    })
  })

  const rss = rssFeed.xml()

  await writeFile("./public/feed.json", JSON.stringify(jsonFeed))
  await writeFile("./public/feed.xml", rss)

  return Promise.resolve()
}
