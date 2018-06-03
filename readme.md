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
    resolve: 'gatsby-plugin-feed-generator'
  }
]
```

Beyond that, you can customize the setup by setting options on the plugin. Below are the defaults. Include the needed changes.

```javascript
// gatsby-config.js

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
      // The plugin requires frontmatter of date, path(or slug/url), and title at minimum
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
  }
]
```

### Customization
Add an option to define a function that runs on the result of the query.
That function is expected return an object with properties matching the needed data.

* **Site** requires `title, description, author, and siteUrl
* **Form** requires `title, description, url, guid, author, date_published, date_modified`

```javascript
// gatsby-config.js

plugins: [
  {
    resolve: 'gatsby-plugin-feed-generator',
    options: {
      siteOptions: {user_comment: "This feed allows you to..."},
      siteQuery: `
        { 
          cmsSite {
            title
            description
            author
            siteUrl
          }
        }
      `,
      siteQueryPost: ({cmsSite},siteOptions = {}) => ({...cmsSite, ...siteOptions})
      // snip
      
// src/gatsby-node.js

const siteQueryPostDefault = ({site: {siteMetadata}) => ({...siteMetadata})
const siteQueryPost options.siteQueryPost || siteQueryPostDefault
const siteData = siteQueryPost(siteQuery, options.siteQueryOptions)

// siteData = {title, description, author, siteUrl}

// ditto for feeds

// Also?
// this could get out of hand quickly, but 
plugins: [ { resolve: 'gatsby-plugin-feed-generator' options: {
      feedOptions: {
        feedUrlFileName:  "feed"
        // or
        feedUrlRss: "podcast.rss"
      },

//

// Maybe?
plugins: [ { resolve: 'gatsby-plugin-feed-generator' 
  options: {
    feeds: [
      {path: '/'}, // default site & feed queries
      {path: '/podcast', fileBase: 'podcast', feedQuery: graphql`
        allPodCast { // filter, sort, limit...
          title
          url
          content
        }
       `  
    ]
```
