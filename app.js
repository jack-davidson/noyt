const express = require('express');
const youtubeDl = require('youtube-dl-exec');
const fs = require('fs');

const app = express();

const port = 3000;
const hostname = 'localhost';

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }))

app.set('views', 'templates');
app.set('view engine', 'ejs');

app.get('/', (_, res) => {
    res.render('index.ejs', {});
});

app.post('/video', (req, res) => {
    youtubeDl(req.body.video_url, {
        dumpJson: true,
        noCallHome: true,
        format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4'
    }).then((output) => {
        res.send(`
        <a href=\"${'public/videos/' + output['title'] + '.' + output['ext']}\" download>click here to download your video</a>
        `)
    });
});

app.listen(port, hostname, () => {
    console.log(`app.js listening on http://${hostname}:${port}`);
});
