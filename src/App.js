import React, { Component } from 'react';
import axios from 'axios';
import URL from 'url-parse';

import logo from './logo.svg';
import loader from './three-dots.svg';
import { getUrlParams } from './utils';
import './App.css';

const CLIENT_ID = 'e57d1e4978b04512b596bdca2157263f';
const REDIRECT_URI = 'https://spotify-saver-270db.firebaseapp.com';
const API_URL = 'https://server-mkzeovfyzt.now.sh';

class App extends Component {
  state = {
    albumId: '',
    albums: [],
    accessToken: null,
    userInfo: null,
    isLoading: false
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
    return pathname.indexOf('/album') > - 1 ? pathname.replace('/album/', '') : this.state.albumId;
  }

  saveAlbum = async () => {
    this.setState({ isLoading: true });
    const scrubbedAlbumId = this.scrubAlbumId();
    console.log(scrubbedAlbumId);
    const albumInfo = await this.getAlbumInfo(scrubbedAlbumId);
    try {
      const response = await axios.post(`${API_URL}/api/saveAlbum`, {
          albumId: scrubbedAlbumId,
          albumInfo: albumInfo.data
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
    this.setState({
      albumId: '',
      isLoading: false
    });
  }

  getAlbums = async () => {
    this.setState({
      isLoading: true
    });
    const response = await axios.get(`${API_URL}/api/albums`);

    this.setState({
      albums: response.data,
      isLoading: false
    });
  }

  getAlbumInfo = async (albumId) => {
    const albumInfo = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        "Authorization": `Bearer ${this.state.accessToken}`
      }
    });
    return albumInfo;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Save It!</h1>
          {this.state.accessToken ?
            null :
            <button onClick={this.openSpotifyLoginWindow}>Login</button>
          }
        </header>
        <div className="loader-wrapper">
          {this.state.isLoading ?
          <img className="loader" src={loader} alt="loader" />
            : null
          }
        </div>
        <div className="input-wrapper">
          <input type="text"
          value={this.state.albumId}
          onChange={this.handleInputChange} />
          <button onClick={this.saveAlbum}>Save</button>
        </div>
        <ul>
          {this.state.albums ?
          this.state.albums.map((album) => {
            console.log(album);
            const albumUrl = `https://open.spotify.com/album/${album.albumId}`;
            const artist = album.albumInfo ? album.albumInfo.artists[0].name : null;
            const name = album.albumInfo ? album.albumInfo.name : album.albumId;
            return (
              <li key={album._id}>
                <a target="_blank" href={albumUrl}>{artist} - {name}</a>
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
