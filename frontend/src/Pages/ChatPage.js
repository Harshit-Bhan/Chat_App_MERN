import React, { useEffect, useState } from 'react'
import axios from 'axios';

const ChatPage = () => {

    const [chats,setChats] = useState([]);

    const fetchChats = async () => {
        const { data } = await axios.get('/api/chats');

        setChats(data);
    }

    useEffect(() => {
        fetchChats();
    },[]);

  return (
    <div>{chats}</div>
  )
}

export default ChatPage