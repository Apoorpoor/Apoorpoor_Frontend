/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/order */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable consistent-return */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getUser, getUsersProfile } from "../../api/members";
import '../../styles/pages/_PoorTalk.scss';
import { FaCamera, FaArrowCircleUp } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Header } from '../../components';
import instance from "../../api/instance";
import UsersProfilePage from "./UsersProfilePage";
// import imageCompression from 'browser-image-compression';  

interface IJoinMessage {
    type: "ENTER";
    sender: string;
    message: string;
    beggar_id: string | number;
    date: string;
    username: string
    userId: number
    image?: string;
}
interface ITalkMessage {
    type: "TALK";
    sender: string;
    message: string;
    beggar_id: string | number;
    date: string;
    username: string
    userId: number
    image?: string;
}

interface ILEAVEMessage {
    type: "LEAVE";
    sender: string;
    message: string;
    beggar_id: string | number;
    date: string;
    username: string
    userId: number
    image?: string;
}

type IMessage = IJoinMessage | ITalkMessage | ILEAVEMessage;


type MessageType = {
    type: "ENTER" | "LEAVE" | "TALK";
    sender: string;
    message: string;
    beggar_id: string | number;
    date: string,
    image?: string;
};

type Props = {
    message: MessageType;
};

function PoorTalk() {
    // 처음에 받아오는 내 푸어 정보
    const [user, setUser] = useState<any>(null);
    // 보여지는 메세지들, 닉네임 정보
    const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
    // 보내는 메세지
    const [message, setMessage] = useState<string>("");
    // 보내는 이미지
    const [image, setImage] = useState<string | Blob>("");
    // 섬네일 이미지
    const [thumbnailImage, setThumbnailImage] = useState<string>("");
    // 메세지에서 추출한 유저 아이디
    const [onMessageUserId, setOnMessageUserId] = useState<number>(user?.userId);
    // 토큰
    const token = localStorage.getItem("AToken");
    // 유정 고유 아이디 
    const userId = localStorage.getItem("userId");
    // 유저 정보 받아오기
    const { isLoading, error, data } = useQuery("getUser", getUser);
    // 소켓
    const socket = new SockJS(`http://3.34.85.5:8080/ws-edit`);
    // 클라이언트
    const stompClientRef = useRef<Client | null>(null);
    // 최신글이 올라오면 맨 밑으로 포커싱
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // 네비게이터
    const navigate = useNavigate();
    // 상대 유저들 모달창
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    // 모달창 노출
    const showModal = (): void => {
        setModalOpen(true);
    };
    const queryClient = useQueryClient();
    const mutation = useMutation(getUsersProfile, {
        onSuccess: () => {
            console.log(" 상대 푸어 정보 가져오기 완료");
        },
    });
    // 날짜 데이터 
    let today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
    let time = {
        year: today.getFullYear(), // 현재 년도
        month: (today.getMonth() + 1).toString().padStart(2, "0"), // 현재 월
        date: today.getDate().toString().padStart(2, "0"), // 현제 날짜
        hours: today.getHours().toString().padStart(2, "0"), // 현재 시간
        minutes: today.getMinutes().toString().padStart(2, "0"), // 현재 분
        seconds: today.getSeconds().toString().padStart(2, "0"), // 현재 초
    };
    let timestring = `${time.year}년 ${time.month}월 ${time.date}일 ${time.hours} : ${time.minutes} ${time.seconds}초`;

    // 스크롤 부분(채팅방 입장시 가장 아래로, 채팅로그가 업데이트 될 때마다 가장 아래로)
    useEffect(() => {
        messagesEndRef.current &&
            // (messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    useEffect(() => {
        if (data !== undefined) {
            setUser(data)
            // 소켓 연결
            const client = new Client({
                webSocketFactory: () => socket,
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
                    // console.log("message = ", message);
                    client.subscribe("/sub/chat/room", (message) => {
                        const parsedMessage = JSON.parse(message.body) as IMessage;

                        // console.log("parsedMessage== ", parsedMessage);
                        if (parsedMessage.beggar_id !== null) {
                            setChatMessages((chatMessages) => [...chatMessages, parsedMessage]);
                        }
                    });
                    // 맨 아래로 스크롤 이동
                    if (messagesEndRef.current) {
                        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
                    }

                    client.publish({
                        destination: "/pub/chat/enter",
                        body: JSON.stringify({
                            beggar_id: data?.beggarId,
                            sender: data.nickname,
                            type: "ENTER",
                            message: `${data.nickname}님 입장하123셨습니다.`,
                            date: timestring,
                            userId: data.userId,
                        }),
                    });
                },
                // 접속이 끊어졌을 때
                onDisconnect: () => {
                    client.publish({
                        destination: "/pub/chat/leave",
                        body: JSON.stringify({
                            beggar_id: data.beggarId,
                            sender: data.nickname,
                            type: "LEAVE",
                            message: `${data.nickname}님 퇴장하셨습니다.`,
                            date: timestring,
                        }),
                    });
                },
            });
            stompClientRef.current = client;
            client.activate();
        }
        return () => {
            // 컴포넌트가 언마운트될 때 연결을 끊음
            if (stompClientRef.current) stompClientRef.current.deactivate();
        }
    }, [data]);


    // 채팅 업로드 핸들러
    const sendMessage = (message: string) => {
        if (message.trim() === "")
            return console.log("내용을 입력해주세요.");

        const sendList = {
            beggar_id: data.beggarId,
            sender: data.nickname,
            type: "TALK",
            message: message.trim(),
            date: timestring,
            username: data.username,
            userId: data.userId,
        };

        if (stompClientRef.current) {
            stompClientRef.current.publish({
                destination: "/pub/chat/send",
                body: JSON.stringify(sendList),
            });
        }
        setMessage("");

    };
    // 들어갈 이미지 핸들러 
    const sendImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
        // 썸네일 이미지를 담으려는 파일리더
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target) {
                setThumbnailImage(e.target.result as string);
            }
        };
        const file = e.target.files?.[0];
        if (file) {
            reader.readAsDataURL(file);
            // 이미지 전송할 때 쓰려는
            setImage(file);
        }
    };

    // 이미지 업로드 핸들러
    const sendImage = async () => {
        const newList = new FormData();
        newList.append("image", image);
        try {
            const response = await instance.post("/chat/image", newList, {
                headers: {
                    ACCESS_KEY: `Bearer ${token}`,
                },
            });
            // 이미지 데이터        
            const imageData = response.data;
            // 서버에 보낼 데이터
            const sendList = {
                beggar_id: data.beggarId,
                sender: data.nickname,
                type: "TALK",
                message: "",
                image: imageData,
                date: timestring,
                username: data.username,
                userId: data.userId,
            };

            if (stompClientRef.current) {
                stompClientRef.current.publish({
                    destination: "/pub/chat/send",
                    body: JSON.stringify(sendList),
                });
            }
            setImage("");
            setMessage("");
            setThumbnailImage("")
        } catch (err) {
            console.log(`이미지 보내는 중에 오류 발생: ${err}`);
        }
    };

    const usersProfileHandler = (userId: number) => {
        setOnMessageUserId(userId)
        setModalOpen(true);

    }
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        navigate("/login")
        return <div>Error</div>;
    }
    // console.log("chatMessages = ", chatMessages)
    // console.log("data = ", data)
    // console.log("userId = ", userId)
    return (
        <div className='currentBackGround'>
            <Header>푸어talk</Header>
            {modalOpen && <UsersProfilePage setModalOpen={setModalOpen} onMessageUserId={onMessageUserId} />}
            {chatMessages && chatMessages.length > 0 && (
                <div className='Messagesbox' ref={messagesEndRef}>
                    {chatMessages?.map((message, index) => (
                        <div className="chatBox" key={index}>
                            {message.type === "ENTER" && message.beggar_id !== null && (
                                <div className="introMessage" >{message.message}</div>
                            )}
                            {message.type === "LEAVE" && message.beggar_id !== null && (
                                <div className="goodByeMessage">{message.message}</div>
                            )}
                            {message.type === "TALK" && message.beggar_id !== null && (
                                <>
                                    {message.sender === data.nickname ? (
                                        // 자신이 보낸 메시지인 경우
                                        <>
                                            <div className="myChat">
                                                {message.image ? (
                                                    <div>
                                                        <img className="sendMyImageBox" src={message.image} />
                                                    </div>
                                                ) : (
                                                    <div>{message.message}
                                                        {/* <button onClick={showModal}>Modal 1</button> */}</div>
                                                )}
                                            </div>
                                            <div className="nowTime1">{message.date.slice(13, -3)}</div>
                                        </>
                                    ) : (
                                        // 다른 사용자가 보낸 메시지인 경우
                                        <>
                                            <button type="button" className="yourChatProfile"
                                                onClick={() => usersProfileHandler(message.userId)}
                                            >.</button>
                                            <div className="yourChat">
                                                {message.image ? (
                                                    <div>
                                                        <img className="sendYourImageBox" src={message.image} />
                                                    </div>
                                                ) : (
                                                    <div>{message.message}</div>
                                                )}
                                            </div>
                                            <div className="nowTime2">{message.date.slice(13, -3)}</div>
                                        </>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div>
                {thumbnailImage === "" ?
                    <input
                        className='SandInput'
                        type="text"
                        placeholder="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} />
                    : <>
                        {/* <input
                            className='SandThumbnailInput'
                            type="file"
                            onChange={sendImageHandler} /> */}
                        <img
                            className='SanthumbnailImage'
                            src={thumbnailImage}
                            alt="Thumbnail"
                        />
                    </>
                }
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
                        onChange={sendImageHandler}
                    />{image === "" ?
                        <button
                            className='SandButton'
                            type="button"
                            onClick={() => sendMessage(message)}
                        ><FaArrowCircleUp /></button>
                        :
                        <button
                            className='SandButton'
                            type="button"
                            onClick={sendImage}
                        ><FaArrowCircleUp /></button>}
                </div>
            </div>
        </div>
    );
};

export default PoorTalk;
