const express = require('express');
const ejs = require('ejs');

const app = express();

const port = 3000;
const hostname = 'localhost';

app.use(express.static('/public'));

app.get('/', (req, res) => {
    res.send('/');
});

app.listen(port, hostname, () => {
    console.log(`app.js listening on http://${hostname}:${port}`);
});
