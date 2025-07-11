import { Box, CloseButton } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={3}
      py={1}
      borderRadius="2xl"
      m={1}
      fontSize="13px"
      bg="purple.300"
      color="white"
      display="inline-flex"
      alignItems="center"
      cursor="pointer"
      _hover={{ bg: 'purple.400' }}
    >
      {user.name}
      <CloseButton
        onClick={handleFunction}
        size="sm"
        ml={2}
        color="white"
        _hover={{ bg: 'purple.500' }}
      />
    </Box>
  );
};

export default UserBadgeItem;
