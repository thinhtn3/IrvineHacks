import React, { useEffect, useState, useCallback } from 'react'
import Cookies from 'js-cookie'
import { Button, ButtonGroup } from '@chakra-ui/react'

const Home = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/spotify/check-auth")
            .then(response => response.json())
            .then(data => {
                console.log("Here: ", data);
                if (data.accessToken) {
                    setLoggedIn(true);
                    console.log(loggedIn)
                    Cookies.set('accessToken', data.accessToken);

                }
            })
            .catch(error => { console.log(error) })
    }, [])

    const handleGetGenre = useCallback(() => {
        fetch("http://localhost:8080/spotify/events")
            .then(response => response.json())
            .then(data => { console.log(data) })
            .catch(error => { console.log("EWWW: " + error) })
    }, []);

    return (
        <div>
            <h1>Spotify Auth Testing</h1>
            {loggedIn ? <p>logged in</p> : <a href="http://localhost:8080/spotify/login">Login with Spotify</a>}
            <Button colorScheme='teal' onClick={handleGetGenre}>Get genres</Button>
        </div>
    )
}

export default Home