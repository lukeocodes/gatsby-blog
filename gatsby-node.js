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

      createPaginatedPages({
        edges: result.data.allContentfulPost.edges,
        component: path.resolve(`./src/templates/index.js`)
      });

      const years = result.data.allContentfulPost.edges
        .map(edge => {
          const postDate = edge.node.date
            ? moment(edge.node.date)
            : moment(edge.node.createdAt);

          return moment(postDate).format('YYYY');
        })
        .filter((elem, pos, arr) => arr.indexOf(elem) == pos);

      years.forEach(year => {
        const yearEdges = result.data.allContentfulPost.edges.filter(
          (edge, pos, arr) => {
            const postDate = edge.node.date
              ? moment(edge.node.date)
              : moment(edge.node.createdAt);

            return moment(postDate).format('YYYY') == year;
          }
        );

        createPaginatedPages({
          edges: yearEdges,
          component: path.resolve(`./src/templates/year.js`),
          pathPrefix: year,
          context: {
            date: new Date(year)
          }
        });

        const months = yearEdges
          .map(edge => {
            const postDate = edge.node.date
              ? moment(edge.node.date)
              : moment(edge.node.createdAt);

            return moment(postDate).format('MM');
          })
          .filter((elem, pos, arr) => arr.indexOf(elem) == pos);

        months.forEach(month => {
          const monthEdges = yearEdges.filter(
            (edge, pos, arr) => {
              const postDate = edge.node.date
                ? moment(edge.node.date)
                : moment(edge.node.createdAt);

              return moment(postDate).format('MM') == month;
            }
          );

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
