import React, { useEffect, useState } from 'react';
import { FaChevronLeft } from "react-icons/fa";
import { stompClient, sendMessage as sendStompMessage, } from '../../pages/poorTalk/StompClient';
import '../../styles/pages/_PoorTalk.scss';
// eslint-disable-next-line import/order
import { useNavigate } from 'react-router-dom';

interface Message {
  content: string;
}

// eslint-disable-next-line react/function-component-definition
const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();
  const handleMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = () => {
    const message: Message = { content: newMessage }; // 메시지 객체를 적절하게 구성해야 합니다.
    sendStompMessage('/app/send', JSON.stringify(message)); // 수정된 부분
    setNewMessage('');
  };

  useEffect(() => {
    stompClient.activate(); // 수정된 부분

    const onConnect = () => {
      setConnected(true);
      stompClient.subscribe('/topic/messages', (message) => {
        handleMessage(JSON.parse(message.body));
      });
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    stompClient.onConnect = onConnect;
    stompClient.onDisconnect = onDisconnect;

    return () => {
      stompClient.deactivate();
      setConnected(false);
    };
  }, []);
  return (
    <div className='Wrappers'>
      {connected ? <p>Connected to WebSocket</p> : <p>Not connected to WebSocket</p>}
      <div className='Header'>
        <button type='button' onClick={() => navigate("/introTalk")}>
          <FaChevronLeft className='Arrow' />
        </button>
        <div className='HeaderText'>푸어talk</div>
      </div>
      <ul className='Messagesbox'>
        {messages.map((message, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>{message.content}</li>
        ))}
      </ul>
      <div className='SandBox'>
        <input
          className='SandInput'
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        {/*  eslint-disable-next-line react/button-has-type */}
        <button
          className='SandButton'
          type='button'
          onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
