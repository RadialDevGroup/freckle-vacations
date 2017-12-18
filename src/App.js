import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import entries from './freckle';
import calculate from './calculate';

class App extends Component {
  state = {}
  componentDidMount() {
    entries().then( ( entries ) => {
      const { usedHours, remainingHours } = calculate(entries)
      this.setState({usedHours, remainingHours})
    });
  }
  render() {
    const { usedHours = 0, remainingHours = 0 } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Freckle Vacations</h1>
        </header>
        <p className="App-intro">
          You have used {usedHours} hours to date. You have {remainingHours} left.
        </p>
      </div>
    );
  }
}

export default App;
