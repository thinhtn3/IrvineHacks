const express = require('express');
const router = express.Router();

const randomstring = require('randomstring');
const fetch = require('node-fetch');

let accessToken = undefined;
let refreshToken = undefined;

router.get('/login', (req, res) => {
    const state = randomstring.generate(16);
    const scope = 'user-read-private%20user-read-email%20user-top-read%20user-read-playback-state%20user-read-currently-playing';
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:${process.env.PORT}/callback&scope=${scope}`);
});

router.get('/callback', (req, res) => {
    var params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', req.query.code);
    params.append('redirect_uri',`http://localhost:${process.env.PORT}/callback`);

    const header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
    }
    fetch('https://accounts.spotify.com/api/token', { method: 'POST', body: params, headers: header })
        .then(response => response.json())
        .then(data => {
            accessToken = data.access_token;
            console.log(accessToken);
            res.send(accessToken);
        })
});

router.get('/genres', (req, res) => {
    const accessHeader = {
        Authorization: 'Bearer ' + accessToken
    }
    fetch('https://api.spotify.com/v1/me/top/artists?limit=50', { method: 'GET', headers: accessHeader })
        .then(response => response.json())
        .then(data =>{
            for (let items of data.items){
                console.log(items.genres)
            }
        })
})





module.exports = router;