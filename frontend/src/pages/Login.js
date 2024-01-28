import React from "react";
import { useNavigate } from "react-router-dom";
// import Cookies from 'js-cookie'
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  ChakraProvider,
  Image,
  Text,
  extendTheme,
} from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#003472",
        //or #4d94ff, both are cool :)
      },
    },
  },
});

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
    <ChakraProvider theme={theme}>
      <div>
        <Center height="100vh">
          <Box
            width="450px"
            height="600px"
            bg="black"
            borderRadius="md"
            p="4"
            textAlign="center"

            //   textAlign="center"
            //   transform="translate(-50%, -50%)"
          >
            <Box>
              <Text fontSize="2xl" fontWeight="bold">
                Log in to your Spotify Account
              </Text>

              <Image
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png"
                alt="Spotify Logo"
                boxSize="500px"
                objectFit="contain"
              />
            </Box>

            {/* <Flex
        direction="column"
        justify = 'space-between'
        height = "100%">
        </Flex> */}
          </Box>
          {/* <Center> */}
          <Button
          size="xl"
            onClick={() =>
              (window.location.href = "http://localhost:8080/spotify/login")
            }
            size="lg"
            colorScheme="blue"
            position="absolute"
            down="100%"
            transform="translate(0%, 500%)"
          >
            Log in
          </Button>
          {/* </Center> */}
        </Center>
        {/* </Box>
      </ChakraProvider> */}

        {/* <a href="http://localhost:8080/spotify/login">
                Login with Spotify
            </a> */}
      </div>
    </ChakraProvider>
  );
};

export default Login;
