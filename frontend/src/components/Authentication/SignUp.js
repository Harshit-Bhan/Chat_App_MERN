import { FormControl, Input, VStack , FormLabel, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'

const SignUp = () => {
    const [show,setShow] = useState(false);
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [confirmpassword,setConfirmPassword] = useState();
    const [pic,setPic] = useState();
    const [loading,setLoading] = useState(false);

    const toast = useToast();

    const handleClick = () => {
        setShow(!show);
    }

    const postDetails = (pics) => {
        setLoading(true);
      
        if (pics === undefined) {
          toast({
            title: 'Please Select an Image!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
          });
          setLoading(false);  
          return;
        }
      
        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
          const data = new FormData();
          data.append('file', pics);
          data.append('upload_preset', 'Chat_App');  
          data.append('cloud_name', 'dfgkcii3i');
      
          fetch('https://api.cloudinary.com/v1_1/dfgkcii3i/image/upload', {
            method: 'post',
            body: data,
          })
            .then((res) => res.json())
            .then((data) => {
              setPic(data.url.toString());
              setLoading(false);
              toast({
                title: 'Image Uploaded!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
              });
            })
            .catch((err) => {
              console.error(err);
              setLoading(false);
              toast({
                title: 'Upload Failed!',
                description: 'Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
              });
            });
        } else {
          toast({
            title: 'Invalid file type!',
            description: 'Please select a JPEG or PNG image.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
          });
          setLoading(false);
        }
      };
      

    const submitHandler = () => {

    }

  return (
    <VStack spacing='5px'>
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
                <Input placeholder='Enter your Name' onChange={(e) => {
                    setName(e.target.value)}
                }/>                    
        </FormControl>

        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
                <Input placeholder='Enter your Email' onChange={(e) => {
                    setEmail(e.target.value)}
                }/>                    
        </FormControl>

        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show ? "text" : "password"} placeholder='Enter your Password' onChange={(e) => {
                    setPassword(e.target.value)}
                }/>  
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>

            </InputGroup>
                                  
        </FormControl>

        <FormControl id='confirm-password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input type={show ? "text" : "password"} placeholder='Confirm Password' onChange={(e) => {
                    setConfirmPassword(e.target.value)}
                }/>  
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>

            </InputGroup>
                                  
        </FormControl>

        <FormControl id='pic' isRequired>
            <FormLabel>Upload your Picture</FormLabel>
                <Input type="file" p={1.5} accept='image/*' onChange={(e) => {
                    postDetails(e.target.files[0])}
                }/>                    
        </FormControl>

        <Button colorScheme='blue' 
            width='100%'
            style={{marginTop:15}}
            onClick={submitHandler}
            isLoading={loading}
        >Sign Up</Button>

    </VStack>
  )
}

export default SignUp