import React, { Component } from 'react';

class Canvas extends Component {
    componentDidMount() {
        var canvas = document.getElementById('test');
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');

            const gridSize = 10;

            for (let x = gridSize; x < 250; x += gridSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, 250);
                ctx.stroke();
            }

            for (let y = gridSize; y < 250; y += gridSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(250, y);
                ctx.stroke();
            }
        }
    }

    render() {
        return (
            <div>
                <h2>Generation: #</h2>
                <canvas id='test' width='250' height='250'></canvas>
                <button>Play</button>
                <button>Pause</button>
                <button>Stop</button>
            </div>
        );
    }
}

export default Canvas;
