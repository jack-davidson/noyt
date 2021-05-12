const express = require('express');
const { spawn } = require('child_process');
const { existsSync } = require('fs');

function getVideoId(serializedURL) {
    /* create a url object, removing the leading world wide web subdomain */
    videoURL = new URL(serializedURL.replace(/www\./, ''));

    /* The id is extracted in a different way depending on the url.
     *
     * If the url's hostname is youtube.com, the uri format looks like so:
     *     youtube.com/watch?v=<id>
     *
     * If the url's hostname is youtu.be, the uri format looks like so:
     *     youtu.be/<id>
     *
     * This means that the id must be extracted in different ways.
     * For youtube.com, the id is found by getting the 'v' key from
     * the search parameters.
     * For youtu.be, the id is found simply by getting the pathname.
     */
    if (videoURL.hostname == 'youtube.com')
        return videoURL.searchParams.get('v');
    else if (videoURL.hostname == 'youtu.be')
        return videoURL.pathname;
}

function youtubeDl(videoURL, callback) {
    id = getVideoId(videoURL);
    videoPath = 'public/videos/' + id + '.mp4';

    /* If file has already been downloaded, return callback(path).
     * Otherwise, download video and return callback(path).  */
    if (existsSync(videoPath)) {
        return callback(videoPath)
    } else {
        return spawn(
            'youtube-dl', [
                '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4', /* Format setting.             */
                'https://youtube.com/watch?v=' + id,               /* Url of video source.        */
                '-o', videoPath,                                   /* Download video to location. */
            ]
        ).on('close', () => { /* When download is finished, return callback. */
            callback(videoPath)
        });
    }
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
    youtubeDl(req.body.video_url, (videoPath) => {
        res.download(videoPath);
    })
});

app.listen(port, hostname, () => {
    console.log(`app.js listening on http://${hostname}:${port}`);
});
