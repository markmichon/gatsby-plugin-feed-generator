import fs from "fs"
import pify from "pify"

export const writeFile = pify(fs.writeFile)

export const runQuery = (handler, query) =>
  handler(query).then(r => {
    if (r.errors) {
      throw new Error(r.errors.join(`, `))
    }

    return r.data
  })

export const defaultOptions = {
  // Generator name
  generator: `GatsbyJS`,
  rss: true,
  json: true,
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

  feedQuery: `
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
      `
}
