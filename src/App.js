import React, { Component } from 'react';
import World from './World';

class App extends Component {

  render() {

    return (
      <div className="App">
        <h1 style={{"textAlign": "center"}}>Reservoir Research</h1>
        <World />
      </div>
    );
  }
}

export default App;
