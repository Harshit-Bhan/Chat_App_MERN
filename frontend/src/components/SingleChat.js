import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, IconButton, Text, Flex, Spinner, FormControl, Input, useToast } from '@chakra-ui/react';
import { ArrowBackIcon, ViewIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';

import io from 'socket.io-client';
const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);

  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      
      setMessages(data);
      console.log(messages);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
      // selectedChatCompare = selectedChat;
    } catch (error) {
      toast({
        title: 'Error fetching messages',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  
  }

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      setLoading(true);
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage('');
        const { data } = await axios.post("/api/message", {
          content: newMessage,
          chatId: selectedChat._id,
        },config);

        console.log(data);

        setMessages([...messages, data]);
                 
      } catch (error) {
        toast({
          title: 'Error sending message',
          description: error.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => {
    console.log('Connected to socket')
      setSocketConnected(true);
  });
    socket.on('message received', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      socket.disconnect();
    };
  },[]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            display="flex"
            fontSize={{ base: '28px', md: '30px' }}
            fontFamily="Work sans"
            pb={3}
            px={2}
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
            width="100%"
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <IconButton
                display={{ base: 'flex', md: 'flex' }}
                icon={<ViewIcon />}
                onClick={() => setIsProfileOpen(true)}
                />
                <ProfileModel
                  user={getSenderFull(user, selectedChat.users)}
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}/>
              </>
            ) : (
              <>
              {selectedChat.chatName.toUpperCase()}
              {<UpdateGroupChatModal
                fetchMessages={fetchMessages}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                />
                }
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >  {loading ? (
            <Spinner
              size="xl"
              w={20}
              h={20}
              alignSelf="center"
              margin="auto"
            />
          ) : (
              <div className="messages">
                <ScrollableChat messages={messages}/>
              </div>
          )} 
            <FormControl  isRequired mt={3}>
              <Input
                onKeyDown={sendMessage}
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </> 
      ) : ( 
          <Box
          display="flex" alignItems="center" justifyContent="center" height="100%">
          <Text fontSize="2xl" pb={3} fontFamily="Work sans">
            Click on a chat to start messaging
          </Text>
        </Box>
      )}       
    </>
  )
}

export default SingleChat;


