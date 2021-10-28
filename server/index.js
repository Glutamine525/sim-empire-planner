const PORT = 80;
const SECURE_PORT = 443;

const https = require('https');
const express = require('express');
const path = require('path');
const fs = require('fs');

const privateKey = fs.readFileSync('simempire.fun.key');
const certificate = fs.readFileSync('simempire.fun.pem');

const httpApp = express();
httpApp.all('*', (req, res) => {
  const { path } = req;
  res.redirect(301, `https://www.simempire.fun${path}`);
});
httpApp.listen(PORT);

const httpsApp = express();
httpsApp.use(express.static(path.join(__dirname, '../build')));
httpsApp.get('*', (req, res) => {
  console.log(req);
  res.sendFile(path.join(__dirname, '/../build/index.html'));
});

https
  .createServer(
    {
      key: privateKey,
      cert: certificate,
    },
    httpsApp
  )
  .listen(SECURE_PORT);

console.log(`running the server on port ${PORT}, ${SECURE_PORT}`);
