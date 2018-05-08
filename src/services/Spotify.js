import { LOGIN_WINDOW_OPTIONS, LOGIN_URL } from '../constants/login';

class SpotifyService {
  login = (callback) => {
    window.addEventListener("message", function(event) {
      debugger;
      var hash = JSON.parse(event.data);
      if (hash.type === 'access_token') {
        callback(hash.access_token);
      }
    }, false);

    window.open(LOGIN_URL,
      'Spotify',
      LOGIN_WINDOW_OPTIONS
    );
  }
}

export default new SpotifyService();