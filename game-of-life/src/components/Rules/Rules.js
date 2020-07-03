import React, { Component } from 'react';

import './Rules.css';

class Rules extends Component {
    render() {
        return (
            <div className='rules'>
                <h2>Rules:</h2>
                <ul className='rules-list'>
                    <li>Any live cell with fewer than 2 live neighbors dies, as if by underpopulation.</li>
                    <li>Any live cell with 2 or 3 live neighbors lives on to the next generation.</li>
                    <li>Any live cell with more than 3 live neighbors dies, as if by overpopulation.</li>
                    <li>Any dead cell with exactly 3 live neighbors becomes a live cell, as if by reproduction.</li>
                </ul>
            </div>
        );
    }
}

export default Rules;
