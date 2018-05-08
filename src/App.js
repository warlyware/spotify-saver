import React, { Component } from 'react';
import axios from 'axios';
import URL from 'url-parse';

import SpotifyService from './services/Spotify';
import logo from './logo.svg';
import './App.css';

const CLIENT_ID = 'e57d1e4978b04512b596bdca2157263f';
const REDIRECT_URI = 'http://localhost:3000/';
const API_URL = 'http://localhost:4000';
// const API_URL = 'https://server-jhdilfwxaj.now.sh';

function getUrlParams(search) {
  let hashes = search.slice(search.indexOf('?') + 1).split('&')
  let params = {}
  hashes.map(hash => {
      let [key, val] = hash.split('=')
      params[key] = decodeURIComponent(val)
  })

  return params
}

class App extends Component {
  state = {
    albumId: '',
    albums: [],
    accessToken: null,
    userInfo: null
  }

  openSpotifyLoginWindow() {
    const scopes = [
      'user-read-email',
    ];

    const LOGIN_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(scopes.join(' '))}&response_type=token`;
    window.location.assign(LOGIN_URL);
  }

  componentDidMount = () => {
    let urlString = window.location.href.replace('#', '?');
    const params = getUrlParams(urlString);
    console.log(params.access_token);
    if (params.access_token) {
      this.setState({
        accessToken: params.access_token
      });
    }
    this.getUserInfo(params.access_token);
    console.log(this.state.accessToken);
  }

  componentWillMount = () => {
    this.getAlbums();
  }

  getUserInfo = async (accessToken) => {
    const userInfo = await axios.get(`https://api.spotify.com/v1/me`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    this.setState({
      userInfo
    });
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Save It!</h1>
          <button onClick={this.openSpotifyLoginWindow}>Login</button>
        </header>
        <div className="App-intro">
          <p>{JSON.stringify(this.state.userInfo)}</p>
          <input type="text"
          value={this.state.albumId}
          onChange={this.handleInputChange} />
          <button onClick={this.saveAlbum}>Save</button>
        </div>
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
