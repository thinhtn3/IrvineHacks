require('dotenv').config();
const express = require('express');
const app = express();
const spotifyRoutes = require('./routes/spotifyService');
const cookieParser = require('cookie-parser');

// const randomstring = require('randomstring');
// const fetch = require('node-fetch')
let accessToken = undefined;
let refreshToken = undefined;
const spotifyservice = require("./routes/spotifyService.js")

app.use('/spotify', spotifyservice);
// middleware that will trigger for every request that comes in
app.use(express.json()); // if anty requests come in, parse json data from request body and attatch to request object
app.use(cookieParser())
app.use((req, res, next) => {
    console.log(`${req.path}, ${req.method}`); // log the path and method of each request
    next(); // move on to the next middleware
})



app.use('/spotify', spotifyRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`);
    // console.log(process.env.SPOTIFY_CLIENT_ID);

})