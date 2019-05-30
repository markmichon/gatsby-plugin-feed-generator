import path from 'path'
import RSS from 'rss'
import { defaultOptions, runQuery, writeFile } from './internals'
import { buildJsonFeed, buildRSSFeed } from './utils'
const publicPath = './public'

exports.onPostBuild = async ({ graphql }, pluginOptions) => {
  delete pluginOptions.plugins
  const options = {
    ...pluginOptions,
  }

  const siteQuery = await runQuery(graphql, options.siteQuery)

  const { site } = siteQuery
  console.log(site.siteMetadata)

  for (let feed of options.feeds) {
    const feedQuery = await runQuery(graphql, feed.query)
    const query = { ...siteQuery, ...feedQuery }
    const feedItems = feed.normalize({ query })
    if (options.json) {
      console.log(`Generating JSON feed for ${feed.name}.json`)
      let json = buildJsonFeed({
        site,
        items: feedItems,
        name: `${feed.name}.json`,
      })
      await writeFile(
        path.join(publicPath, `${feed.name}.json`),
        JSON.stringify(json),
        'utf8'
      ).catch(r => {
        console.log(`Failed to write ${feed.name}.json file: `, r)
      })
    }

    if (options.rss) {
      console.log(`Generating RSS feed for ${feed.name}.xml`)
      let rss = buildRSSFeed({
        site,
        items: feedItems,
        name: `${feed.name}.xml`,
      })
      await writeFile(
        path.join(publicPath, `${feed.name}.xml`),
        rss,
        'utf8'
      ).catch(r => {
        console.log(`Failed to write ${feed.name}.xml file: `, r)
      })
    }
  }

  return Promise.resolve()
}
