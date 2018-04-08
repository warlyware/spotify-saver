const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const creds = require('../../creds.json');

const app = express();

app.use(bodyParser.json());

const MONGO_URI = `mongodb://${creds.username}:${creds.password}@ds237989.mlab.com:37989/spotify-saver`;

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));

app.listen(4000, () => {
  console.log('Server up');
});