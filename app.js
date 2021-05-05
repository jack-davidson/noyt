const express = require('express');
const fs = require('fs');
const { spawn } = require('child_process');

function getVideoId(url) {
    return url.replace(/.*v=/, '');
}

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
    const youtubeDL = spawn('youtube-dl', [
        req.body.video_url,
        '-o',
        'public/videos/%(id)s.%(ext)s',
        '-f',
        'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
    ]);
    youtubeDL.on('close', () => {
        res.download('public/videos/' + getVideoId(req.body.video_url) + '.mp4');
    });
});

app.listen(port, hostname, () => {
    console.log(`app.js listening on http://${hostname}:${port}`);
});
