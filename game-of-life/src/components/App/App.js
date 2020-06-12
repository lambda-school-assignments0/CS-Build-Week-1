import React, {Component} from 'react';
import './App.css';

class App extends Component {
  componentDidMount() {
    var canvas = document.getElementById("test");
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");

      ctx.fillStyle = "rgb(200, 0, 0)";
      ctx.fillRect(10, 10, 50, 50);

      ctx.fillStyle = "rgb(0, 0, 200, 0.5)";
      ctx.fillRect(30, 30, 50, 50);


      ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.lineWidth = 0;

      const gridSize = 10;

      for (let x = gridSize; x < 250; x+=gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 250);
        ctx.stroke();
      }

      for (let y = gridSize; y < 250; y+=gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(250, y);
        ctx.stroke();
      }
    }
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Conway's Game of Life</h1>
          <canvas id="test" width="250" height="250"></canvas>
        </header>
      </div>
    );
  }
}

export default App;
