import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain,setFetchAgain}) => {

  const { selectedChat } = ChatState();

  return <Box 
    display={{base : selectedChat ? "flex" : "none" , md : "flex"}}
    flexDirection="column"
    alignItems="center"
    width={{ base: "100%", md: "68%" }}
    borderRadius="lg"
    bg="white"
    borderWidth="1px"
    padding={3}
    height="100%"
    boxShadow="md"
  >
    <SingleChat  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
  </Box>
};

export default ChatBox;
