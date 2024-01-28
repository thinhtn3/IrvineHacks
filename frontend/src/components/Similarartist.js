// modal
import {
  Card,
  CardHeader,
  HStack,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
  Center,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Similarartist = () => {
  const [eventsInfo, setEventsInfo] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:8080/spotify/events", { credentials : 'include' });
      const data = await response.json();
      setEventsInfo(data["userSimilarArtists"]);
      console.log("DATA", data["userSimilarArtists"]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // artistProfile.name = artists.name
  //         artistProfile.url = artists.external_urls.spotify
  //         artistProfile.imgUrl = artists.images[0].url;
  //         artistProfile.genre = artists.genres;
  //         artistProfile.popularity = artists.popularity;
  //         artistProfile.id = artists.id
  //         userSimilarArtists.push(artistProfile);

  return (
    // <Card
    <div>
      <Box
        style={{ overflowY: "scroll", maxHeight: "100vh" }}
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {eventsInfo.map((events) => {
          return (
            <Flex justify="flex-end" align="center">
              <Link to={events.url}>
                <Card
                  key={events.id}
                  border = "0px solid black"
                  borderBottom="1px solid #1b1c1b"
                  borderRadius= "20px"
                  backgroundColor="#000000dd"
                  width="420px"
                  height="130px"
                  direction={{ base: "column", sm: "row" }}
                  overflow="hidden"
                  variant="outline"
                >
                  <Image
                    style={{ minWidth: "130px", height: "130px" }}
                    objectFit="cover"
                    maxW={{ base: "100%", sm: "100px" }}
                    src={events.imgUrl}
                  />

                  <HStack align="center">
                    <Flex flex="1" gap="4" alignItems="right" flexWrap="wrap">
                      <Center>
                        <CardBody
                          style={{
                            margin: "0px",
                            padding: "10px 10px",
                            minWidth: "300px",
                          }}
                        >
                          <Heading size="md">{events.name}</Heading>

                          <Text py="1">{events.genre}</Text>
                        </CardBody>
                      </Center>
                    </Flex>

                    {/* <CardFooter>
                                        <Button variant='solid' colorScheme='blue'>
                                            Buy Latte
                                        </Button>
                                    </CardFooter> */}
                  </HStack>
                </Card>
              </Link>
            </Flex>
          );
        })}
      </Box>
    </div>
  );
};

//             <Stack>
//             <Flex justify="flex-end" align="center" height="0vh">
//                 <Card
//                 width="500px" height="130px"
//                 direction={{ base: 'column', sm: 'row' }}
//                 overflow='hidden'
//                 variant='outline'
//                 >
//                 <Image
//                     objectFit='cover'
//                     maxW={{ base: '100%', sm: '150px' }}
//                     src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
//                     alt='Caffe Latte'
//                 />

//                 <Stack>
//                     <CardBody>
//                     <Heading size='md'>The perfect latte</Heading>

//                     <Text py='1'>
//                         Caffè latte is a coffee beverage of Italian origin made with espresso
//                         and steamed milk.
//                     </Text>
//                     </CardBody>

//                     <CardFooter>
//                     <Button variant='solid' colorScheme='blue'>
//                         Buy Latte
//                     </Button>
//                     </CardFooter>
//                 </Stack>
//                 </Card>
//             </Flex>
//             <Flex justify="flex-end" align="center" height="27vh">
//                 <Card
//                 width="500px" height="130px"
//                 direction={{ base: 'column', sm: 'row' }}
//                 overflow='hidden'
//                 variant='outline'
//                 >
//                 <Image
//                     objectFit='cover'
//                     maxW={{ base: '100%', sm: '150px' }}
//                     src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
//                     alt='Caffe Latte'
//                 />

//                 <Stack>
//                     <CardBody>
//                     <Heading size='md'>The perfect latte</Heading>

//                     <Text py='1'>
//                         Caffè latte is a coffee beverage of Italian origin made with espresso
//                         and steamed milk.
//                     </Text>
//                     </CardBody>

//                     <CardFooter>
//                     <Button variant='solid' colorScheme='blue'>
//                         Buy Latte
//                     </Button>
//                     </CardFooter>
//                 </Stack>
//                 </Card>
//             </Flex>
//             <Flex justify="flex-end" align="center" height="0vh">
//                 <Card
//                 width="500px" height="130px"
//                 direction={{ base: 'column', sm: 'row' }}
//                 overflow='hidden'
//                 variant='outline'
//                 >
//                 <Image
//                     objectFit='cover'
//                     maxW={{ base: '100%', sm: '150px' }}
//                     src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
//                     alt='Caffe Latte'
//                 />

//                 <Stack>
//                     <CardBody>
//                     <Heading size='md'>The perfect latte</Heading>

//                     <Text py='1'>
//                         Caffè latte is a coffee beverage of Italian origin made with espresso
//                         and steamed milk.
//                     </Text>
//                     </CardBody>

//                     <CardFooter>
//                     <Button variant='solid' colorScheme='blue'>
//                         Buy Latte
//                     </Button>
//                     </CardFooter>
//                 </Stack>
//                 </Card>
//             </Flex>
//             <Flex justify="flex-end" align="center" height="27vh">
//                 <Card
//                 width="500px" height="130px"
//                 direction={{ base: 'column', sm: 'row' }}
//                 overflow='hidden'
//                 variant='outline'
//                 >
//                 <Image
//                     objectFit='cover'
//                     maxW={{ base: '100%', sm: '150px' }}
//                     src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
//                     alt='Caffe Latte'
//                 />

//                 <Stack>
//                     <CardBody>
//                     <Heading size='md'>The perfect latte</Heading>

//                     <Text py='1'>
//                         Caffè latte is a coffee beverage of Italian origin made with espresso
//                         and steamed milk.
//                     </Text>
//                     </CardBody>

//                     <CardFooter>
//                     <Button variant='solid' colorScheme='blue'>
//                         Buy Latte
//                     </Button>
//                     </CardFooter>
//                 </Stack>
//                 </Card>
//             </Flex>
//             <Flex justify="flex-end" align="center" height="0vh">
//                 <Card
//                 width="500px" height="130px"
//                 direction={{ base: 'column', sm: 'row' }}
//                 overflow='hidden'
//                 variant='outline'
//                 >
//                 <Image
//                     objectFit='cover'
//                     maxW={{ base: '100%', sm: '150px' }}
//                     src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
//                     alt='Caffe Latte'
//                 />

//                 <Stack>
//                     <CardBody>
//                     <Heading size='md'>The perfect latte</Heading>

//                     <Text py='1'>
//                         Caffè latte is a coffee beverage of Italian origin made with espresso
//                         and steamed milk.
//                     </Text>
//                     </CardBody>

//                     <CardFooter>
//                     <Button variant='solid' colorScheme='blue'>
//                         Buy Latte
//                     </Button>
//                     </CardFooter>
//                 </Stack>
//                 </Card>
//             </Flex>
//             </Stack>

//     )
//     )
// }

export default Similarartist;
