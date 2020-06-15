import React, { Component } from 'react';

const initState = {
    cellLive: [
        // `toad` config
        [9, 10],
        [10, 10],
        [11, 10],
        [10, 9],
        [11, 9],
        [12, 9],
    ],
};

class Canvas extends Component {
    constructor() {
        super();
        this.state = {
            canvasRef: React.createRef(),
            canvas: null,
            canvasCtx: null,
            canvasSize: 400,
            cellLive: [],
            cellLiveMap: new Map(),
            fps: 2,
            gridSize: 20,
            isAnimating: false,
            lastEdited: null,
            speed: 1000,
            timeCurrent: null,
            timePrev: null,
        };
        this.canvas = null;
        this.canvasCtx = null;
    }

    algoGameOfLife() {
        let cellLive = [];
        let cellDead = this.deadNeighbors(this.state.cellLive);

        for (let coordsLive of this.state.cellLive) {
            let numberLiveNeighbors = this.getNumberLiveNeighbors(coordsLive);
            if (numberLiveNeighbors < 2) {
                // current cell dies; add to `cellDead`
            } else if (numberLiveNeighbors > 3) {
                // current cell dies; add to `cellDead`
            } else if (numberLiveNeighbors === 2 || numberLiveNeighbors === 3) {
                // current cell lives; add to `cellLive`
                cellLive.push(coordsLive);
            }
        }

        for (let coordsDead of cellDead) {
            let numberLiveNeighbors = this.getNumberLiveNeighbors(coordsDead);
            if (numberLiveNeighbors === 3) {
                // current cell lives; add to `cellLive`
                cellLive.push(coordsDead);
            }
        }

        this.setState({
            cellLive: cellLive,
        });
    }

    deadNeighbors(coordsLive) {
        let coordsDead = [];
        let visited = new Set();

        for (let coordLive of coordsLive) {
            visited.add(String(coordLive));
        }

        for (let coords of coordsLive) {
            let coordsAdjacent = [
                [coords[0] - 1, coords[1] - 1], // top left
                [coords[0] + 0, coords[1] - 1], // top mid
                [coords[0] + 1, coords[1] - 1], // top right
                [coords[0] - 1, coords[1] + 0], // mid left
                [coords[0] + 1, coords[1] + 0], // mid right
                [coords[0] - 1, coords[1] + 1], // bot left
                [coords[0] + 0, coords[1] + 1], // bot mid
                [coords[0] + 1, coords[1] + 1], // bot right
            ];
            for (let coordsAdj of coordsAdjacent) {
                if (!visited.has(String(coordsAdj))) {
                    coordsDead.push(coordsAdj);
                    visited.add(String(coordsAdj));
                }
            }
        }
        return coordsDead;
    }

    getNumberLiveNeighbors(coords) {
        let count = 0;
        let coordsAdjacent = [
            [coords[0] - 1, coords[1] - 1], // top left
            [coords[0] + 0, coords[1] - 1], // top mid
            [coords[0] + 1, coords[1] - 1], // top right
            [coords[0] - 1, coords[1] + 0], // mid left
            [coords[0] + 1, coords[1] + 0], // mid right
            [coords[0] - 1, coords[1] + 1], // bot left
            [coords[0] + 0, coords[1] + 1], // bot mid
            [coords[0] + 1, coords[1] + 1], // bot right
        ];
        coordsAdjacent.forEach((coord) => {
            for (let cellLive of this.state.cellLive) {
                if (cellLive[0] === coord[0] && cellLive[1] === coord[1]) {
                    count += 1;
                }
            }
        });
        return count;
    }

    componentDidMount() {
        // console.log('CDM');
        this.canvas = this.state.canvasRef.current;
        this.canvasCtx = this.canvas.getContext('2d');

        this.canvas.addEventListener('mousedown', (event) => this.canvasMouseDown(event));
        // this.canvas.addEventListener('mousemove', (event) => this.canvasMouseMove(event));
        // this.canvas.addEventListener('mouseup', (event) => this.canvasMouseUp(event));

        this.drawActive();
    }

    componentDidUpdate() {
        // console.log({ method: 'CDU', state: this.state, refs: this.refs });
    }

    async canvasMouseDown(event) {
        console.log('Mouse pressed!');
        const cellLive = [...this.state.cellLive];
        const cellLiveMap = new Map(this.state.cellLiveMap);

        const currX = Math.floor(event.offsetX / this.state.gridSize);
        const currY = Math.floor(event.offsetY / this.state.gridSize);

        if (!this.state.cellLiveMap.has(`[${currX}, ${currY}]`)) {
            cellLive.push([currX, currY]);
            cellLiveMap.set(`[${currX}, ${currY}]`, cellLive.length - 1);
        } else {
            console.log(currX, currY, cellLiveMap, cellLiveMap[`[${currX}, ${currY}]`])
            cellLive.splice(cellLiveMap.get(`[${currX}, ${currY}]`), 1);
            cellLiveMap.delete(`[${currX}, ${currY}]`);
        }

        await this.setState({
            cellLive: cellLive,
            cellLiveMap: cellLiveMap,
        });

        this.drawActive();
    }

    canvasMouseMove(event) {
        console.log('Mouse moving!');
        // console.log(Math.floor(event.offsetX / this.state.gridSize), Math.floor(event.offsetY / this.state.gridSize));
    }

    canvasMouseUp(event) {
        console.log('Mouse up!');
    }

    drawActive() {
        this.canvasCtx.clearRect(0, 0, this.state.canvasSize, this.state.canvasSize);
        for (let coords of this.state.cellLive) {
            let coordsMapped = [coords[0] * this.state.gridSize, coords[1] * this.state.gridSize];
            this.canvasCtx.fillRect(coordsMapped[0], coordsMapped[1], this.state.gridSize, this.state.gridSize);
        }
        this.drawGrid();
    }

    drawGrid() {
        /*
        drawGrid(context) draws gridlines spaced out according
        to `this.state.gridSize` that fits in a square with the
        size `this.state.canvasSize`
        */
        // draw vertical grid lines
        this.canvasCtx.strokeStyle = '#C0C0C0';

        for (let x = this.state.gridSize; x < this.state.canvasSize; x += this.state.gridSize) {
            this.canvasCtx.moveTo(x, 0);
            this.canvasCtx.lineTo(x, this.state.canvasSize);
            this.canvasCtx.stroke();
        }

        // draw horizontal grid lines
        for (let y = this.state.gridSize; y < this.state.canvasSize; y += this.state.gridSize) {
            this.canvasCtx.moveTo(0, y);
            this.canvasCtx.lineTo(this.state.canvasSize, y);
            this.canvasCtx.stroke();
        }
    }

    animateStep() {
        if (this.state.isAnimating) {
            setTimeout(async () => {
                this.rAF = requestAnimationFrame(this.animateStep.bind(this));
                await this.algoGameOfLife();
                this.drawActive(this.canvasCtx);
            }, 1000 / this.state.fps);
        }
    }

    pauseAnimation() {
        if (this.state.isAnimating) {
            this.setState({ isAnimating: false });
        }
    }

    async resetAnimation() {
        await this.setState({
            isAnimating: false,
            cellDead: initState.cellDead,
            cellLive: initState.cellLive,
        });
        this.drawActive();
    }

    async startAnimation() {
        if (!this.state.isAnimating) {
            await this.setState({ isAnimating: true });
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
                <button onClick={() => this.stopAnimation()}>Stop</button>
                <button onClick={() => this.resetAnimation()}>Reset</button>
            </div>
        );
    }
}

export default Canvas;
