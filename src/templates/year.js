import React, { Component } from 'react';
import IndexPage from '../templates/index.js';
import { Breadcrumb } from 'react-bootstrap';
import moment from 'moment';

class YearPage extends IndexPage {
  breadcrumbs() {
    const { data, pathContext } = this.props;
    const { extraContext } = pathContext;

    return (
      <Breadcrumb>
        <Breadcrumb.Item href={'/'}>
          Blog
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{moment(extraContext.date).format('YYYY')}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }
}

export default YearPage;
