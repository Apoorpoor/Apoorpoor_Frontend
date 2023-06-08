/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { FaCamera, FaArrowCircleUp } from "react-icons/fa";
import { getUser } from "../../api/members";
import '../../styles/pages/_PoorTalk.scss';
import { Header } from '../../components';
import instance from "../../api/instance";
import UsersProfilePage from "./UsersProfilePage";
import basicPoor from '../../static/image/gender/basicPoor.png'
// import imageCompression from 'browser-image-compression';  

function PoorTalk(): JSX.Element {
    // 처음에 받아오는 내 푸어 정보
    const [user, setUser] = useState<any>(null);
    // 보여지는 메세지들, 닉네임 정보
    const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
    // 보내는 메세지
    const [sendMessage, setSandMessage] = useState<string>("");
    // 보내는 이미지
    const [image, setImage] = useState<string | Blob>("");
    // 섬네일 이미지
    const [thumbnailImage, setThumbnailImage] = useState<string>("");
    // 메세지에서 추출한 유저 아이디
    const [onMessageUserId, setOnMessageUserId] = useState<number>(user?.userId);
    // 토큰
    const token = localStorage.getItem("AToken");
    // 유정 고유 아이디 
    // const userId = localStorage.getItem("userId");
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

    // 날짜 데이터 
    const today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
    const time = {
        year: today.getFullYear(), // 현재 년도
        month: (today.getMonth() + 1).toString().padStart(2, "0"), // 현재 월
        date: today.getDate().toString().padStart(2, "0"), // 현제 날짜
        hours: today.getHours().toString().padStart(2, "0"), // 현재 시간
        minutes: today.getMinutes().toString().padStart(2, "0"), // 현재 분
        seconds: today.getSeconds().toString().padStart(2, "0"), // 현재 초
        milliseconds: today.getMilliseconds().toString().padStart(2, "0"), // 현재 밀리초
    };
    const timestring = `${time.year}년 ${time.month}월 ${time.date}일 ${time.hours} : ${time.minutes} ${time.seconds}초 ${time.milliseconds}`;

    // 스크롤 부분(채팅방 입장시 가장 아래로, 채팅로그가 업데이트 될 때마다 가장 아래로)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    useEffect(() => {
        if (data !== undefined) {
            setUser(data)
            // 클라이언트 생성 후 소켓 연결(헤더에 토큰) 
            const client = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {
                    'ACCESS_KEY': `Bearer ${token}`,
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                // 접속했을 때 구독 서버에서 받은 URL필요 
                onConnect: () => {
                    client.subscribe("/sub/chat/room", (chatContent) => {
                        const newMessage = JSON.parse(chatContent.body) as IMessage;
                        if (newMessage.beggar_id !== null) {
                            setChatMessages((originalMessages) => [...originalMessages, newMessage]);
                        }
                    });
                    // 서버에서 정해둔 URL 필요 => 구독 후 입장시 메세지 보내는 로직 
                    client.publish({
                        destination: "/pub/chat/enter",
                        body: JSON.stringify({
                            beggar_id: data?.beggarId,
                            sender: data.nickname,
                            type: "ENTER",
                            message: `${data.nickname}님 입장하셨습니다.`,
                            date: timestring,
                            userId: data.userId,
                        }),
                    });
                },
                // 접속이 끊어졌을 때 서버에서 받은 URL 필요 
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
            // Ref 초기값으로 클라이언트 저장 후 실행..?
            stompClientRef.current = client;
            client.activate();
        }
        return () => {
            // 컴포넌트가 언마운트될 때 연결을 끊음
            if (stompClientRef.current) stompClientRef.current.deactivate();
        }
    }, [data]);


    // 채팅 업로드 핸들러
    const sendMessages = (nowChatMessage: string): void => {
        if (nowChatMessage.trim() === "") {
            console.log("내용을 입력해주세요.");
            return;
        }

        const sendList = {
            beggar_id: data.beggarId,
            sender: data.nickname,
            type: "TALK",
            message: nowChatMessage.trim(),
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
        setSandMessage("");

    };
    // 들어갈 이미지 핸들러 
    const sendImageHandler = (event1: ChangeEvent<HTMLInputElement>) => {
        // 썸네일 이미지를 담으려는 파일리더
        const reader = new FileReader();
        reader.onload = (event2: ProgressEvent<FileReader>) => {
            if (event2.target) {
                setThumbnailImage(event2.target.result as string);
            }
        };
        const file = event1.target.files?.[0];
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
            setSandMessage("");
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
    console.log("chatMessages = ", chatMessages)
    // console.log("data = ", data)
    // console.log("userId = ", userId)
    return (
        <div className='currentBackGround'>
            <Header>푸어talk</Header>
            {modalOpen && <UsersProfilePage setModalOpen={setModalOpen} onMessageUserId={onMessageUserId} />}
            {chatMessages && chatMessages.length > 0 && (
                <div className='Messagesbox' ref={messagesEndRef}>
                    {chatMessages?.map((message) => (
                        <div className="chatBox" key={message.date}>
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
                                                        <img className="sendMyImageBox" src={message.image} alt="images" />
                                                    </div>
                                                ) : (
                                                    <div>{message.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="nowTime1">{message.date.slice(13, -8)}</div>
                                        </>
                                    ) : (
                                        // 다른 사용자가 보낸 메시지인 경우
                                        <>
                                            <button type="button" className="yourChatProfile"
                                                onClick={() => usersProfileHandler(message.userId)}
                                            ><img src={basicPoor} alt='거지 이미지' /></button>
                                            <div className="yourChat">
                                                {message.image ? (
                                                    <div>
                                                        <img className="sendYourImageBox" src={message.image} alt="images" />
                                                    </div>
                                                ) : (
                                                    <div>{message.message}</div>
                                                )}
                                            </div>
                                            <div className="nowTime2">{message.date.slice(13, -11)}</div>
                                        </>
                                    )}
                                    {/* <div ref={messagesEndRef} /> */}
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
                        value={sendMessage}
                        onChange={(e) => setSandMessage(e.target.value)} />
                    : <img
                        className='SanthumbnailImage'
                        src={thumbnailImage}
                        alt="Thumbnail"
                    />
                }
                <button
                    className='SandButton'
                    type="button"
                    onClick={() => sendMessages(sendMessage)}
                    aria-label="메세지 전송"
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
                            onClick={() => sendMessages(sendMessage)}
                            aria-label="메세지 전송"
                        ><FaArrowCircleUp /></button>
                        :
                        <button
                            className='SandButton'
                            type="button"
                            onClick={sendImage}
                            aria-label="이미지 전송"
                        ><FaArrowCircleUp /></button>}
                </div>
            </div>
        </div>
    );
};

export default PoorTalk;


interface IJoinMessage {
    type: "ENTER"
    sender: string | number
    message: string
    beggar_id: number
    date: string
    username: string
    userId: number
    image?: string
}
interface ITalkMessage {
    type: "TALK"
    sender: string | number
    message: string
    beggar_id: number
    date: string
    username: string
    userId: number
    image?: string
}

interface ILEAVEMessage {
    type: "LEAVE"
    sender: string | number
    message: string
    beggar_id: number
    date: string
    username: string
    userId: number
    image?: string
}
type IMessage = IJoinMessage | ITalkMessage | ILEAVEMessage;
