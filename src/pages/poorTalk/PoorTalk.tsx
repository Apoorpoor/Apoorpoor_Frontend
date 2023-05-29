/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';

const PoorTalk: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const sendSocket = new WebSocket('ws://15.164.247.53:8080/chat.send');
        sendSocket.onopen = () => {
            sendSocket.send(inputValue);
            sendSocket.close();
        };
        setInputValue('');
    };

    useEffect(() => {
        let socket: WebSocket;

        const connectWebSocket = () => {
            socket = new WebSocket('ws://15.164.247.53:8080/chat.register');

            socket.onopen = () => {
                console.log('WebSocket 연결!');
                subscribe();
            };

            socket.onmessage = (event) => {
                const message = event.data;
                setMessages((prevMessages) => [...prevMessages, message]);
            };

            socket.onclose = () => {
                console.log('WebSocket 닫힘!');
            };
        };

        const subscribe = () => {
            socket.send('/topic/public');
        };
        connectWebSocket();

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input type="text" value={inputValue} onChange={handleInputChange} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default PoorTalk;
