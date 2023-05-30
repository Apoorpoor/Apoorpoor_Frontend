/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../../styles/pages/_PoorTalk.scss';
import { FaCamera, FaArrowCircleUp, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const PoorTalk: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [typeValue, setTypeValue] = React.useState('TALK');
    const [senderValue, setSenderValue] = React.useState('string');
    const [memberIdValue, setMemberIdValue] = React.useState('long');
    const [timeValue, setTimeValue] = React.useState('string');
    const [roomIdValue, setRoomIdValue] = React.useState('string');
    const [inputValue, setInputValue] = React.useState('message');
    const [imageValue, setImageValue] = React.useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getMessages = async () => {
            const token = Cookies.get('ACC_Token');
            const response = await fetch('/api/messages', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setMessages(data);
        };
        getMessages();
    }, []);

    // 들어갈 메세지 핸들러
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };
    // 들어갈 이미지 핸들러
    const handleFileInput = (e: any) => {
        setImageValue(e.target.files[0]);
    };
    console.log("imageValue = ", imageValue);
    const date = new Date();
    const today = date.toLocaleString()
    console.log("today = ", today.split(" ")[3], today.split(" ")[4]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const newList = new FormData();
        newList.append("type", typeValue);
        newList.append("sender", senderValue);
        newList.append("memberId", memberIdValue);
        newList.append("time", timeValue);
        newList.append("roomId", roomIdValue);
        newList.append("message", inputValue);
        if (imageValue) {
            return newList.append("image", imageValue);
        }
        const sendSocket = new WebSocket('ws://15.164.247.53:8080/chat.send');
        sendSocket.onopen = () => {
            sendSocket.send(newList as any);
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
        <div className='currentBackGround'>
            <div className='Header'>
                <button type='button' onClick={() => navigate("/introTalk")}>
                    <FaChevronLeft className='Arrow' />
                </button>
                <div className='HeaderText'>푸어talk</div>
            </div>
            <ul className='Messagesbox'>
                {messages.map((message, index) => (
                    <div>
                        <li key={index}>{message}</li>

                    </div>
                ))}
            </ul>
            <li className='commentsBox'>다른 푸어 보낸 메세지</li>
            <li>내가 보낸 메세지</li>
            <form onSubmit={handleSubmit}>

                <input className='SandInput' type="text" value={inputValue} onChange={handleInputChange} />
                <button className='SandButton' type="submit"><FaArrowCircleUp /></button>
                <div className="filebox">
                    <label htmlFor="ex_file"><FaCamera className='PoorTalkCamera' /></label>
                    <input type="file" id="ex_file" onChange={handleFileInput} />
                </div>
            </form>
        </div>
    );
};

export default PoorTalk;
