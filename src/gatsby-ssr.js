import React from 'react'

exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const { rss, json, feeds } = pluginOptions
  let output = []

  for (let feed of feeds) {
    if (rss) {
      output.push(
        <link
          rel="alternate"
          key="gatsby-feed-rss"
          type="application/rss+xml"
          href={`${feed.name}.xml`}
        />
      )
    }

    if (json) {
      output.push(
        <link
          rel="alternate"
          key="gatsby-feed-json"
          type="application/json"
          href={`${feed.name}.json`}
        />
      )
    }
  }

  setHeadComponents(output)
}
