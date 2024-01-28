require('dotenv').config();

var cookieSession = require('cookie-session')
const express = require('express');
const cors = require('cors');
const router = express.Router();

const randomstring = require('randomstring');
const querystring = require('querystring');
const fetch = require('node-fetch');

const tempAccessToken = "BQAC536smkkU-3gVFPn2-MDF7v013f_cn9wgR_UNXKboDhuoZ1mfeJQBmSx8b1XIIc0eqqRkq2wu_Px8_7jdJk1UlTR3xXB2oBQnScOB2JBDzYGm7MuZCRLKn4G8QdnpVT4lzYrci5uX4FFbRAI7BnnsXlR4lO4fU3SlHLvqmuUl_cEwZHDZeinUBeeW40g5rJv156T_EyVChr_Mv-OlsIXcJ1HFiSD0";
let accessToken = undefined;
let refreshToken = undefined;

let home_uri = 'http://localhost:3000';
let redirect_uri = 'http://localhost:8080/spotify/callback';

let userTopArtists = [];
let userSimilarArtists = [];
let userSuggestedEvents = [];
let genreId = undefined;
let subGenreId = undefined;
let main = {};

router.use(cors(
    {
        origin: home_uri,
        credentials: true
    }
));

router.get('/login', (req, res) => {
    console.log("Login called line 25")
    const state = randomstring.generate(16);
    var scope = 'user-read-private user-read-email user-follow-read';
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
                console.log("not ok");
                console.error(response);
                //res.redirect(home_uri);
            }
        })
        .then((data) => {
            console.log({ data });
            accessToken = data.access_token;
            console.log("TOKEN: ", accessToken)
            refreshToken = data.refresh_token;
            console.log(accessToken);
            res.redirect(home_uri);
        })
        .catch(error => {
            console.log(error);
            res.redirect(home_uri);
        })
});

router.get('/check-auth', (req, res) => {
    if (accessToken) {
        res.json({ "accessToken": accessToken });
    } else {
        res.json({ "accessToken": null });
    }
});


router.get('/events', async (req, res) => {
    try {
        const accessHeader = {
            Authorization: 'Bearer ' + tempAccessToken
        }

        const topArtistResponse = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10', { method: 'GET', headers: accessHeader })
        const topArtistData = await topArtistResponse.json();
        console.log("TOPARTISTDATA: ", topArtistData);

        for (let items of topArtistData.items) {
            artistProfile = {};
            artistProfile.name = items.name;
            artistProfile.url = items.external_urls.spotify;
            artistProfile.imgUrl = items.images[0].url;
            artistProfile.genre = items.genres;
            artistProfile.popularity = items.popularity;
            artistProfile.id = items.id
            userTopArtists.push(artistProfile)
        }
        const relatedArtistResponse = await fetch(`https://api.spotify.com/v1/artists/${userTopArtists[0].id}/related-artists`, { method: 'GET', headers: accessHeader })
        const relatedArtistData = await relatedArtistResponse.json();
        for (let artists of relatedArtistData.artists) {
            userSimilarArtists.push(artists.name);
        }

        const ticketmasterArtistResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events?apikey=UXfzaxTVp7lHKoYVS9MkZrFS6aLJvxJh&keyword=${userTopArtists[0].name}&locale=*`)
        const ticketmasterArtistData = await ticketmasterArtistResponse.json();
        subGenreId = ticketmasterArtistData._embedded.events[0].classifications[0].subGenre.id
        genreId = ticketmasterArtistData._embedded.events[0].classifications[0].genre.id;

        const ticketMasterGenreResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events?apikey=UXfzaxTVp7lHKoYVS9MkZrFS6aLJvxJh&locale=*&subGenreId=${subGenreId}&dmaId=324`)
        const ticketmasterGenreData = await ticketMasterGenreResponse.json();
        console.log(`GENRE : ${subGenreId}`)

        for (events of ticketmasterGenreData._embedded.events) {
            let eventProfile = {};
            eventProfile.eventName = events.name;
            eventProfile.venueName = events._embedded.venues[0].name;
            eventProfile.addressLine = events._embedded.venues[0].address.line1;
            eventProfile.city = events._embedded.venues[0].city.name;
            eventProfile.state = events._embedded.venues[0].state.name;
            eventProfile.stateCode = events._embedded.venues[0].state.stateCode;
            if (events.classifications[0].genre.name === 'undefined') {
                eventProfile.genres = 'N/A'
            } else {
                eventProfile.genres = events.classifications[0].genre.name;
            }
            if (events.classifications[0].subGenre.name === 'undefined') {
                eventProfile.subGenre = 'N/A'
            } else {
                eventProfile.subGenre = events.classifications[0].subGenre.name;
            }
            eventProfile.ticketmasterURL = events.url;
            userSuggestedEvents.push(eventProfile);
        }
        main.userTopArtists = (userTopArtists)
        main.userSimilarArtists = (userSimilarArtists)
        main.userSuggestedEvents = (userSuggestedEvents)

        console.log(main)
        res.json(main)

    } catch (e) {
        console.log(e)
    }
})




module.exports = router;