import React, {Component} from 'react';
import data from './shop.json';
import Toolbar from "./components/ToolBar";


export default class App extends Component {
    state = {
        shop: data.goods,
        sortby: null,
        descending: false,
        search: false,
        currentPage: 1,
        todosPerPage: 10
    };

    header = ['id', 'title', 'price', 'oldPrice'];
    _preSearchData = null;

    _sort = (e) => {
        let column = e.target.innerHTML;
        let data = Array.from(this.state.shop);
        let descending = this.state.sortby === column && !this.state.descending;
        data.sort((a, b) => {
            return descending
                ? (a.data[column] < b.data[column] ? 1 : -1)
                : (a.data[column] > b.data[column] ? 1 : -1);

        });
        this.setState({
            shop: data,
            sortby: column,
            descending: descending,
        });
    };

    _renderToolbar = () => {
        return (
            <div className='wrapper'>
                <button onClick={this._toggleSearch} className='wsa_6s'>Search</button>
            </div>
        )
    };


    _toggleSearch = () => {
        if (this.state.search) {
            this.setState({
                shop: this._preSearchData,
                search: false,
            });
            this._preSearchData = null;
        } else {
            this._preSearchData = this.state.shop;
            this.setState({
                search: true,
            });
        }
    };

    _renderSearch = () => {
        if (!this.state.search) {
            return null;
        }
        return (
            <tr onChange={this._search}>
                {this.header.map((title, idx) => {
                    return <td key={idx}><input type="text" data-title={title}/></td>;
                })}
            </tr>
        );
    };

    _search = (e) => {
        let needle = e.target.value.toLowerCase();
        if (!needle) {
            this.setState({shop: this._preSearchData});
            return;
        }
        let title = e.target.dataset.title;

        let searchdata = this._preSearchData.filter((row) => {
            return row.data[title].toString().toLowerCase().indexOf(needle) > -1;
        });
        this.setState({shop: searchdata});

    };

    handleClick = (event) => {
        this.setState({
            currentPage: Number(event.target.id)
        });
    };

    render() {
        const {shop, currentPage, todosPerPage} = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = shop.slice(indexOfFirstTodo, indexOfLastTodo);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(shop.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    {number}
                </li>
            );
        });
        return (
            <div className="app container-fluid">
                <div className="row">
                    {this._renderToolbar()}
                    <table className="table table-striped table-hover">
                        <Toolbar sort={this._sort}
                                 headers={this.header}
                                 currentShop={this.shop}/>
                        <tbody>
                        {this._renderSearch()}
                        {currentTodos.map((row, idx) => {
                            return (<tr key={idx}>
                                <td>{row.data.id}</td>
                                <td>{row.data.title}</td>
                                <td>{row.data.price}</td>
                                <td>{row.data.oldPrice}</td>
                                <td><img src={row.data.base_url} className="goods_image"/></td>
                            </tr>)
                        })}
                        </tbody>
                    </table>
                    <div className='wrapper'>
                        <ul>{renderPageNumbers}</ul>
                    </div>

                </div>
            </div>
        )
    }

}
