const PORT = 443;

const express = require('express');
const path = require('path');
const fs = require('fs');

const privateKey = fs.readFileSync('simempire.fun.pem');
const certificate = fs.readFileSync('simempire.fun.pem');

const app = express();

app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../build/index.html'));
});

https
  .createServer(
    {
      key: privateKey,
      cert: certificate,
    },
    app
  )
  .listen(port);

console.log(`running the server on port ${PORT}`);
