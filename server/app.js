const express = require('express');

const app = express();

const path = require('path');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// HTML Calls
app.use('/css', express.static(path.join(__dirname, '../src/css')));
app.use('/img', express.static(path.join(__dirname, '../src/img')));

const knownPaths = ['/RP-Interval-Quiz/', '/RP-Interval-Quiz/quiz'];
for (const webPath of knownPaths) {
  app.use(webPath, express.static('./docs', {
    index: 'index.html',
  }));
}

const shortPaths = ['/', '/quiz'];
for (const webPath of shortPaths){
  app.use(webPath, (req, res) => {
    res.redirect(`/RP-Interval-Quiz${webPath}`)
  })
}

module.exports = app;
