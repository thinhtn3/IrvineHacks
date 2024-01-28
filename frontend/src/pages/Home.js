import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import Topartists from "../components/Topartists";
import { Button, ButtonGroup } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import EventFinder from "../components/EventFinder";
import Similarartist from "../components/Similarartist";

import "./Home.css";

const Home = () => {
  // const [loggedIn, setLoggedIn] = useState(false);

  // useEffect(() => {
  //     fetch("http://localhost:8080/spotify/check-auth")
  //         .then(response => response.json())
  //         .then(data => {
  //             console.log("Here: ", data);
  //             if (data.accessToken) {
  //                 setLoggedIn(true);
  //                 console.log(loggedIn)
  //                 Cookies.set('accessToken', data.accessToken);

  //             }
  //         })
  //         .catch(error => { console.log(error) })
  // }, [])

  // const handleGetGenre = useCallback(() => {
  //     fetch("http://localhost:8080/spotify/events")
  //         .then(response => response.json())
  //         .then(data => { console.log(data) })
  //         .catch(error => { console.log("EWWW: " + error) })
  // }, []);

  return (
    <div>
      {/* <h1>Spotify Auth Testing</h1> */}
      {/* {loggedIn ? <p>logged in</p> : <a href="http://localhost:8080/spotify/login">Login with Spotify</a>} */}
      <Modal></Modal>
      {/* <Button colorScheme='teal' onClick={handleGetGenre}>Get genres</Button> */}

      <div className="wrapper">
        <div className ="logo">
            <img src= "https://cdn-icons-png.flaticon.com/512/10181/10181144.png"></img>
            <h1>SpotiEvent</h1>
        </div>

        <div className="title">
          <h1>Your Top Artists</h1>
          <h1>Events You Might Be Interested In</h1>
          <h1>Artists You Might Like</h1>
        </div>

        <div className="main">
          <EventFinder />
          <Topartists />
          <Similarartist />
        </div>

      </div>

    </div>
  );
};

export default Home;
