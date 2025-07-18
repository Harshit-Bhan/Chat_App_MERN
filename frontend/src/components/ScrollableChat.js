import React, { useEffect, useRef } from 'react';
import { isLastMessage, isSameSender } from '../config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={{ overflowY: 'auto', maxHeight: '100%', padding: '10px' }}>
      {messages &&
        messages.map((m, i) => (
          <div
            style={{
              display: 'flex',
              justifyContent: m.sender._id === user._id ? 'flex-end' : 'flex-start',
            }}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: m.sender._id === user._id ? '#BEE3F8' : '#F0FFF4',
                borderRadius: '10px',
                padding: '5px 10px',
                margin: '5px 0',
                maxWidth: '80%',
                wordWrap: 'break-word',
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ScrollableChat;
