import React from 'react'
import urlJoin from 'url-join'
import { withPrefix } from 'gatsby'
exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const { rss, json, feeds, baseUrl } = pluginOptions
  let output = []
  for (let feed of feeds) {
    let siteUrl = feed.baseUrl || '/'
    if (rss) {
      let rssurl = urlJoin(siteUrl, feed.name).replace(/\/+$/, '') + '.xml'
      output.push(
        <link
          rel="alternate"
          key="gatsby-feed-rss"
          type="application/rss+xml"
          href={rssurl}
        />
      )
    }

    if (json) {
      let jsonurl = urlJoin(siteUrl, feed.name).replace(/\/+$/, '') + '.json'
      output.push(
        <link
          rel="alternate"
          key="gatsby-feed-json"
          type="application/json"
          href={jsonurl}
        />
      )
    }
  }

  setHeadComponents(output)
}
