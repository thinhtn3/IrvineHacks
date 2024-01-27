import React, { useEffect, useState } from 'react'


const Home = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/spotify/check-auth")
        .then(response => response.json())
        .then(data => {
            if (data.accessToken) {
                setLoggedIn(true);
            }})
        .catch(error => {console.log(error)})
    }, [])

    return (
        <div>
            <h1>Spotify Auth Testing</h1>
            {loggedIn ? <p>logged in</p> : <a href="http://localhost:8080/spotify/login">Login with Spotify</a>}
        </div>
    )
}

export default Home