import { Component } from 'react';
import { Pagination, Alert } from 'antd';
import { debounce } from 'lodash';
import 'antd/dist/reset.css';

import './App.scss';
import Header from '../Header/Header.jsx';
import CardList from '../CardList/CardList.jsx';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      pageNumber: 1,
      totalResults: 0,
      isOnline: navigator.onLine,
      searchQuery: '',
    };
    this.debouncedSearch = debounce(this.handleSearch);
  }

  componentDidMount() {
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange);
    window.removeEventListener('offline', this.handleNetworkChange);
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query, pageNumber: 1 });
  };

  handleNetworkChange = () => {
    this.setState({ isOnline: navigator.onLine });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ pageNumber });
  };

  setTotalResults = (count) => {
    this.setState({ totalResults: count });
  };

  render() {
    const { pageNumber, totalResults, isOnline, searchQuery } = this.state;

    return (
      <main className="app">
        <Header 
          inputHandler={this.debouncedSearch}
          inputValue={searchQuery}
        />

        {!isOnline && (
          <Alert
            type="warning"
            message="No internet connection"
            description="Please check your network settings."
            showIcon
            closable
            className="offline-alert"
          />
        )}

        <CardList
          pageNumber={pageNumber}
          searchQuery={searchQuery}
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
      </main>
    );
  }
}