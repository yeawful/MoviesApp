import { Component } from 'react';
import { Pagination, Alert } from 'antd';
import 'antd/dist/reset.css';

import CardList from '../CardList/CardList.jsx';
import './App.scss';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      pageNumber: 1,
      totalResults: 0,
      isOnline: navigator.onLine,
    };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange);
    window.removeEventListener('offline', this.handleNetworkChange);
  }

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
    const { pageNumber, totalResults, isOnline } = this.state;

    return (
      <div className="app">
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