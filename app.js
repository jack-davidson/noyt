const express = require('express');
const fs = require('fs');
const { spawn } = require('child_process');

function getVideoId(url) {
    return url.replace(/.*v=/, '');
}

const app = express();

const port = 2000;
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
        'public/videos/%(title)s%(id)s.%(ext)s',
        '-f',
        'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
    ]);
    youtubeDL.on('close', () => {
        fs.readdir('public/videos/', 'utf8', (err, fileNames) => {
            fileNames.forEach((fileName) => {
                if (String(fileName).includes(getVideoId(req.body.video_url))) {
                    res.download('public/videos/' + fileName);
                }
            });
        });
    });
});

app.listen(port, hostname, () => {
    console.log(`app.js listening on http://${hostname}:${port}`);
});
