import React, { Component } from 'react';
import axios from 'axios';

import logo from './logo.svg';
import './App.css';

const API_URL = 'https://server-jhdilfwxaj.now.sh';

class App extends Component {
  state = {
    albumId: '',
    albums: []
  }

  componentWillMount = () => {
    this.getAlbums();
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
      const response = await axios.post(`${API_URL}/api/saveAlbum`, {
          albumId: this.state.albumId
        }, {
        headers: {
          'content-type': 'application/json'
        }
      });
      this.displaySavedNotification();
      this.getAlbums();
    } catch (error) {
      console.error(`problem saving album: ${this.state.albumId}`)
    }
  }

  getAlbums = async () => {
    const response = await axios.get(`${API_URL}/api/albums`);

    this.setState({
      albums: response.data
    });
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
        <ul>
          {this.state.albums ?
          this.state.albums.map((album) => {
            console.log(album);
            const albumUrl = `https://open.spotify.com/album/${album.albumId}`
            return (
              <li key={album._id}>
                <a target="_blank" href={albumUrl}>{album.albumId}</a>
              </li>
            );
          }):
          null}
        </ul>
      </div>
    );
  }
}

export default App;
