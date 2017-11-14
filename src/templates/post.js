import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import BlogPosting from '../components/blog-posting';
import {
  Jumbotron,
  Col,
  Clearfix,
  Grid,
  Row,
  Breadcrumb
} from 'react-bootstrap';
import Helmet from 'react-helmet';
import moment from 'moment';

const propTypes = {
  data: PropTypes.object.isRequired
};

const PostTemplate = props => {
  const post = props.data.contentfulPost;
  const postDate = post.date ? moment(post.date) : moment(post.createdAt);
  const fileUrl = post.featuredImage ? post.featuredImage.file.url : '' 

  return (
    <main>
      <Jumbotron style={{
        height: '400px',
        backgroundColor: '#555',
        backgroundImage: `url(${fileUrl})`,
        backgroundRepeat  : 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '100%',
        color: 'white'
      }}>
        <Col md={8} mdOffset={2} lg={6} lgOffset={3}>
          <h1>{post.title.title}</h1>
        </Col>
        <Clearfix />
      </Jumbotron>
      <Grid fluid>
        <Row className="show-grid">
          <Col md={8} mdOffset={2} lg={6} lgOffset={3}>
            <Breadcrumb>
              <Breadcrumb.Item href={'/'}>
                Blog
              </Breadcrumb.Item>
              <Breadcrumb.Item href={`/${moment(postDate).format('YYYY')}/`}>
                {moment(postDate).format('YYYY')}
              </Breadcrumb.Item>
              <Breadcrumb.Item
                href={`/${moment(postDate).format('YYYY')}/${moment(
                  postDate
                ).format('MM')}/`}
              >
                {moment(postDate).format('MMMM')}
              </Breadcrumb.Item>
              <Breadcrumb.Item active>{post.title.title}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={8} mdOffset={2} lg={6} lgOffset={3}>
            <BlogPosting post={post} />
          </Col>
        </Row>
      </Grid>
    </main>
  );
};

PostTemplate.propTypes = propTypes;

export default PostTemplate;

export const pageQuery = graphql`
  query postQuery($id: String!) {
    contentfulPost(id: { eq: $id }) {
      id
      createdAt
      title {
        title
      }
      slug
      body {
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
`;
