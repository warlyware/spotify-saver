import React, { Component } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet'
import URL from 'url-parse';

import logo from './logo.svg';
import './App.css';

const API_URL = 'https://server-jhdilfwxaj.now.sh';

class App extends Component {
  state = {
    albumId: '',
    albums: []
  }

  // loadFirebase = () => {
  //   const config = {
  //     apiKey: "AIzaSyBK3nBOrN244-Vsc0Br3mcb9fM3NNGhY7o",
  //     authDomain: "spotify-saver-270db.firebaseapp.com",
  //     databaseURL: "https://spotify-saver-270db.firebaseio.com",
  //     projectId: "spotify-saver-270db",
  //     storageBucket: "",
  //     messagingSenderId: "24735464294"
  //   };
  //   firebase.initializeApp(config);
  // }

  componentWillMount = () => {
    this.getAlbums();
  }

  componentDidMount = () => {
    // this.loadFirebase();
  }

  displaySavedNotification = () => {
    console.log(`album saved: ${this.state.albumId}`);
  }

  handleInputChange = (event) => {
    this.setState({
      albumId: event.target.value,
    });
  }

  scrubAlbumId = () => {
    const { pathname } = new URL(this.state.albumId);
    return pathname ? pathname.replace('/album/', '') : this.state.albumId;
  }

  saveAlbum = async () => {
    const scrubbedAlbumId = this.scrubAlbumId();
    console.log(scrubbedAlbumId);
    try {
      const response = await axios.post(`${API_URL}/api/saveAlbum`, {
          albumId: scrubbedAlbumId
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
        <Helmet>
          <script src="https://www.gstatic.com/firebasejs/4.13.0/firebase.js"></script>
        </Helmet>
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
