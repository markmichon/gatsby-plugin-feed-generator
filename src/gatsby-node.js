import path from 'path'
import { runQuery, writeFile } from './internals'
import { buildFeed } from './utils'
const publicPath = './public'

exports.onPostBuild = async ({ graphql }, pluginOptions) => {
  delete pluginOptions.plugins
  const options = {
    ...pluginOptions,
  }

  const siteQuery = await runQuery(graphql, options.siteQuery)

  const { site } = siteQuery

  for (let feed of options.feeds) {
    const feedQuery = await runQuery(graphql, feed.query)
    const query = { ...siteQuery, ...feedQuery }
    const feedItems = feed.normalize({ query })
    const output = buildFeed({
      site,
      items: feedItems,
      name: `${feed.name}.json`,
      ...feed.options,
    })
    if (options.json) {
      console.log(`Generating JSON feed for ${feed.name}.json`)
      await writeFile(
        path.join(publicPath, `${feed.name}.json`),
        output.json1(),
        'utf8'
      ).catch(r => {
        console.log(`Failed to write ${feed.name}.json file: `, r)
      })
    }

    if (options.rss) {
      console.log(`Generating RSS feed for ${feed.name}.xml`)

      await writeFile(
        path.join(publicPath, `${feed.name}.xml`),
        output.rss2(),
        'utf8'
      ).catch(r => {
        console.log(`Failed to write ${feed.name}.xml file: `, r)
      })
    }
  }

  return Promise.resolve()
}
