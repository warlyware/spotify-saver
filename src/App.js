import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';

class App extends Component {
  state = {
    albumId: ''
  }

  displaySavedNotification = () => {
    console.log(`album saved: ${this.state.albumId}`);
  }

  handleInputChange = (event) => {
    this.setState({
      albumId: event.target.value,
    });
  }

  saveAlbum = async () => {
    try {
      const response = await axios.post('/api/saveAlbum', {
        body: {
          albumId: this.state.albumId
        },
        headers: {
          'content-type': 'application/json'
        }
      });
      this.displaySavedNotification();
    } catch (error) {
      console.error(`problem saving album: ${this.state.albumId}`)
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Save It!</h1>
        </header>
        <p className="App-intro">
          <input type="text"
          value={this.state.albumId}
          onChange={this.handleInputChange} />
          <button onClick={this.saveAlbum}>Save</button>
        </p>
      </div>
    );
  }
}

export default App;
