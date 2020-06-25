import React, { Component } from 'react';

class Canvas extends Component {
    constructor() {
        super();
        this.state = {
            canvasCurr: 'canvas1',
            canvasRef1: React.createRef(),
            canvasRef2: React.createRef(),
            canvasSize: 400,
            cellLiveSet: new Set(),
            fps: 500, // new frame every ${fps} / 1000 seconds
            generation: 0,
            gridSize: 20,
            initState: new Set(),
            isAnimating: false,
            isDrawing: false,
            isPaused: false,
            lastEdited: null,
            timePrev: 0,
        };

        this.timePrev = null;
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

        let cellNeighbors = this.getDeadNeighbors(this.state.cellLiveSet);
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

    getDeadNeighbors(coords) {
        /*
        
        Time Complexity:  O(?)
        Space Complexity: O(?)

        Input:  [x, y] -> (array)
        Output: [x, y] -> (array)

        Returns an array of the dead neighbors next to the cells
        in the input coordinates

        */
        let coordsNeighbors = [];

        let visited = new Set();
        for (let coord of coords) {
            visited.add(coord);
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
                if (!visited.has(`${coordAdjacent[0]},${coordAdjacent[1]}`)) {
                    coordsNeighbors.push(coordAdjacent);
                    visited.add(String(coordAdjacent));
                }
            }
        }
        return coordsNeighbors;
    }

    getNumberLiveNeighbors(coords) {
        /*
        
        Time Complexity:  O(1)
        Space Complexity: O(1)

        Input:  [x, y] -> (array)
        Output:      n -> (int)

        Returns the number of neighbors that are alive

        */
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
            if (this.state.cellLiveSet.has(`${coord[0]},${coord[1]}`)) {
                count += 1;
            }
        });

        return count;
    }

    parseCoordFromSet(coord) {
        /*

        Time Complexity:  O(1)
        Space Complexity: O(1)

        Input:   `x,y` -> (str)
        Output: [x, y] -> (array)

        Returns an array of coordinates by parsing a string containing
        coordinates separated by a comma

        */
        let [x, y] = coord.split(',');
        return [Number(x), Number(y)];
    }

    componentDidMount() {
        this.canvas1 = this.state.canvasRef1.current;
        this.canvasCtx1 = this.canvas1.getContext('2d');

        this.canvas2 = this.state.canvasRef2.current;
        this.canvasCtx2 = this.canvas2.getContext('2d');

        this.canvas1.addEventListener('mousedown', this.canvasMouseDown);
        this.canvas1.addEventListener('mousemove', this.canvasMouseMove);
        this.canvas1.addEventListener('mouseup', this.canvasMouseUp);
        this.canvas2.addEventListener('mousedown', this.canvasMouseDown);
        this.canvas2.addEventListener('mousemove', this.canvasMouseMove);
        this.canvas2.addEventListener('mouseup', this.canvasMouseUp);

        this.drawGrid(this.canvasCtx1);
    }

    canvasMouseDown = async (event) => {
        if (!this.state.isAnimating) {
            const canvasCtx = this.state.canvasCurr === 'canvas1' ? this.canvasCtx1 : this.canvasCtx2;
            const cellLiveSet = new Set(this.state.cellLiveSet);

            const currX = Math.floor(event.offsetX / this.state.gridSize);
            const currY = Math.floor(event.offsetY / this.state.gridSize);

            const coordsMapped = [currX * this.state.gridSize, currY * this.state.gridSize];

            if (!this.state.cellLiveSet.has(`${currX},${currY}`)) {
                cellLiveSet.add(`${currX},${currY}`);
                canvasCtx.fillRect(coordsMapped[0], coordsMapped[1], this.state.gridSize, this.state.gridSize);
            } else {
                cellLiveSet.delete(`${currX},${currY}`);
                canvasCtx.clearRect(coordsMapped[0], coordsMapped[1], this.state.gridSize, this.state.gridSize);
            }

            this.drawGrid(canvasCtx);

            await this.setState({
                isDrawing: true,
                cellLiveSet: cellLiveSet,
                lastEdited: `${currX},${currY}`,
            });
        }
    };

    canvasMouseMove = async (event) => {
        if (!this.state.isAnimating) {
            const canvasCtx = this.state.canvasCurr === 'canvas1' ? this.canvasCtx1 : this.canvasCtx2;

            const currX = Math.floor(event.offsetX / this.state.gridSize);
            const currY = Math.floor(event.offsetY / this.state.gridSize);

            if (this.state.isDrawing && this.state.lastEdited !== `${currX},${currY}`) {
                const cellLiveSet = new Set(this.state.cellLiveSet);

                const coordsMapped = [currX * this.state.gridSize, currY * this.state.gridSize];

                if (!this.state.cellLiveSet.has(`${currX},${currY}`)) {
                    cellLiveSet.add(`${currX},${currY}`);
                    canvasCtx.fillRect(coordsMapped[0], coordsMapped[1], this.state.gridSize, this.state.gridSize);
                } else {
                    cellLiveSet.delete(`${currX},${currY}`);
                    canvasCtx.clearRect(coordsMapped[0], coordsMapped[1], this.state.gridSize, this.state.gridSize);
                }

                this.drawGrid(canvasCtx);

                this.setState({
                    cellLiveSet: cellLiveSet,
                    lastEdited: `${currX},${currY}`,
                });
            }
        }
    };

    canvasMouseUp = async (event) => {
        if (!this.state.isAnimating) {
            this.setState({
                isDrawing: false,
            });
        }
    };

    drawActive(canvasCtx) {
        canvasCtx.clearRect(0, 0, this.state.canvasSize, this.state.canvasSize);
        for (let coords of this.state.cellLiveSet) {
            coords = this.parseCoordFromSet(coords);
            let coordsMapped = [coords[0] * this.state.gridSize, coords[1] * this.state.gridSize];
            canvasCtx.fillRect(coordsMapped[0], coordsMapped[1], this.state.gridSize, this.state.gridSize);
        }
        this.drawGrid(canvasCtx);
    }

    drawGrid(canvasCtx) {
        /*
        drawGrid(context) draws gridlines spaced out according
        to `this.state.gridSize` that fits in a square with the
        size `this.state.canvasSize`
        */

        // draw vertical grid lines
        canvasCtx.strokeStyle = '#C0C0C0';

        for (let x = this.state.gridSize; x < this.state.canvasSize; x += this.state.gridSize) {
            canvasCtx.moveTo(x, 0);
            canvasCtx.lineTo(x, this.state.canvasSize);
            canvasCtx.stroke();
        }

        // draw horizontal grid lines
        for (let y = this.state.gridSize; y < this.state.canvasSize; y += this.state.gridSize) {
            canvasCtx.moveTo(0, y);
            canvasCtx.lineTo(this.state.canvasSize, y);
            canvasCtx.stroke();
        }
    }

    async animateStep(timestamp) {
        if (this.timePrev === null || this.timePrev === undefined) {
            this.timePrev = timestamp;
        }
        if (this.state.isAnimating) {
            this.rAF = requestAnimationFrame(this.animateStep.bind(this));
            const timePassed = Math.floor(timestamp - this.timePrev);
            if (timePassed >= this.state.fps) {
                this.algoGameOfLife();
                this.drawActive(this.state.canvasCurr === 'canvas1' ? this.canvasCtx2 : this.canvasCtx1);
                this.timePrev = timestamp;
                await this.setState({
                    generation: this.state.generation + 1,
                    canvasCurr: this.state.canvasCurr === 'canvas1' ? 'canvas2' : 'canvas1',
                    timePrev: timestamp,
                });
            }
        }
    }

    async clearAnimation() {
        this.timePrev = 0;
        await this.setState({
            isAnimating: false,
            generation: 0,
            cellLiveSet: new Set(),
        });

        this.drawActive(this.canvasCtx1);
        this.drawActive(this.canvasCtx2);
    }

    async pauseAnimation() {
        if (this.state.isAnimating) {
            this.timePrev = 0;
            await this.setState({ isAnimating: false, isPaused: true });
        }
    }

    async resetAnimation() {
        await this.setState({
            isAnimating: false,
            generation: 0,
            cellLiveSet: this.state.initState,
        });

        this.drawActive(this.canvasCtx1);
        this.drawActive(this.canvasCtx2);
    }

    async resumeAnimation() {
        if (!this.state.isAnimating) {
            await this.setState({ isAnimating: true, isPaused: false });
            this.animateStep();
        }
    }

    async startAnimation() {
        if (!this.state.isAnimating) {
            await this.setState({ isAnimating: true, initState: this.state.cellLiveSet });
            this.animateStep();
        }
    }

    async stepAnimation() {
        await this.algoGameOfLife();
        this.drawActive(this.state.canvasCurr === 'canvas1' ? this.canvasCtx1 : this.canvasCtx2);
    }

    async stopAnimation() {
        if (this.state.isAnimating) {
            this.timePrev = 0;
            await this.setState({ isAnimating: false });
        }
    }

    render() {
        return (
            <div>
                <h2>Generation: {this.state.generation}</h2>
                <canvas className='canvas1' style={{ display: this.state.canvasCurr === 'canvas1' ? 'flex' : 'none' }} ref={this.state.canvasRef1} width={this.state.canvasSize} height={this.state.canvasSize}></canvas>
                <canvas className='canvas2' style={{ display: this.state.canvasCurr === 'canvas2' ? 'flex' : 'none' }} ref={this.state.canvasRef2} width={this.state.canvasSize} height={this.state.canvasSize}></canvas>
                <button onClick={() => this.startAnimation()}>Start</button>
                <button onClick={() => this.stepAnimation()}>Step</button>
                <button onClick={() => this.stopAnimation()}>Stop</button>
                <button onClick={() => this.resetAnimation()}>Reset</button>
                <button onClick={() => this.clearAnimation()}>Clear</button>
            </div>
        );
    }
}

export default Canvas;
