/* eslint-disable react/no-array-index-key */
/* eslint-disable import/order */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable consistent-return */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Client, Message, Stomp, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQuery } from "react-query";
import { getUser } from "../../api/members";
import '../../styles/pages/_PoorTalk.scss';
import { FaCamera, FaArrowCircleUp, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router";

interface IJoinMessage {
    type: "JOIN";
    sender: string;
    content: string;
    user_id: string | number;
    id: string | number;
}

interface ITalkMessage {
    type: "TALK";
    sender: string;
    content: string;
    user_id: string | number;
    id: string | number;
}

type IMessage = IJoinMessage | ITalkMessage;

function PoorTalk() {
    const [inputValue, setInputValue] = React.useState('');
    // 처음에 받아오는 내 푸어 정보
    const [user, setUser] = useState<any>(null);
    // const [stompClient, setStompClient] = useState(null);
    const [messageList, setMessageList] = useState<IMessage[]>([]);
    // 보여지는 메세지들, 닉네임 정보
    const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
    // 보내는 메세지
    const [message, setMessage] = useState<string>("");
    // 토큰
    const token = localStorage.getItem("AToken");
    // 유저 정보 받아오기
    const { isLoading, isError, data } = useQuery("getUser", getUser);
    // 소켓
    const socket = new SockJS('http://3.34.85.5:8080/ws-edit');
    // 클라이언트
    const stompClientRef = useRef<Client | null>(null);
    // 네비게이트
    const navigate = useNavigate();


    useEffect(() => {
        if (data) {
            setUser(data);
            // 소켓 연결
            const client = new Client({
                webSocketFactory: () =>
                    new SockJS(`http://3.34.85.5:8080/ws-edit`),
                connectHeaders: {
                    'ACCESS_KEY': `Bearer ${token}`,
                },
                // debug: (str: string) => {
                //     console.log("debug == ", str);
                // },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                // 접속했을 때
                onConnect: (message) => {
                    console.log("Connected: ", message);
                    client.subscribe("/sub/chat/room", (message) => {
                        const parsedMessage = JSON.parse(message.body) as IMessage;
                        setChatMessages((chatMessages) => [...chatMessages, parsedMessage]);
                    });

                    client.publish({
                        destination: "/pub/chat/enter",
                        body: JSON.stringify({
                            id: data.id,
                            user_id: data.user_id,
                            sender: data.nickname,
                            type: "JOIN",
                            content: message,
                        }),
                    });
                },
                // onDisconnect: () => {
                //     client.publish({
                //         destination: "/pub/chat/leave",
                //         body: JSON.stringify({
                //             id: data.id,
                //             user_id: data.user_id,
                //             sender: data.nickname,
                //             type: "TALK",
                //             content: message,
                //         }),
                //     });
                // },
            });
            stompClientRef.current = client;
            client.activate();
        }

        return () => {
            // 컴포넌트가 언마운트될 때 연결을 끊음
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [data, message, token]);

    const sendMessage = (message: string) => {
        if (message.trim() === "")
            return console.log("내용을 입력해주세요.");

        const sendList = {
            id: data.id,
            user_id: data.user_id,
            sender: data.nickname,
            type: "TALK",
            content: message.trim(),
        };

        if (stompClientRef.current) {
            stompClientRef.current.publish({
                destination: "/pub/chat/send",
                body: JSON.stringify(sendList),
            });
        }
        setMessage("");
    };

    const date = new Date();
    const today = date.toLocaleString();
    const now = `${date.getHours()}:${date.getMinutes()}`;
    const now2 = `${today.split(" ")[3]} : ${now}`;

    return (
        <div className='currentBackGround'>
            <div className='Header'>
                <button type='button' onClick={() => navigate("/introTalk")}>
                    <FaChevronLeft className='Arrow' />
                </button>
                <div className='HeaderText'>푸어talk</div>
            </div>

            {chatMessages && chatMessages.length > 0 && (
                <div className='Messagesbox'>
                    {chatMessages?.map((message, index) => (
                        <div className="chatBox" key={index}>
                            {message.sender === data?.nickname ? <button type="button" className="yourChatProfile">.</button>
                                : ""
                            }
                            <div className={message.sender === data?.nickname ? 'yourChat ' : 'myChat'}>
                                {message.content}
                            </div>
                            <div
                                className={message.sender === data?.nickname ? 'nowTime2 ' : 'nowTime1'}
                            >{now2}</div>

                        </div>
                    ))}
                </div>
            )}
            <div>
                <input
                    className='SandInput'
                    type="text"
                    placeholder="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.which === 13 && sendMessage(message)}
                />
                <button
                    className='SandButton'
                    type="button"
                    onClick={() => sendMessage(message)}
                ><FaArrowCircleUp /></button>
                <div className="filebox">
                    <label htmlFor="ex_file"><FaCamera className='PoorTalkCamera' /></label>
                    <input
                        type="file"
                        id="ex_file"
                    // onChange={handleFileInput} 
                    />
                </div>
            </div>
        </div>
    );
};

export default PoorTalk;
