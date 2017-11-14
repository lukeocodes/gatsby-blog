import React, { Component } from 'react';
import IndexPage from '../templates/index.js';
import { Col, Clearfix, Jumbotron, Breadcrumb } from 'react-bootstrap';
import moment from 'moment';

class MonthPage extends IndexPage {
  breadcrumbs() {
    const { data, pathContext } = this.props;
    const { extraContext } = pathContext;

    return (
      <Breadcrumb>
        <Breadcrumb.Item href={'/'}>
          Blog
        </Breadcrumb.Item>
        <Breadcrumb.Item href={`/${moment(extraContext.date).format('YYYY')}/`}>{moment(extraContext.date).format('YYYY')}</Breadcrumb.Item>
        <Breadcrumb.Item active>{moment(extraContext.date).format('MMMM')}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  jumbotron() {
    const { data, pathContext } = this.props;
    const { extraContext } = pathContext;

    return (
      <Jumbotron style={{
        height: '400px',
        backgroundColor: '#555',
        color: 'white'
      }}>
        <Col md={8} mdOffset={2} lg={6} lgOffset={3}>
          <h1>Posts from {moment(extraContext.date).format('MMMM')} {moment(extraContext.date).format('YYYY')}</h1>
        </Col>
        <Clearfix />
      </Jumbotron>
    )
  }
}

export default MonthPage;
