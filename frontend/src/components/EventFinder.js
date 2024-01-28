import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import "./EventFinder.css";

const EventFinder = () => {
  const [eventsInfo, setEventsInfo] = useState([]);

  const fetchEvents = async () => {
    try {
      console.log("AT EVENTS");
      const response = await fetch("http://localhost:8080/spotify/events", { credentials: 'include' });
      const data = await response.json();
      setEventsInfo(data["userSuggestedEvents"]);
      console.log("DAATA", data["userSuggestedEvents"][0]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box


      style={{ overflowY: "scroll", maxHeight: "80vh", overflowX: "none" }}
      w="650px" // sets the width to 300 pixels
      // You can also use responsive values like:
      // w={{ base: "100%", md: "50%", lg: "25%" }}
      boxShadow="md" // medium shadow
      borderRadius="lg" // large border radius>
    >
      <Flex flexWrap="wrap">
        {eventsInfo.map((events) => {
          return (
            <Card
              backgroundColor="#000000dd"
              key={events.id}
              direction={{ base: "column", sm: "row" }}
              variant="outline"
              // height="200px"
              width='700px'

            >
              <Image
                style={{ minWidth: "150px", height: "150px" }}
                objectFit="cover"
                maxW={{ base: "100%", sm: "200px" }}
                src={events.imgUrl}
                alt="event image"
              />

              <Stack>
                <CardBody className="center">
                  <Heading size="md">{events.eventName}</Heading>

                  <Text py="2">
                    Date: {new Date(events.localDate).toLocaleDateString("en-US")}
                  </Text>
                  <Text py="2">
                    Address: {events.addressLine} {events.city},{" "}
                    {events.stateCode} <strong>@</strong> {events.venueName}
                  </Text>
                  <Text>Genre: {events.genres}</Text>
                  <Text>
                    Pricing: {events.min} - {events.max} {events.currency}
                  </Text>
                </CardBody>

                <CardFooter>
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    onClick={() =>
                      (window.location.href = events.ticketmasterURL)
                    }
                  >
                    View Tickets
                  </Button>
                </CardFooter>
              </Stack>
            </Card>
          );
        })}
      </Flex>
    </Box>
  );
};

export default EventFinder;
