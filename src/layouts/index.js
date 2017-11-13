import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import Header from '../components/header.js';
import Footer from '../components/footer.js';

const TemplateWrapper = ({ children }) => (
  <div name="main-page">
    <Helmet
      title="blog"
      meta={[
        {
          name: 'description',
          content:
            'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Vivamus suscipit tortor eget felis porttitor volutpat. Sed porttitor lectus nibh.'
        },
        { name: 'keywords', content: 'Some, key, words' },
      ]}
      link={[
        {
          rel: 'stylesheet',
          href:
            'https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css'
        }
      ]}
    />

    <Header />
    {children()}
    <Footer />
  </div>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func
};

export default TemplateWrapper;
