import React, { Component } from 'react';
import Link from 'gatsby-link';
import marked from 'marked';
import moment from 'moment';
import Truncate from 'react-truncate-html';
import Helmet from 'react-helmet';
import { Label } from 'react-bootstrap';

const BlogBody = props => {
  const { body, truncate, title } = props;

  if (truncate) {
    return (
      <section>
        Nulla quis lorem ut libero malesuada feugiat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.
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
  const { id, title: { title }, body: { body }, slug, date, createdAt, category } = props.post;
  const postDate = date ? moment(date) : moment(createdAt);
  const path = `/${postDate.format('YYYY')}/${postDate.format('MM')}/${slug}/`;
  const hasCategories = category !== null;

  return (
    <article>
      <header>
        <h2>
          <Link to={path}>{title}</Link>
        </h2>
        <time content={postDate.format()}>
          <strong>{postDate.format('Do MMMM[,] YYYY')}</strong>
        </time>
      </header>

      {!props.preview ? (
        <BlogBody body={body} title={title} />
      ) : (
        <BlogBody body={body} truncate={props.preview} />
      )}

      <div>
        {hasCategories && category.map(c => (
          <span key={`${id}_${c.title}`}><Link to={`/category/${c.title}`}><Label bsStyle="primary">{c.title}</Label></Link>&nbsp;</span>
        ))}
        
      </div>
    </article>
  );
};

export default BlogPosting;
