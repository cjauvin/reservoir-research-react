import React from 'react';
import './World.css';

const CELL_SIZE = 28;

const CONFIG = `
......+.......
..............
............#.
.#..#.......#.
.#..#..#......
.#..#..#......
.#.....#......
.#.....#......
.#######......
..............
..............
....#.....#...
....#.....#...
....#.....#...
....#######...
..............
..............
`;

export const CELL_COLOR = {
  '.': 'Black',
  '#': 'Sienna',
  '~': 'DodgerBlue',
  '|': 'LightBlue',
  'o': 'DodgerBlue',
  '+': 'Yellow',
};

class Cell extends React.Component {

  render() {
    const { row, col, char } = this.props;
    return (
      <div className="Cell" style={{
        background: CELL_COLOR[char],
        left: `${CELL_SIZE * col + 1}px`,
        top: `${CELL_SIZE * row + 1}px`,
        width: `${CELL_SIZE - 1}px`,
        height: `${CELL_SIZE - 1}px`,
      }} />
    );
  }
}

export class World extends React.Component {

  state = {
    grid: CONFIG.split('\n').filter(row => row.length > 0).map(row => row.split('')),
    isRunning: false,
    interval: 200,
  }

  stop = () => {
    this.setState({ isRunning: false });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  run = () => {
    this.setState({ isRunning: true });
    let grid = this.state.grid;
    let visited = new Set(); // set of stringified i,j locations
    let toVisit = [[1, grid[0].indexOf('+')]]; // list of [i, j] locations
    let wasModified = false; // detect when to stop

    let drop = () => {
      if (!toVisit.length) {
        // Create new drop
        visited = new Set();
        toVisit = [[1, grid[0].indexOf('+')]];
        wasModified = false;
      }

      let [i, j] = toVisit.pop(); // i, j is the current position of a drop
      visited.add([i, j].toString());
      if (grid[i][j] !== '|') {
        grid[i][j] = '|'; // wet the cell
        wasModified = true;
      }

      grid[i][j] = 'o';
      this.setState({ grid });
      grid[i][j] = '|';

      let isDropping = false;

      if (i + 1 >= grid.length) {
        // Reached bottom: do nothing (but we probably still want to keep dropping!)
        isDropping = true;
      } else if ('.|'.includes(grid[i + 1][j])) {
        // Can go down..
        toVisit.push([i + 1, j]);
        isDropping = true;
      } else {
        if ('.|'.includes(grid[i][j - 1]) && !visited.has([i, j - 1].toString())) {
          // Can go left and never went..
          toVisit.push([i, j - 1]);
          isDropping = true;
        }
        if ('.|'.includes(grid[i][j + 1]) && !visited.has([i, j + 1].toString())) {
          // Can go right and never went..
          toVisit.push([i, j + 1]);
          isDropping = true;
        }
      }

      if (!isDropping) {

        // Here our drop is stopped (not dropping), but we don't know if we need to accumulate
        // water (i.e. turn it into `~``) or simply keep it flowing.. if there are walls on both
        // sides, it means that we are inside a bucket, thus that water can accumulate.

        // Scan for a wall on the left
        let left = j;
        let leftOpen = true;
        while (grid[i][left] !== '#') {
          left -= 1;
          if (left < 0) {
            break;
          }
        }
        if (left >= 0 && '~#'.includes(grid[i + 1][left + 1])) {
          leftOpen = false;
        }

        // Scan for a wall on the right
        let right = j;
        let rightOpen = true;
        while (grid[i][right] !== '#') {
          right += 1;
          if (right >= grid[0].length) {
            break;
          }
        }
        if (right < grid[0].length && '~#'.includes(grid[i + 1][right - 1])) {
          rightOpen = false;
        }

        if (!leftOpen && !rightOpen && grid[i][j] !== '~') {
          // We are inside a bucket, water can accumulate!
          grid[i][j] = '~';
          wasModified = true;
          this.setState({ grid });
        }
      };

      if (wasModified || toVisit.length) {
        this.timeoutHandler = window.setTimeout(() => {
          drop();
        }, this.state.interval);
      } else {
        this.stop();
      }
    }

    this.timeoutHandler = window.setTimeout(() => {
      drop();
    }, this.state.interval);

  }

  handleIntervalChange = (event) => {
    this.setState({ interval: event.target.value });
  }

  handleClear = () => {
    this.setState({
      grid: CONFIG.split('\n').filter(row => row.length > 0).map(row => row.split('')),
    });
  }

  render() {
    const { grid, interval, isRunning } = this.state;
    const width = grid[0].length * CELL_SIZE;
    const height = grid.length * CELL_SIZE;
    return (
      <div>
        <div className="Grid" style={{ width, height, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` }} >
          {grid.map((row, i) => row.map((col, j) => (
            <Cell col={j} row={i} char={col} key={`${i},${j}`} />
          )))}
        </div>
        <div className="controls">
          Update every <input value={interval} onChange={this.handleIntervalChange} /> msec
                    {isRunning ?
            <button className="button" onClick={this.stop}>Stop</button> :
            <button className="button" onClick={this.run}>Run</button>
          }
          <button className="button" onClick={this.handleClear}>Clear</button>
        </div>
      </div>
    );
  }
}