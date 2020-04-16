const express = require('express');

const app = express();

const path = require('path');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// HTML Calls
app.use('/css', express.static(path.join(__dirname, '../src/css')));
app.use('/img', express.static(path.join(__dirname, '../src/img')));

const knownPaths = ['/', '/quiz'];
for (const webPath of knownPaths) {
  app.use(webPath, express.static('./docs', {
    index: 'app.html',
  }));
}

module.exports = app;
