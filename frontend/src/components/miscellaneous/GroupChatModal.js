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
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResults] = useState();

  const toast = useToast();


  const { user, chats, setChats } = ChatState();

  const handleSubmit = async () => {}

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
    const { data } = await axios.get(`/api/user?search=${query}`,config);
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
            {/* selected users */}
            {/* render searched users */}
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
