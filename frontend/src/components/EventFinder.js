import {
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
      const response = await fetch("http://localhost:8080/spotify/events", {credentials : 'include'});
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
    <div
      style = {{overflowY: "scroll", minWidth: "1400px", maxHeight: "100vh", overflowX: "hidden"}}
      sx={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}>
      {eventsInfo.map((events) => {
        return (
          <Card
            backgroundColor="#000000dd"
            style={{ left: "440px", backgroundColor: "000000dd", border: "0px solid black",borderBottom: '1px solid #1b1c1b'}}
            key={events.id}
            direction={{ base: "column", sm: "row" }}
            variant="outline"
          >
            <Image
              style={{ minWidth: "250px", height: "280px" }}
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
    </div>
  );
};

export default EventFinder;
