import { Component } from 'react';
import { Pagination } from 'antd';
import 'antd/dist/reset.css';

import CardList from '../CardList/CardList.jsx';

import './App.scss';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      pageNumber: 1,
      totalResults: 0,
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ pageNumber });
  };

  setTotalResults = (count) => {
    this.setState({ totalResults: count });
  };

  render() {
    const { pageNumber, totalResults } = this.state;

    return (
      <div className="app">
        <CardList
          pageNumber={pageNumber}
          handlePageChange={this.handlePageChange}
          setTotalResults={this.setTotalResults}
        />
        <Pagination
          className="pagination"
          current={pageNumber}
          onChange={this.handlePageChange}
          total={totalResults}
          hideOnSinglePage
          pageSize={20}
          showSizeChanger={false}
        />
      </div>
    );
  }
}