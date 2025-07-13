import React, { useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, IconButton, Text, Flex } from '@chakra-ui/react';
import { ArrowBackIcon, ViewIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
          >  {/*messages here*/} </Box>
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


