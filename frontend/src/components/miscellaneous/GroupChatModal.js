import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  Input,
  FormControl,
  Box,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResults] = useState();

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        'https://chat-app-backend-sczn.onrender.com/api/chat/group',
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: 'Group Chat Created',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    } catch (error) {
      toast({
        title: 'Error creating group chat',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
        description: 'Failed to create group chat. Please try again later.',
      });
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
        },
      };
      const { data } = await axios.get(
        `https://chat-app-backend-sczn.onrender.com/api/user?search=${query}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
        description: 'Failed to load users. Please try again later.',
      });
    }
  };

  const handleGroup = (usertoAdd) => {
    if (selectedUsers.includes(usertoAdd)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }
    setSelectedUsers([...selectedUsers, usertoAdd]);
    setSearch('');
    // setSearchResults([]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userToDelete._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            fontSize="35px"
            fontFamily="Work sans"
            color="black"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            padding="20px"
          >
            <FormControl>
              <Input
                placeholder="Group Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                value={search}
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
