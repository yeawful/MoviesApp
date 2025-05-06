import { Component } from 'react';
import { Menu, Input } from 'antd';
import PropTypes from 'prop-types';

import './Header.scss';

class Header extends Component {
    menuItems = [
        { label: 'Search', key: 'search' },
        { label: 'Rated', key: 'rated' },
    ];

    render() {
        const { inputHandler, inputValue, activeTab, onTabChange, showSearch } = this.props;

        return (
            <header className="header">
                <Menu
                    items={this.menuItems}
                    mode="horizontal"
                    selectedKeys={[activeTab]}
                    onClick={onTabChange}
                    className="header__menu"
                />

                {showSearch && (
                    <Input
                        className="header__search"
                        placeholder="Type to search..."
                        value={inputValue}
                        onChange={(e) => inputHandler(e.target.value)}
                        allowClear
                    />
                )}
            </header>
        );
    }
}

Header.propTypes = {
    inputHandler: PropTypes.func.isRequired,
    inputValue: PropTypes.string,
    activeTab: PropTypes.oneOf(['search', 'rated']).isRequired,
    onTabChange: PropTypes.func.isRequired,
    showSearch: PropTypes.bool
};

export default Header;
