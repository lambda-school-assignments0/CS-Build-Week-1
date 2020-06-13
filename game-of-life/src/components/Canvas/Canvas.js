import React, { Component } from 'react';

class Canvas extends Component {
    constructor() {
        super();
        this.state = {
            canvasRef: React.createRef(),
            canvasSize: 400,
            cellDead: [],
            cellLive: [[9, 9]],
            gridSize: 20,
            isAnimating: false,
            speed: 1000,
            timeCurrent: null,
            timePrev: null,
        };
    }

    componentDidMount() {
        console.log('CDM');
        const canvas = this.state.canvasRef.current;
        const context = canvas.getContext('2d');
        this.drawGrid(context);
        this.drawActive(context);
    }

    componentDidUpdate() {
        console.log({ method: 'CDU', state: this.state, refs: this.refs });
    }

    drawActive(context) {
        for (let coords of this.state.cellLive) {
            let coordsMapped = [coords[0] * this.state.gridSize, coords[1] * this.state.gridSize];
            context.fillRect(coordsMapped[0], coordsMapped[1], this.state.gridSize, this.state.gridSize);
        }
    }

    drawGrid(context) {
        /*
        drawGrid(context) draws gridlines spaced out according
        to `this.state.gridSize` that fits in a square with the
        size `this.state.canvasSize`
        */
        // draw vertical grid lines
        for (let x = this.state.gridSize; x < this.state.canvasSize; x += this.state.gridSize) {
            context.moveTo(x, 0);
            context.lineTo(x, this.state.canvasSize);
            context.stroke();
        }

        // draw horizontal grid lines
        for (let y = this.state.gridSize; y < this.state.canvasSize; y += this.state.gridSize) {
            context.moveTo(0, y);
            context.lineTo(this.state.canvasSize, y);
            context.stroke();
        }
    }

    initializeCellData() {
        /*
        initializeCellData()
        */
    }

    async animateStep() {
        const canvas = this.state.canvasRef.current;
        const context = canvas.getContext('2d');
        console.log('Is this working for you yet?');
        await this.setState({ cellLive: [[this.state.cellLive[0][0] + 1, this.state.cellLive[0][1] + 1]] });
        await this.drawActive(context);
    }

    pauseAnimation() {
        if (this.state.isAnimating) {
            this.setState({ isAnimating: false });
        }
    }

    startAnimation() {
        if (!this.state.isAnimating) {
            this.setState({ isAnimating: true });
            this.animateStep();
        }
    }

    stopAnimation() {
        if (this.state.isAnimating) {
            this.setState({ isAnimating: false });
        }
    }

    render() {
        return (
            <div>
                <h2>Generation: #</h2>
                <canvas className='canvas' ref={this.state.canvasRef} width={this.state.canvasSize} height={this.state.canvasSize}></canvas>
                <button onClick={() => this.startAnimation()}>Start</button>
                <button onClick={() => this.pauseAnimation()}>Pause</button>
                <button onClick={() => this.stopAnimation()}>Stop</button>
                <button onClick={() => this.stopAnimation()}>Move Right</button>
            </div>
        );
    }
}

export default Canvas;
