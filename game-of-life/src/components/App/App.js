import React, { Component } from 'react';

import About from '../About/About';
import Canvas from '../Canvas/Canvas';
import Rules from '../Rules/Rules';

import './App.css';

class App extends Component {
    render() {
        return (
            <div className='app'>
                <header className='app-header'>
                    <h1>Conway's Game of Life</h1>
                    <div className='app-middle'>
                        <Canvas />
                        <Rules />
                    </div>
                    <div className='app-bot'>
                        <About />
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
