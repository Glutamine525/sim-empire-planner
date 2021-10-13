const PORT = 80;

const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../build/index.html'));
});
app.listen(PORT);

console.log(`running the server on port ${PORT}`);
