module.exports = {
  siteMetadata: {
    title: `Gatsby Blog`,
  },
  plugins: [
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `spaceId`,
        accessToken: `accessToken`,
      },
    },
    `gatsby-plugin-react-helmet`
  ],
}