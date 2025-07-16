import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';
import { useMediaQuery } from '@chakra-ui/react';


const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  // const [fetchAgain, setFetchAgain] = useState(false);
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const [isBelow1050] = useMediaQuery('(max-width: 1050px)');



  const fetchChats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/chat', config);
      console.log(data);
      setChats(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error fetching chats',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
    }
  };

useEffect(() => {
  setLoggedUser(user); 
  if (user) fetchChats(); 
}, [user, fetchAgain]); 


  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth="1px"
      // boxShadow="md"
      // position="relative"
      // overflowY="hidden"
    >
<Box pb={3} px={3} fontFamily="Work sans" w="100%">
  <Box
    display="flex"
    flexDirection={isBelow1050 ? 'column' : 'row'}
    alignItems={isBelow1050 ? 'flex-start' : 'center'}
    justifyContent="space-between"
    gap={2}
    w="100%"
  >
    <Text fontSize={{ base: '24px', md: '30px' }}>My Chats</Text>
    <GroupChatModal>
      <Button
        fontSize={isBelow1050 ? '15px' : '17px'}
        rightIcon={<AddIcon />}
        onClick={() => {
          setSelectedChat(null);
          // setFetchAgain(!fetchAgain);
        }}
        bg="blue.400"
        color="white"
        _hover={{ bg: 'blue.500' }}
        _active={{ bg: 'blue.600' }}
        _focus={{ boxShadow: 'outline' }}
        width={isBelow1050 ? '100%' : 'auto'}
        alignSelf={isBelow1050 ? 'stretch' : 'auto'}
      >
        New Group Chat
      </Button>
    </GroupChatModal>
  </Box>
</Box>



      <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-start"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats.map((chat) => (
          <Box
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            cursor="pointer"
            bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
            color={selectedChat === chat ? 'white' : 'black'}
            p={3}
            borderRadius="lg"
            mb={2}
            display="flex"
            alignItems="center"
            _hover={{
              backgroundColor: selectedChat === chat ? '#319795' : '#d3d3d3', // darker shade on hover
            }}
          >
            <Text>{!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MyChats;
