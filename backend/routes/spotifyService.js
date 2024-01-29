require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const router = express.Router();

const randomstring = require("randomstring");
const querystring = require("querystring");
const fetch = require("node-fetch");

const tempAccessToken =
  "BQDGkzB3WSbUQaC0l0Hmw2FXY_HCPwVVxb_E1Ggji08nSEc4_O6LG-dgX1J2Gme_yb5klI_Fjsdvbrt3YfWWPylJ0cEPBgg3iCj9HtOx3Mt_wa_1Y_mJU3MEXJ-iPpIATeT_UX-2-1dvHbZMLG3IFftDTxGMBpL0XUUI0qUmT1SwLnYvMUgL-II5u5jPVdo39CRymzQjLxM5NaYLkZWCbbHvjxtzGGn9";
// let accessToken = undefined;
let refreshToken = undefined;

let home_uri = "http://localhost:3000";
let redirect_uri = "http://localhost:8080/spotify/callback";

let userTopArtists = [];
let userSimilarArtists = [];
let userSuggestedEvents = [];
let genreId = undefined;
let subGenreId = undefined;
let main = {};

router.use(cookieParser());

router.use(
  cors({
    origin: home_uri,
    credentials: true,
  })
);

router.get("/login", (req, res) => {
  console.log("Login called line 25");
  const state = randomstring.generate(16);
  var scope =
    "user-read-private user-read-email user-follow-read user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
  // res.redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:${process.env.PORT}/callback&scope=${scope}`);
});

router.get("/callback", (req, res) => {
  console.log("Req: " + req.query.code);
  var params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", req.query.code);
  params.append("redirect_uri", redirect_uri);

  const header = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " +
      new Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
      ).toString("base64"),
  };

  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: params,
    headers: header,
  })
    .then((response) => {
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
      // accessToken = data.access_token;
      console.log("TOKEN: ", data.access_token);
      refreshToken = data.refresh_token;

      res.cookie("accessToken", data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax", // Can be 'Strict', 'Lax', or 'None'
        path: "/",
        maxAge: 3600000,
      });

      res.redirect(home_uri);
    })
    .catch((error) => {
      console.log(error);
      alert("Error: " + error);
      res.redirect(home_uri);
    });
});

router.get("/check-auth", (req, res) => {
  const aT = req.cookies.accessToken;
  console.log("Access Token: ", aT);

  if (aT) {
    res.json({ accessToken: true });
  } else {
    res.json({ accessToken: false });
  }
});

router.get("/aboutMe", async (req, res) => {
  const aT = req.cookies.accessToken;
  console.log("Access Token /aboutMe: ", aT);

  try {
    const accessHeader = {
      Authorization: "Bearer " + aT,
    };

    const aboutMeResponse = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: accessHeader,
    });
    const aboutMeData = await aboutMeResponse.json();
    res.json(aboutMeData);
    console.log("About information retrieved!");
    console.log(aboutMeData);
  } catch (e) {
    console.log("No about me information found");
    console.log(e);
    throw e;
  }
});

router.get("/events", async (req, res) => {
  const aT = req.cookies.accessToken;
  console.log("Access Token /events: ", aT);

  let userTopArtists = [];
  let userSimilarArtists = [];
  let userSuggestedEvents = [];
  let duplicate = [];
  let main = {};

  try {
    const accessHeader = {
      Authorization: "Bearer " + aT,
    };

    const topArtistResponse = await fetch(
      "https://api.spotify.com/v1/me/top/artists?limit=10",
      { method: "GET", headers: accessHeader }
    );
    const topArtistData = await topArtistResponse.json();
    for (let items of topArtistData.items) {
      artistProfile = {};
      artistProfile.name = items.name;
      artistProfile.url = items.external_urls.spotify;
      artistProfile.imgUrl = items.images[0].url;
      artistProfile.genre = items.genres;
      artistProfile.popularity = items.popularity;
      artistProfile.id = items.id;
      userTopArtists.push(artistProfile);
    }
    main.userTopArtists = userTopArtists;

    // console.log("UTA: ", userTopArtists);
    const relatedArtistResponse = await fetch(
      `https://api.spotify.com/v1/artists/${userTopArtists[0].id}/related-artists`,
      { method: "GET", headers: accessHeader }
    );
    const relatedArtistData = await relatedArtistResponse.json();

    for (let artists of relatedArtistData.artists) {
      let artistProfile = {};
      artistProfile.name = artists.name;
      artistProfile.url = artists.external_urls.spotify;
      artistProfile.imgUrl = artists.images[0].url;
      artistProfile.genre = artists.genres;
      artistProfile.popularity = artists.popularity;
      artistProfile.id = artists.id;
      userSimilarArtists.push(artistProfile);
    }
    main.userSimilarArtists = userSimilarArtists;

    for (let i = 0; i < 4; i++) {
      const ticketmasterArtistResponse = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events?apikey=RaIbBT6IfoziuiyuX8Al4XQ10qyp97Ra&keyword=${userTopArtists[i].name}&locale=*`
      );
      const ticketmasterArtistData = await ticketmasterArtistResponse.json();
      // console.log(userTopArtists[i]);
      // console.log(ticketmasterArtistData.page.totalPages);

      if (ticketmasterArtistData.page && ticketmasterArtistData.page.totalPages !== 0) {
        console.log(ticketmasterArtistData._embedded.events[0])
        subGenreId =
          ticketmasterArtistData._embedded.events[0].classifications[0].subGenre
            .id;
        genreId =
          ticketmasterArtistData._embedded.events[0].classifications[0].genre
            .id;
        const ticketMasterGenreResponse = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events?apikey=RaIbBT6IfoziuiyuX8Al4XQ10qyp97Ra&locale=*&subGenreId=${subGenreId}&dmaId=324`
        );
        const ticketmasterGenreData = await ticketMasterGenreResponse.json();

        for (events of ticketmasterGenreData._embedded.events) {
          if (duplicate.includes(events.id) === false) {
            let eventProfile = {};
            eventProfile.eventName = events.name;
            eventProfile.id = events.id;
            duplicate.push(events.id);
            eventProfile.localDate = events.dates.start.localDate;
            eventProfile.imgUrl = events.images[1].url;
            if (events.priceRanges) {
              eventProfile.min = events.priceRanges[0].min;
              eventProfile.max = events.priceRanges[0].max;
              eventProfile.currency = events.priceRanges[0].currency;
            }

            eventProfile.venueName = events._embedded.venues[0].name;
            eventProfile.addressLine = events._embedded.venues[0].address.line1;
            eventProfile.city = events._embedded.venues[0].city.name;
            eventProfile.state = events._embedded.venues[0].state.name;
            eventProfile.stateCode = events._embedded.venues[0].state.stateCode;
            if (events.classifications[0].genre.name === "undefined") {
              eventProfile.genres = "N/A";
            } else {
              eventProfile.genres = events.classifications[0].genre.name;
            }
            if (events.classifications[0].subGenre.name === "undefined") {
              eventProfile.subGenre = "N/A";
            } else {
              eventProfile.subGenre = events.classifications[0].subGenre.name;
            }
            eventProfile.ticketmasterURL = events.url;
            userSuggestedEvents.push(eventProfile);
          }
        }
      }
      main.userSuggestedEvents = userSuggestedEvents;
    }

    console.log(main);
    res.json(main);
  } catch (e) {
    console.log("No events found");
    console.log(e);
    throw e;
  }
  // console.log(main)
});

module.exports = router;
