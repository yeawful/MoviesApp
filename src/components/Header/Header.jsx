import { Component } from 'react';
import { Menu, Input } from 'antd';

import './Header.scss';

class Header extends Component {
  menuItems = [
    { label: 'Search', key: 'search' },
    { label: 'Rated', key: 'rated' },
  ];

  render() {
    const { inputHandler, inputValue } = this.props;

    return (
      <header className="header">
        <Menu 
          items={this.menuItems} 
          mode="horizontal" 
          defaultSelectedKeys={['search']} 
          className="header__menu" 
        />

        <Input
          className="header__search"
          placeholder="Type to search..."
          value={inputValue}
          onChange={(e) => inputHandler(e.target.value)}
        />
      </header>
    );
  }
}

export default Header;