import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  Avatar,
  Flex,
  HStack,
  MenuList,
  MenuItem,
  MenuDivider,
  position,
  Toast,
  Spinner,
} from '@chakra-ui/react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
} from '@chakra-ui/react';

import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import NotificationBadge, { Effect } from 'react-notification-badge';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState();

  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setSelectedChat(null);
    setChats([]);
    setNotifications([]);
    history.push('/');
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/chat', { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
        description: error.message,
      });
      return;
    }
  };

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter something in search input',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
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

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: 'Error occurred!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        description: 'Failed to load the search results',
        position: 'bottom-left',
      });
    }
  };

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);

  return (
    <Box w="100%" p="5px 10px" bg="white" borderWidth="5px">
      <Flex justify="space-between" align="center">
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" display="flex" alignItems="center" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: 'none', md: 'flex' }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>

        <HStack spacing="4">
          <Menu autoSelect={false}>
            <MenuButton p={1}>
              <span style={{ position: 'relative' }}>
                <Box position="relative">
                  <BellIcon fontSize="2xl" />
                  {notifications.length > 0 && (
                    <Box
                      position="absolute"
                      top="-1"
                      right="-1"
                      bg="red.500"
                      borderRadius="full"
                      w="18px"
                      h="18px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {notifications.length}
                    </Box>
                  )}
                </Box>
              </span>
            </MenuButton>

            <MenuList>
              {!notifications?.length ? (
                <MenuItem>No new messages</MenuItem>
              ) : (
                notifications.map((notif) => {
                  const chatName = notif?.chat?.isGroupChat
                    ? notif?.chat?.chatName
                    : notif?.sender?.name;

                  if (!chatName) return null; // skip malformed notifications

                  return (
                    <MenuItem
                      key={notif._id}
                      onClick={() => {
                        if (notif?.chat) {
                          setSelectedChat(notif.chat);
                          setNotifications(notifications.filter((n) => n._id !== notif._id));
                        }
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New message in ${notif.chat.chatName}`
                        : `New message from ${notif.sender.name}`}
                    </MenuItem>
                  );
                })
              )}
            </MenuList>
          </Menu>

          <Menu autoSelect={false}>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={openProfile}>My Profile</MenuItem>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Flex>
              <Input
                placeholder="Enter name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Flex>

            <Box mt={4}>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResults.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
            </Box>
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <ProfileModel isOpen={isProfileOpen} onClose={closeProfile} user={user} />
    </Box>
  );
};

export default SideDrawer;
