import React, {Component} from 'react';

export default class Toolbar extends Component {


    render() {
       const {headers, sort} = this.props;
        return (
            <thead onClick={sort}>
            <tr>{headers.map((title, idx) => {
                return <th key={idx}>{title}</th>
            })}</tr>
            </thead>
        );
    }
}