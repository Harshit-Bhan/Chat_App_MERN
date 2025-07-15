import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain , fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState('');
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResults] = useState();

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

 
  const handleRename = async () => {
    if (!groupChatName || groupChatName === selectedChat.chatName) {
    toast({
      title: 'Please enter a new name',
      status: 'warning',
      duration: 2000,
      isClosable: true,
      position: 'bottom-left',
    });
    return;
  }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setChats(
      chats.map((c) => (c._id === data._id ? data : c))
    );
      setFetchAgain(!fetchAgain);
      toast({
        title: 'Group Chat Renamed',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    } catch (error) {
    //   toast({
    //     title: 'Error renaming the Group',
    //     status: 'error',
    //     duration: 3000,
    //     isClosable: true,
    //     position: 'bottom-left',
    //   });
      setRenameLoading(false);
    }
    setGroupChatName('');
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: 'User already in group',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add users',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        '/api/chat/groupadd',
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setChats(chats.map((c) => (c._id === data._id ? data : c)));
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error adding user to group',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
    }

  }

 
const handleRemove = async (userToRemove) => {
  if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
    toast({
      title: 'Only admins can remove users',
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'bottom-left',
    });
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.put(
      '/api/chat/groupremove',
      {
        chatId: selectedChat._id,
        userId: userToRemove._id,
      },
      config
    );

    if (userToRemove._id === user._id) {
  setSelectedChat(null);

  // Remove chat from chat list
  setChats((prevChats) => prevChats.filter((c) => c._id !== selectedChat._id));

  fetchMessages();
  setFetchAgain(!fetchAgain);
  setLoading(false);
  toast({
    title: 'You left the group',
    status: 'success',
    duration: 3000,
    isClosable: true,
    position: 'bottom-left',
  });
  return;
}


    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    toast({
      title: 'User removed from group',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'bottom-left',
    });
  } catch (error) {
    toast({
      title: 'Failed to remove user',
      description: error.response?.data?.message || error.message,
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'bottom-left',
    });
  } finally {
    setLoading(false);
  }
};


  const handleSearch = async (query) => {
    setSearch(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
        };
        const { data } = await axios.get(`/api/user?search=${query}`, config);
        setLoading(false);
        setSearchResults(data);
    } catch (error) {
        toast({
            title: 'Failed to search users',
            description: error.response?.data?.message || error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'bottom-left',
        });
        setLoading(false);
        setSearchResults([]);
    }
  };

  return (
    <>
      <IconButton icon={<ViewIcon />} onClick={onOpen} display={{ base: 'flex' }} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="30px"
            fontFamily="Work sans"
          >
            {selectedChat.chatName.toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap="wrap" mb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add User to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
            <Spinner size="lg" />
            ) : (
            searchResult?.map((user) => (
            <UserListItem
            key={user._id}
            user={user}
            handleFunction={() => handleAddUser(user)}
            />
        ))
        )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export default UpdateGroupChatModal;