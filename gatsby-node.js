const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);
const slash = require(`slash`);
const moment = require('moment');

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  const pageLength = 2;

  const pageToPath = (index, pathPrefix, maxPages) => {
    if (pathPrefix !== null) {
      pathPrefix = `/${pathPrefix}`;
    } else {
      pathPrefix = '';
    }

    if (index == 1) {
      return `${pathPrefix}/`;
    }

    if (index > 1 && index <= maxPages) {
      return `${pathPrefix}/${index}`;
    }

    return '';
  };

  const createPaginatedPages = ({
    edges,
    pathPrefix = null,
    component,
    context = {}
  }) => {
    const groupedPages = edges
      .map((edge, index) => {
        return index % pageLength === 0
          ? edges.slice(index, index + pageLength)
          : null;
      })
      .filter(edge => edge);



    groupedPages.forEach((group, index, groups) => {
      const pageNumber = index + 1;

      return createPage({
        path: pageToPath(pageNumber, pathPrefix, groups.length),
        component: component,
        context: {
          group: group,
          nextPath: pageToPath(pageNumber - 1, pathPrefix, groups.length),
          prevPath: pageToPath(pageNumber + 1, pathPrefix, groups.length),
          extraContext: context
        }
      });
    });
  };

  return new Promise((resolve, reject) => {
    graphql(
      `
        {
          allContentfulPost(
            limit: 1000
            sort: { fields: createdAt, order: DESC }
          ) {
            edges {
              node {
                id
                createdAt
                title {
                  title
                }
                slug
                body {
                  id
                  body
                }
                author {
                  name
                  website
                }
                category {
                  title
                }
                featuredImage {
                  file {
                    url
                  }
                }
                date
              }
            }
          }
        }
      `
    ).then(result => {
      if (result.errors) {
        reject(result.errors);
      }

      // Create main paginated index of posts.
      createPaginatedPages({
        edges: result.data.allContentfulPost.edges,
        component: path.resolve(`./src/templates/index.js`)
      });

      // Get the unique years for posts.
      const years = result.data.allContentfulPost.edges
        .map(edge => {
          const postDate = edge.node.date
            ? moment(edge.node.date)
            : moment(edge.node.createdAt);

          return moment(postDate).format('YYYY');
        })
        .filter((elem, pos, arr) => arr.indexOf(elem) == pos);


      years.forEach(year => {
        // Get the posts that occur in this year.
        const yearEdges = result.data.allContentfulPost.edges.filter(
          (edge, pos, arr) => {
            const postDate = edge.node.date
              ? moment(edge.node.date)
              : moment(edge.node.createdAt);

            return moment(postDate).format('YYYY') == year;
          }
        );

          // Create paginated index for each year of posts.
        createPaginatedPages({
          edges: yearEdges,
          component: path.resolve(`./src/templates/year.js`),
          pathPrefix: year,
          context: {
            date: new Date(year)
          }
        });

        // Get the unique months in the current year.
        const months = yearEdges
          .map(edge => {
            const postDate = edge.node.date
              ? moment(edge.node.date)
              : moment(edge.node.createdAt);

            return moment(postDate).format('MM');
          })
          .filter((elem, pos, arr) => arr.indexOf(elem) == pos);

        months.forEach(month => {
          // Get the posts that occur in this year/month.
          const monthEdges = yearEdges.filter(
            (edge, pos, arr) => {
              const postDate = edge.node.date
                ? moment(edge.node.date)
                : moment(edge.node.createdAt);

              return moment(postDate).format('MM') == month;
            }
          );

          // Create paginated index for each year/month of posts.
          createPaginatedPages({
            edges: monthEdges,
            component: path.resolve(`./src/templates/month.js`),
            pathPrefix: `${year}/${month}`,
            context: {
              date: new Date(year, month-1)
            }
          });
        });
      });

      // Get all categories from all posts.
      const allCategories = [];
      result.data.allContentfulPost.edges.forEach(edge => {
        if (edge.node.category) {
          edge.node.category.forEach(category => {
            allCategories.push(category.title);
          });
        }
      });

      // Filter all categories down to only unique ones.
      allCategories
        .filter((elem, pos, arr) => arr.indexOf(elem) == pos)
        .forEach(categoryTitle => {
          const categoryEdges = result.data.allContentfulPost.edges.filter(
            (edge, pos, arr) => {
              let edgeCategory = false;

              if (edge.node.category) {
                edge.node.category.forEach(category => {
                  if (category.title === categoryTitle) {
                    edgeCategory = true;
                  }
                });
              }

              return edgeCategory;
            }
          );

          // Create paginated pages for posts per category.
          createPaginatedPages({
            edges: categoryEdges,
            component: path.resolve(`./src/templates/category.js`),
            pathPrefix: `category/${categoryTitle}`,
            context: {
              category: categoryTitle
            }
          });
        });

      // Dynamically create pages for each post from contentful.
      result.data.allContentfulPost.edges.forEach(edge => {
        const postDate = edge.node.date
          ? moment(edge.node.date)
          : moment(edge.node.createdAt);
        createPage({
          path: `/${postDate.format('YYYY')}/${postDate.format('MM')}/${
            edge.node.slug
          }/`,
          component: path.resolve(`./src/templates/post.js`),
          context: {
            id: edge.node.id
          }
        });
      });

      resolve();
    });
  });
};
