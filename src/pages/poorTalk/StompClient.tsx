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

function StompClient() {
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
                    client.subscribe("/topic/public", (message) => {
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
                destination: "/topic/public",
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
                <div className='HeaderText'>푸어2 talk</div>
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

export default StompClient;


// /* eslint-disable consistent-return */
// /* eslint-disable import/order */
// /* eslint-disable jsx-a11y/control-has-associated-label */
// /* eslint-disable react-hooks/rules-of-hooks */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable arrow-body-style */
// /* eslint-disable react/no-array-index-key */
// /* eslint-disable @typescript-eslint/no-shadow */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-use-before-define */
// /* eslint-disable react/function-component-definition */
// import React, { useEffect, useRef, useState } from "react";
// import { Client, Message } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
// import { useNavigate } from "react-router";
// import { useQuery } from "react-query";
// import instance from "../../api/instance";
// import { getUser } from "../../api/members";
// import '../../styles/pages/_PoorTalk.scss';
// import { FaCamera, FaArrowCircleUp, FaChevronLeft } from "react-icons/fa";


// interface IJoinMessage {
//     type: "JOIN";
//     sender: string;
//     content: string;
//     user_id: string | number;
//     id: string | number;
// }

// interface ITalkMessage {
//     type: "TALK";
//     sender: string;
//     content: string;
//     user_id: string | number;
//     id: string | number;
// }

// type IMessage = IJoinMessage | ITalkMessage;

// const PoorTalk: React.FC = () => {
//     // 클라이언트 생성
//     const client = useRef<Client>({} as Client);
//     // 보여지는 메세지들, 닉네임 정보
//     const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
//     // 보내는 메세지
//     const [message, setMessage] = useState("");
//     // 토큰
//     const token = localStorage.getItem("AToken");
//     // 이미지
//     const [imageValue, setImageValue] = React.useState(null);
//     // 네비게이트
//     const navigate = useNavigate();
//     // 회원 정보
//     // const [whoIam, setWhoIam] = useState(null);
//     // useEffect(()=>{
//     //     setWhoIam(chatMessages.user_id);
//     // }, [chatMessages]);

//     const { isLoading, isError, data } = useQuery("User", getUser);
//     console.log("data", data);
//     const beggarId = data?.id;
//     const userId = data?.user_id;
//     const sender = data?.nickname;


//     // 랜더링시
//     useEffect(() => {
//         // 채팅방 연결
//         connect();
//         // 연결 해제
//         return () => disconnect();
//     }, []);

//     // 들어갈 이미지 핸들러
//     const handleFileInput = (e: any) => {
//         setImageValue(e.target.files[0]);
//     };

//     const connect = () => {
//         client.current = new Client({
//             webSocketFactory: () => new SockJS('http://3.34.85.5:8080/websocket'),
//             connectHeaders: {
//                 'ACCESS_KEY': `Bearer ${token}`,
//             },
//             debug: (str: string) => {
//                 console.log("debug == ", str);
//             },
//             reconnectDelay: 5000,
//             heartbeatIncoming: 4000,
//             heartbeatOutgoing: 4000,
//             onConnect: () => {
//                 subscribe();
//             },
//             onStompError: (frame: any) => {
//                 console.error("error = ", frame);
//             },
//         });

//         client.current.activate();
//     };

//     const disconnect = () => {
//         client.current.deactivate();
//     };
//     // if (parsedMessage.type === "JOIN") {
//     //     const newParticipant = parsedMessage.sender;
//     //     const notification: IMessage = {
//     //         type: "JOIN",
//     //         content: `🎉 ${newParticipant} 님이 입장했습니다.`,
//     //         sender: data.nickname,
//     //         user_id: data.user_id,
//     //         id: data.Id,
//     //     };
//     //     setChatMessages((chatMessages) => [...chatMessages, notification]);
//     // }
//     const subscribe = () => {
//         client.current.subscribe(`/topic/public`, (message) => {
//             console.log("message = ", message);
//             const parsedMessage = JSON.parse(message.body) as IMessage;
//             setChatMessages((chatMessages) => [...chatMessages, parsedMessage]);

//             client.current.publish({
//                 destination: "/app/chat.register",
//                 body: JSON.stringify({
//                     id: data.id,
//                     user_id: data.user_id,
//                     sender: data.nickname,
//                     type: "JOIN",
//                     content: message,
//                 }),
//             });
//             // client.current.activate();
//         })
//     }


//     const publish = (message: string) => {
//         if (!client.current.connected) {
//             return;
//         }
//         if (message.trim() === "")
//             return console.log("내용을 입력해주세요.");
//         const sendList: ITalkMessage = {
//             id: data.id,
//             user_id: data.user_id,
//             sender: data.nickname,
//             type: "TALK",
//             content: message,
//         }

//         client.current.publish({
//             destination: "/app/chat.send",
//             body: JSON.stringify(sendList),
//         });
//         // console.log("newList = ", sendList);

//         setMessage("");
//     };
//     const date = new Date();
//     const today = date.toLocaleString()
//     const now = `${date.getHours()}:${date.getMinutes()}`;
//     const now2 = `${today.split(" ")[3]} : ${now}`
//     console.log("now2 = ", now2);
//     // console.log("chatMessages = ", chatMessages);
//     // console.log("message = ", message);
//     return (
//         <div className='currentBackGround'>
//             <div className='Header'>
//                 <button type='button' onClick={() => navigate("/introTalk")}>
//                     <FaChevronLeft className='Arrow' />
//                 </button>
//                 <div className='HeaderText'>푸어talk</div>
//             </div>

//             {chatMessages && chatMessages.length > 0 && (
//                 <div className='Messagesbox'>
//                     {chatMessages?.map((message, index) => {
//                         return (
//                             <div className="chatBox" key={index}>
//                                 {message.type === "JOIN" ? (
//                                     <div className='commentsBox'>{data?.nickname} 입장</div>
//                                 ) : (
//                                     <div className={message.sender === data?.nickname ? 'myChat ' : 'commentsBox'}>
//                                         {message.content}
//                                     </div>
//                                 )}
//                                 <div className="nowTime">{now2}</div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//             <div>
//                 <input
//                     className='SandInput'
//                     type="text"
//                     placeholder="message"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={(e) => e.which === 13 && publish(message)}
//                 />
//                 <button
//                     className='SandButton'
//                     type="button"
//                     onClick={() => publish(message)}
//                 ><FaArrowCircleUp /></button>
//                 <div className="filebox">
//                     <label htmlFor="ex_file"><FaCamera className='PoorTalkCamera' /></label>
//                     <input
//                         type="file"
//                         id="ex_file"
//                     // onChange={handleFileInput}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PoorTalk;


// function StompClient() {
//     const [messages, setMessages] = useState<string[]>([]);
//     const [inputValue, setInputValue] = React.useState('');

//     // 들어갈 메세지 핸들러
//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setInputValue(event.target.value);
//     };
//     // 토큰
//     const token = localStorage.getItem("AToken");
//     // 백엔드 서버/앤드포인트
//     const socket = new SockJS('http://3.34.85.5:8080/websocket');
//     //  서버와의 연결을 설정하고 유지하는 역할을 담당
//     const stompClient = Stomp.over(socket);

//     useEffect(() => {
//         stompClient.connect({ 'ACCESS_KEY': `Bearer ${token}` }, (frame: any) => {
//             stompClient.subscribe('/topic/public', (message: any) => {
//                 // 채팅방에 새로운 메시지가 도착했을 때 처리
//                 const receivedMessage = JSON.parse(message.body);
//                 const chatContainer: HTMLElement | null = document.getElementById('chat-container');

//                 if (chatContainer !== null) {
//                     displayMessage(chatContainer, receivedMessage);
//                 }
//             });
//             function send(event: any) {
//                 const messageContent = inputValue.trim();

//                 if (messageContent && stompClient) {
//                     const chatMessage = {
//                         sender: "username123",
//                         content: inputValue,
//                         type: 'CHAT'
//                     };

//                     stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
//                     setInputValue("");
//                 }
//                 event.preventDefault();
//             }
//         });
//     }, []);

//     // 화면에 메시지를 표시하는 함수
//     function displayMessage(container: HTMLElement, message: any) {
//         const messageElement = document.createElement('div');
//         messageElement.innerText = message.content;

//         container.appendChild(messageElement);
//     }

//     function sendMessage(message: any) {
//         stompClient.send("/chat.send", {}, JSON.stringify({
//             'content': inputValue
//         }));
//     }

//     return (
//         <div>이 밑에<br />
//             {/* {messages.map((message, index) => (
//                 <div key={index}>
//                     {message}
//                 </div>
//             ))} */}
//             이 위에<br />
//             <input
//                 value={inputValue}
//                 onChange={handleInputChange}
//             />
//             <button
//                 type='button'
//                 onClick={send}>Send
//             </button>
//         </div>
//     );
// };
// export default StompClient