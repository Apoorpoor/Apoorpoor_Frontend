import React, { useEffect, useState } from 'react';
import {
  stompClient,
  sendMessage as sendStompMessage,
} from '../../pages/poorTalk/StompClient';

interface Message {
  content: string;
}

// eslint-disable-next-line react/function-component-definition
const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);

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
    <div>
      {connected ? (
        <p>Connected to WebSocket</p>
      ) : (
        <p>Not connected to WebSocket</p>
      )}
      <ul>
        {messages.map((message, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>{message.content}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />

      {/*  eslint-disable-next-line react/button-has-type */}
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
