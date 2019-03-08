import React, { Component } from 'react';
import { World, CELL_COLOR } from './World';

class App extends Component {

  render() {

    return (
      <div>
        <h1>Reservoir Research</h1>
        <p>This is an interactive solution for the <a href="https://adventofcode.com/2018/day/17">Day 17 problem</a> of the <a href="https://adventofcode.com/2018">Advent of Code 2018</a>.
The goal is to create an algorithm to simulate the drop of water flowing through sand (<span style={{color: CELL_COLOR['.']}}>&#9632;</span>) from a faucet (<span style={{color: CELL_COLOR['+']}}>&#9632;</span>). The sand hides a set of weirdly arranged clay buckets (<span style={{color: CELL_COLOR['#']}}>&#9632;</span>). The flowing water wets the sand (<span style={{color: CELL_COLOR['|']}}>&#9632;</span>), accumulates in clay buckets (<span style={{color: CELL_COLOR['~']}}>&#9632;</span>), and overflows out of them, until it reaches the bottom.
        </p>
        <World />
      </div>
    );
  }
}

export default App;
