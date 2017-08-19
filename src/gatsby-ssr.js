import React from "react"
import { defaultOptions } from "./internals"

exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const { rss, json } = {
    ...defaultOptions,
    ...pluginOptions
  }
  let output = []
  if (rss) {
    output.push(
      <link rel="alternate" type="application/rss+xml" href="feed.xml" />
    )
  }

  if (json) {
    output.push(
      <link rel="alternate" type="application/json" href="feed.json" />
    )
  }

  setHeadComponents(output)
}
