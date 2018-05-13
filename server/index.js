const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

if (process.env.NODE_ENV==='production') {
  const REDIRECT_URI = 'https://server-jhdilfwxaj.now.sh/callback';
} else {
  require('dotenv').config();
  const REDIRECT_URI = 'http://localhost:4000/callback';
}

const MONGO_URI = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASS}@ds237989.mlab.com:37989/spotify-saver`;

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));

const albumSchmea = mongoose.Schema({
  albumId: String,
  albumInfo: Object
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

app.get('/callback', (req, res) => {
  console.log(req.params);
  res.redirect(`http://localhost:3000/user/${req.params.accessToken}/${req.params.refreshToken}`);
});

app.post('/api/saveAlbum', (req, res) => {
  console.log('heard post', req.body);
  const album = new Album({
    albumId: req.body.albumId,
    albumInfo: req.body.albumInfo
  });
  album.save().then((response) => {
    console.log(`Saved to database: ${response}`)
  });
  res.send(`Saved ${JSON.stringify(req.body)}`);
});


app.listen(4000, () => {
  console.log('Server up');
});