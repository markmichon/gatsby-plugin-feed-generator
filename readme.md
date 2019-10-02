# gatsby-plugin-feed-generator

A [Gatsby](https://gatsbyjs.org) plugin to generate [JSON Feed](https://jsonfeed.org/) and RSS feeds for generated [Gatsby](https://gatsbyjs.org) sites.

## Installation and Setup

To get started, install via yarn or npm:

```bash
yarn add gatsby-plugin-feed-generator
```

Basic setup requires the following minimum siteMetaData located in your `gatsby-config.js` file:

```js
siteMetadata {
  title: 'Gatsby',
  description: 'A static site generator',
  siteUrl: 'https://gatsbyjs.org',
  author: 'Author Name'
},
```

To activate and configure the plugin add it to the plugins array in the gatsby config as you would any other plugin.

```js
plugins: [
  {
    resolve: 'gatsby-plugin-feed-generator',
    options: {
      //...
    },
  },
]
```

Version 1 allowed for using the built-in config, but for version 2+ you'll need to provide a siteQuery, one or more feeds, and a normalize function for each feed. This tells the plugin how to map your data onto the feeds.

Here is an example using `gatsby-transformer-remark`'s `allMarkdownRemark` as a source for your content:

```javascript

// gatsby-config.js

siteMetadata {
  title: 'Gatsby',
  description: 'A static site generator',
  siteUrl: 'https://gatsbyjs.org',
  author: 'Author Name'
},
plugins: [
  {
    resolve: 'gatsby-plugin-feed-generator',
    options: {
    generator: `GatsbyJS`,
    rss: true, // Set to true to enable rss generation
    json: true, // Set to true to enable json feed generation
    siteQuery: `
      {
        site {
          siteMetadata {
            title
            description
            siteUrl
            author
          }
        }
      }
    `,
    feeds: [
      {
        name: 'feed', // This determines the name of your feed file => feed.json & feed.xml
        query: `
        {
          allMarkdownRemark(
            sort: {order: DESC, fields: [frontmatter___date]},
            limit: 100,
            ) {
            edges {
              node {
                html
                frontmatter {
                  date
                  path
                  title
                }
              }
            }
          }
        }
        `,
        normalize: ({ query: { site, allMarkdownRemark } }) => {
          return allMarkdownRemark.edges.map(edge => {
            return {
              title: edge.node.frontmatter.title,
              date: edge.node.frontmatter.date,
              url: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
              html: edge.node.html,
            }
          })
        },
      },
    ],
  },
```

The important takeaway from the normalize function is the mapping of your graphql data onto the title, date, url, and html fields. If you have a special way of building urls, this is the place to handle that transformation before sending it to the plugin.

## Recipes

Above we saw markdown used, however other formats should work as well. Here's an example using MDX:

```js

//...

feeds: [
          {
            name: 'mdx-feed',
            query: `
            {
              allMdx(
                sort: {order: DESC, fields: [frontmatter___date]},
                limit: 100,
                ) {
                edges {
                  node {
                    html
                    frontmatter {
                      date
                      path
                      title
                    }
                  }
                }
              }
            }
            `,
            normalize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map(edge => {
                return {
                  title: edge.node.frontmatter.title,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                  html: edge.node.html,
                }
              })
            },
          },
        ],

```

## Inspiration and Similar Solutions

If you're looking for something more battle-tested and only need rss, check out the official [gatsby-plugin-feed](https://www.gatsbyjs.org/packages/gatsby-plugin-feed/).
