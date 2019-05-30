# gatsby-plugin-feed-generator

A [Gatsby](https://gatsbyjs.org) plugin to generate [JSON Feed](https://jsonfeed.org/) and RSS feeds for markdown generated gatsby blogs. Currently limited to a single feed based on markdown pages. Feel free to add feature requests and use cases to the issues page.

## Usage

Basic setup requires at minimum the following:

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
    rss: true, // Set to false to stop rss generation
    json: true, // Set to false to stop json feed generation
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
        name: 'feed',
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
