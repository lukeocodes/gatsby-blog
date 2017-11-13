import React, { Component } from 'react';
import Link from 'gatsby-link';
import marked from 'marked';
import moment from 'moment';
import Truncate from 'react-truncate-html';
import Helmet from 'react-helmet';

const BlogBody = props => {
  const { body, truncate, title } = props;

  if (truncate) {
    return (
      <section>
        <Truncate
          lines={5}
          dangerouslySetInnerHTML={{ __html: marked(body) }}
        />
      </section>
    );
  } else {
    return (
      <section>
        <Helmet title={`${title} :: blog`} />
        <p dangerouslySetInnerHTML={{ __html: marked(body) }} />
      </section>
    );
  }
};

const BlogPosting = props => {
  const { title: { title }, body: { body }, slug } = props.post;
  const postDate = props.post.date
    ? moment(props.post.date)
    : moment(props.post.createdAt);
  const path = `/${postDate.format('YYYY')}/${postDate.format('MM')}/${slug}/`;

  return (
    <article>
      <header>
        <h1>
          <Link to={path}>{title}</Link>
        </h1>
        <time content={postDate.format()}>
          {postDate.format('Do MMMM[,] YYYY')}
        </time>
      </header>

      {!props.preview ? (
        <BlogBody body={body} title={title} />
      ) : (
        <BlogBody body={body} truncate={props.preview} />
      )}
    </article>
  );
};

export default BlogPosting;
