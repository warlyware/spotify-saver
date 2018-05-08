const Spotify = require('spotify-web-api-node');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();


const REDIRECT_URI = 'http://localhost:4000/callback';
// const REDIRECT_URI = 'https://server-jhdilfwxaj.now.sh/callback';

const spotifyApi = new Spotify({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: REDIRECT_URI
});
const MONGO_URI = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASS}@ds237989.mlab.com:37989/spotify-saver`;

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));

const albumSchmea = mongoose.Schema({
  albumId: String
});

const Album = mongoose.model('Album', albumSchmea);

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('api online');
});

app.get('/login', (req, res) => {
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      // use the access token to access the Spotify Web API
      var token = body.access_token;
      var options = {
        url: 'https://api.spotify.com/v1/users/jmperezperez',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function(error, response, body) {
        console.log(body);
        res.send(`huzzah`, token, body);
      });
    }
    res.send(`fail`);
  });
});

app.get('/callback', (req, res) => {
  const { code } = req.query;
  console.log(code);
  res.send(code);
});

app.get('/api/albums', (req, res) => {
  Album.find((err, albums) => {
    // if (err) return console.error(err);
    // console.log(JSON.stringify(albums));
    // return albums;
    res.send(albums);
  });
});

app.post('/api/saveAlbum', (req, res) => {
  console.log('heard post', req.body);
  const album = new Album({
    albumId: req.body.albumId
  });
  album.save().then((response) => {
    console.log(`Saved to database: ${response}`)
  });
  res.send(`Saved ${JSON.stringify(req.body)}`);
});


app.listen(4000, () => {
  console.log('Server up');
});