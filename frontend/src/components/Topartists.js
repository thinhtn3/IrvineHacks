import {
  Box,
  Card,
  CardHeader,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  CardBody,
  CardFooter,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./topArtist.css";

const Topartists = () => {
  const [eventsInfo, setEventsInfo] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:8080/spotify/events", { credentials : 'include'});
      const data = await response.json();
      setEventsInfo(data["userTopArtists"]);
      console.log(data["userTopArtists"]);
      console.log("DATA", data["userTopArtists"][0].name);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log(eventsInfo);

  useEffect(() => {
    console.log("fetching events..");
    fetchEvents();
  }, []);

  return (
    <Box
      style={{
        overflowY: "scroll",
        maxWidth: "440px",
        maxHeight: "100vh",
        // position: "absolute",
      }}
      sx={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {eventsInfo.map((artist) => (
        <Link to={artist.url}>
          <Card
            key={artist.id}
            border="0px solid black"
            borderRadius="20px"
            borderBottom="1px solid #1b1c1b"
            backgroundColor="#000000dd"
            width="435px"
            height="120px"
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
          >
            <Image
              style={{ minWidth: "120px", height: "120px" }}
              objectFit="cover"
              maxW={{ base: "100%", sm: "200px" }}
              src={artist.imgUrl} // replace with the actual image URL from your data
              alt={artist.name} // replace with the actual alt text from your data
            />

            <Stack>
              <Flex direction="column" justify="center" align="center">
                <CardBody
                  style={{
                    margin: "0px",
                    padding: "5px 30px",
                    minWidth: "300px",
                  }}
                >
                  <Heading size="md">{artist.name}</Heading>

                  <Text py="2">{artist.genre}</Text>
                </CardBody>
              </Flex>
            </Stack>
          </Card>
        </Link>
      ))}
    </Box>
  );
};

export default Topartists;
