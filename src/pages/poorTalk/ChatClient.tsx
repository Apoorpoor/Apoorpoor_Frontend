import React, { useEffect, useState } from 'react';

// eslint-disable-next-line react/function-component-definition
const ChatClient: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000'); // WebSocket 서버 주소 입력

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const socket = new WebSocket('ws://localhost:8000'); // WebSocket 서버 주소 입력
    socket.onopen = () => {
      socket.send(inputValue);
      socket.close();
    };
    setInputValue('');
  };

  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatClient;
