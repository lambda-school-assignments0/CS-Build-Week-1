import React, { Component } from 'react';

class Canvas extends Component {
    constructor() {
        super();
        this.state = {
            canvasRef: React.createRef(),
            canvasSize: 400,
            cellLive: [],
            cellLiveSet: new Set(),
            fps: 1,
            generation: 0,
            gridSize: 20,
            initState: new Set(),
            isAnimating: false,
            isDrawing: false,
            lastEdited: null,
            speed: 1000,
            timeCurrent: null,
            timePrev: null,
        };
        this.canvas = null;
        this.canvasCtx = null;
    }

    algoGameOfLife() {
        let cellLiveSet = new Set(this.state.cellLiveSet);

        for (let coordLive of this.state.cellLiveSet) {
            let parsedCoordLive = this.parseCoordFromSet(coordLive);
            let numberLiveNeighbors = this.getNumberLiveNeighbors(parsedCoordLive);
            if (numberLiveNeighbors < 2) {
                // current cell dies; remove from `this.state.cellLiveSet`; clear area in canvas
                cellLiveSet.delete(coordLive);
            } else if (numberLiveNeighbors > 3) {
                // current cell dies; remove from `this.state.cellLiveSet`; clear area in canvas
                cellLiveSet.delete(coordLive);
            } else if (numberLiveNeighbors === 2 || numberLiveNeighbors === 3) {
                // current cell lives; no change to `this.state.cellLiveSet`; no change in canvas
            }
        }

        let cellNeighbors = this.getNeighbors(this.state.cellLiveSet);
        for (let cellNeighbor of cellNeighbors) {
            let numberLiveNeighbors = this.getNumberLiveNeighbors(cellNeighbor);
            if (numberLiveNeighbors === 3) {
                // current cell lives; add to `cellLive`
                cellLiveSet.add(`${cellNeighbor[0]},${cellNeighbor[1]}`);
            }
        }

        this.setState({
            cellLiveSet: cellLiveSet,
        });
    }

    getNeighbors(coords) {
        let coordsNeighbors = [];
        let visited = new Set();

        for (let coord of coords) {
            coord = this.parseCoordFromSet(coord);
            visited.add(String(coord));
        }

        for (let coord of coords) {
            coord = this.parseCoordFromSet(coord);
            let coordsAdjacent = [
                [coord[0] - 1, coord[1] - 1], // top left
                [coord[0] + 0, coord[1] - 1], // top mid
                [coord[0] + 1, coord[1] - 1], // top right
                [coord[0] - 1, coord[1] + 0], // mid left
                [coord[0] + 1, coord[1] + 0], // mid right
                [coord[0] - 1, coord[1] + 1], // bot left
                [coord[0] + 0, coord[1] + 1], // bot mid
                [coord[0] + 1, coord[1] + 1], // bot right
            ];
            for (let coordAdjacent of coordsAdjacent) {
                if (!visited.has(String(coordAdjacent))) {
                    coordsNeighbors.push(coordAdjacent);
                    visited.add(String(coordAdjacent));
                }
            }
        }
        return coordsNeighbors;
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
            for (let cellLive of this.state.cellLiveSet) {
                cellLive = this.parseCoordFromSet(cellLive);
                if (cellLive[0] === coord[0] && cellLive[1] === coord[1]) {
                    count += 1;
                }
            }
        });
        return count;
    }

    parseCoordFromSet(coord) {
        let [x, y] = coord.split(',');
        return [Number(x), Number(y)];
    }

    componentDidMount() {
        // console.log('CDM');
        this.canvas = this.state.canvasRef.current;
        this.canvasCtx = this.canvas.getContext('2d');

        this.canvas.addEventListener('mousedown', (event) => this.canvasMouseDown(event));
        this.canvas.addEventListener('mousemove', (event) => this.canvasMouseMove(event));
        this.canvas.addEventListener('mouseup', (event) => this.canvasMouseUp(event));

        this.drawActive();
    }

    componentDidUpdate() {
        // console.log({ method: 'CDU', state: this.state, refs: this.refs });
    }

    async canvasMouseDown(event) {
        const cellLiveSet = new Set(this.state.cellLiveSet);

        const currX = Math.floor(event.offsetX / this.state.gridSize);
        const currY = Math.floor(event.offsetY / this.state.gridSize);

        const coordsMapped = [currX * this.state.gridSize, currY * this.state.gridSize];

        if (!this.state.cellLiveSet.has(`${currX},${currY}`)) {
            cellLiveSet.add(`${currX},${currY}`);
            this.canvasCtx.fillRect(coordsMapped[0], coordsMapped[1], this.state.gridSize, this.state.gridSize);
        } else {
            cellLiveSet.delete(`${currX},${currY}`);
            this.canvasCtx.clearRect(coordsMapped[0], coordsMapped[1], this.state.gridSize, this.state.gridSize);
        }

        this.drawGrid();

        await this.setState({
            isDrawing: true,
            cellLiveSet: cellLiveSet,
            lastEdited: `${currX},${currY}`,
        });
    }

    canvasMouseMove(event) {
        const currX = Math.floor(event.offsetX / this.state.gridSize);
        const currY = Math.floor(event.offsetY / this.state.gridSize);

        if (this.state.isDrawing && this.state.lastEdited !== `${currX},${currY}`) {
            const cellLiveSet = new Set(this.state.cellLiveSet);

            const coordsMapped = [currX * this.state.gridSize, currY * this.state.gridSize];

            if (!this.state.cellLiveSet.has(`${currX},${currY}`)) {
                cellLiveSet.add(`${currX},${currY}`);
                this.canvasCtx.fillRect(coordsMapped[0], coordsMapped[1], this.state.gridSize, this.state.gridSize);
            } else {
                cellLiveSet.delete(`${currX},${currY}`);
                this.canvasCtx.clearRect(coordsMapped[0], coordsMapped[1], this.state.gridSize, this.state.gridSize);
            }

            this.drawGrid();

            this.setState({
                cellLiveSet: cellLiveSet,
                lastEdited: `${currX},${currY}`,
            });
        }
    }

    canvasMouseUp(event) {
        this.setState({
            isDrawing: false,
        });
    }

    drawActive() {
        this.canvasCtx.clearRect(0, 0, this.state.canvasSize, this.state.canvasSize);
        for (let coords of this.state.cellLiveSet) {
            coords = this.parseCoordFromSet(coords);
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
                await this.setState({ generation: this.state.generation + 1 });
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
            generation: 0,
            cellLiveSet: this.state.initState,
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
                <h2>Generation: {this.state.generation}</h2>
                <canvas className='canvas' ref={this.state.canvasRef} width={this.state.canvasSize} height={this.state.canvasSize}></canvas>
                <button onClick={() => this.startAnimation()}>Start</button>
                <button onClick={() => this.stopAnimation()}>Stop</button>
                <button onClick={() => this.resetAnimation()}>Reset</button>
            </div>
        );
    }
}

export default Canvas;
