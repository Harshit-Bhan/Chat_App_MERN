import {
  FormControl,
  Input,
  VStack,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';


const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const { setUser } = ChatState(); 

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: 'Please fill in all fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { 'Content-type': 'application/json' },
      };

      const { data } = await axios.post('https://chat-app-backend-sczn.onrender.com/api/user/login', { email, password }, config);

      toast({
        title: 'Login Successful!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data); 
      history.push('/chats');
    } catch (error) {
      toast({
        title: 'Login failed!',
        description: error.response?.data?.message || 'Invalid email or password.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="Email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
      </FormControl>

      <FormControl id="Password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={show ? 'text' : 'password'}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button colorScheme="blue" width="100%" mt={4} onClick={submitHandler} isLoading={loading}>
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail('guest@example.com');
          setPassword('123456');
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
