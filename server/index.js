const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();



const app = express();

app.use(bodyParser.json());

const MONGO_URI = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASS}@ds237989.mlab.com:37989/spotify-saver`;

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));

app.get('/', (req, res) => {
  res.send('api online');
})

app.post('/api', (req, res) => {
  console.log('heard post', req);
  res.send(JSON.stringify(req.body));
})

app.listen(4000, () => {
  console.log('Server up');
});