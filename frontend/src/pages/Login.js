import React from "react";
import { useNavigate } from "react-router-dom";
// import Cookies from 'js-cookie'
import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";

const Login = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/spotify/check-auth", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Here: ", data);
        if (data.accessToken) {
          setLoggedIn(true);
          console.log(loggedIn);
          // Cookies.set('accessToken', data.accessToken);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      // Redirect to home.js after successful login
      navigate("/home");
    }
  }, [loggedIn, navigate]);

  return (
    <div>
      <Button
        onClick={() =>
          (window.location.href = "http://localhost:8080/spotify/login")
        }
        colorScheme="blue"
      >
        Button
      </Button>
      {/* <a href="http://localhost:8080/spotify/login">
                Login with Spotify
            </a> */}
    </div>
  );
};

export default Login;
