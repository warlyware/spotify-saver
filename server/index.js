const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const redirect_uri = 'http://localhost:4000';
// const redirect_uri = 'https://server-jhdilfwxaj.now.sh';

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
  var scopes = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize' +
  '?response_type=code' +
  '&client_id=' + my_client_id +
  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
  '&redirect_uri=' + encodeURIComponent(redirect_uri));
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