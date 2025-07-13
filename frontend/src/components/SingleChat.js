import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, IconButton, Text, Flex } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import { useMediaQuery } from '@chakra-ui/react';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  if (!selectedChat) {
    return (
      <Box
        display={{ base: 'none', md: 'flex' }}
        alignItems="center"
        justifyContent="center"
        width={{ base: '100%', md: '68%' }}
        padding={3}
        height="100%"
      >
        <Text fontSize="2xl" fontFamily="Work sans">
          Click on a user to start chatting
        </Text>
      </Box>
    );
  }

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      flexDirection="column"
      width={{ base: '100%', md: '68%' }}
      height="100%"
    >
      
      <Flex
        align="center"
        px={3}
        py={2}
        gap={3}
        fontSize={{ base: '20px', md: '24px' }}
        fontFamily="Work sans"
        color="gray.700"
      >
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          icon={<ArrowBackIcon />}
          onClick={() => {
            setSelectedChat('');
            setFetchAgain(!fetchAgain);
          }}
          aria-label="Back"
          variant="ghost"
          size="sm"
        />
        {!selectedChat.isGroupChat ? (
            <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user,selectedChat.users)}/>
            </> 
        ) : (
            <>
                {selectedChat.chatName.toUpperCase()}
            </>
        )}
        <Text fontWeight="bold" noOfLines={1}>
          {/* {user.name}'s Chat */}
        </Text>
      </Flex>

      
      <Box
        flex="1"
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="md"
        p={3}
        mt={1}
        overflowY="auto"
      >
        
        <Text color="gray.500">Chat area here...</Text>
      </Box>
    </Box>
  );
};

export default SingleChat;
