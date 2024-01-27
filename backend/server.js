require('dotenv').config();
//console.log(process.env)
const express = require('express');
const app = express();
const randomstring = require('randomstring');
const fetch = require('node-fetch')
let accessToken = undefined;
let refreshToken = undefined;

app.listen(8080, () => {
    console.log('Server started on 8080');
    // console.log(process.env.SPOTIFY_CLIENT_ID);

})

app.get('/login', (req, res) => {
    const state = randomstring.generate(16);
    const scope = 'user-read-private%20user-read-email%20user-top-read%20user-read-playback-state%20user-read-currently-playing';
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:8080/callback&scope=${scope}`);
})

app.get('/callback', (req, res) => {
    var params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', req.query.code);
    params.append('redirect_uri', 'http://localhost:8080/callback');



    const header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
    }
    fetch('https://accounts.spotify.com/api/token', { method: 'POST', body: params, headers: header })
        .then(response => response.json())
        .then(data => {
            accessToken = data.access_token;
            res.redirect('/genres')
        })
})

app.get('/genres', (req, res) => {
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
