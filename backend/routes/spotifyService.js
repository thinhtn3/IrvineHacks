require('dotenv').config();

const express = require('express');
const router = express.Router();

const randomstring = require('randomstring');
const querystring = require('querystring');
const fetch = require('node-fetch');

let accessToken = undefined;
let refreshToken = undefined;

let home_uri = 'http://localhost:3000';
let redirect_uri = 'http://localhost:8080/spotify/callback';

router.get('/login', (req, res) => {
    const state = randomstring.generate(16);
	var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
    // res.redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:${process.env.PORT}/callback&scope=${scope}`);
});

router.get('/callback', (req, res) => {
    // console.log("Req: " + req.query.code);
    var params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', req.query.code);
    params.append('redirect_uri', redirect_uri);
    
    const header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
    }

    fetch('https://accounts.spotify.com/api/token', { method: 'POST', body: params, headers: header })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log(response);
                res.redirect(home_uri);
            }
        })
        .then(data => {
            accessToken = data.access_token;
            refreshToken = data.refresh_token;
            console.log(accessToken);
            res.redirect(home_uri);
        })
        .catch(error => {
            console.log(error);
            res.redirect(home_uri);
        })
});

// router.get('/check-auth', (req, res) => {
//     if (accessToken) {
//         res.json({ "accessToken": accessToken });
//     } else {
//         res.json({ "accessToken": null });
//     }
// });

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