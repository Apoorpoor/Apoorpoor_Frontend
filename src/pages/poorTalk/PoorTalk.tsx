/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/order */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable consistent-return */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Client, Message, Stomp, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useQuery } from 'react-query';
import { getUser } from '../../api/members';
import '../../styles/pages/_PoorTalk.scss';
import { FaCamera, FaArrowCircleUp, FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { Header } from '../../components';
import instance from '../../api/instance';

interface IJoinMessage {
  type: 'ENTER';
  sender: string;
  message: string;
  beggar_id: string | number;
  date: string;
  image?: string;
}
interface ITalkMessage {
  type: 'TALK';
  sender: string;
  message: string;
  beggar_id: string | number;
  date: string;
  image?: string;
}
interface ILEAVEMessage {
  type: 'LEAVE';
  sender: string;
  message: string;
  beggar_id: string | number;
  date: string;
  image?: string;
}
type IMessage = IJoinMessage | ITalkMessage | ILEAVEMessage;
function PoorTalk() {
  const [inputValue, setInputValue] = React.useState('');
  // 처음에 받아오는 내 푸어 정보
  const [user, setUser] = useState<any>(null);
  // const [stompClient, setStompClient] = useState(null);
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  // 보여지는 메세지들, 닉네임 정보
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  // 보내는 메세지
  const [message, setMessage] = useState<string>('');
  // 보내는 이미지
  const [image, setImage] = useState<string | Blob>('');
  // 토큰
  const token = localStorage.getItem('AToken');
  // 유정 고유 아이디
  const userId = localStorage.getItem('userId');
  // 유저 정보 받아오기
  const { isLoading, isError, data } = useQuery('getUser', getUser);
  // 소켓
  const socket = new SockJS('http://3.34.85.5:8080/ws-edit');
  // 클라이언트
  const stompClientRef = useRef<Client | null>(null);
  // 네비게이트
  const navigate = useNavigate();
  // console.log("userId = ", userId); // 확인함
  // 날짜 데이터
  let today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
  let time = {
    year: today.getFullYear(), // 현재 년도
    month: (today.getMonth() + 1).toString().padStart(2, '0'), // 현재 월
    date: today.getDate().toString().padStart(2, '0'), // 현제 날짜
    hours: today.getHours().toString().padStart(2, '0'), // 현재 시간
    minutes: today.getMinutes().toString().padStart(2, '0'), // 현재 분
    seconds: today.getSeconds().toString().padStart(2, '0'), // 현재 초
  };
  let timestring = `${time.year}년 ${time.month}월 ${time.date}일 ${time.hours} : ${time.minutes} ${time.seconds}초`;
  // console.log("timestring = ", timestring); // ��인함
  // console.log("date = ", date); //
  useEffect(() => {
    if (data?.beggar_id !== null) {
      //   setUser(data);
      // 소켓 연결
      const client = new Client({
        webSocketFactory: () => new SockJS(`http://3.34.85.5:8080/ws-edit`),
        connectHeaders: {
          ACCESS_KEY: `Bearer ${token}`,
        },
        // debug: (str: string) => {
        //     console.log("debug == ", str);
        // },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        // 접속했을 때
        onConnect: (message) => {
          console.log('Connected: ', message);
          console.log('data', data);
          client.subscribe('/sub/chat/room', (message) => {
            const parsedMessage = JSON.parse(message.body) as IMessage;
            setChatMessages((chatMessages) => [...chatMessages, parsedMessage]);
          });
          client.publish({
            destination: '/pub/chat/enter',
            body: JSON.stringify({
              beggar_id: data.beggar_id,
              sender: data.nickname,
              type: 'ENTER',
              message: `${data.nickname}님 입장하123셨습니다.`,
              date: timestring,
            }),
          });
        },
        onDisconnect: () => {
            if (data.beggar_id === null) return;
            client.publish({
              destination: '/pub/chat/leave',
              body: JSON.stringify({
                beggar_id: data.beggar_id,
                sender: data.nickname,
                type: 'LEAVE',
                message: `${data.nickname}님 퇴장123.`,
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
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [data]);
  // 채팅 업로드 핸들러
  const sendMessage = (message: string) => {
    if (message.trim() === '') return console.log('내용을 입력해주세요.');
    const sendList = {
      beggar_id: data.beggar_id,
      sender: data.nickname,
      type: 'TALK',
      message: message.trim(),
      date: timestring,
    };
    if (stompClientRef.current) {
      stompClientRef.current.publish({
        destination: '/pub/chat/send',
        body: JSON.stringify(sendList),
      });
    }
    setMessage('');
  };
  // 들어갈 이미지 핸들러
  const sendImageHandler = (e: any) => {
    setImage(e.target.files[0]);
  };
  // 이미지 업로드 핸들러
  const sendImage = async () => {
    const newList = new FormData();
    newList.append('image', image);
    try {
      const response = await instance.post('/chat/image', newList, {
        headers: {
          ACCESS_KEY: `Bearer ${token}`,
        },
      });
      // 이미지 데이터
      const imageData = response.data;
      // 서버에 보낼 데이터
      const sendList = {
        beggar_id: data.beggar_id,
        sender: data.nickname,
        type: 'TALK',
        message: '',
        image: imageData,
        data: timestring,
      };
      if (stompClientRef.current) {
        stompClientRef.current.publish({
          destination: '/pub/chat/send',
          body: JSON.stringify(sendList),
        });
      }
      setImage('');
      setMessage('');
    } catch (err) {
      console.log(`이미지 보내는 중에 오류 발생: ${err}`);
    }
  };
  type MessageType = {
    type: 'ENTER' | 'LEAVE' | 'TALK';
    sender: string;
    message: string;
    beggar_id: string | number;
    date: string;
    image?: string;
  };
  type Props = {
    message: MessageType;
  };
  // console.log("userId = ", userId)
  console.log('chatMessages = ', chatMessages);
  // console.log("data = ", data)
  return (
    <div className="currentBackGround">
      <Header>푸어talk</Header>
      {/* <div className='Header'>
                <button type='button' onClick={() => navigate("/introTalk")}>
                    <FaChevronLeft className='Arrow' />
                </button>
                <div className='HeaderText'>푸어talk</div>
            </div> */}
      {chatMessages && chatMessages.length > 0 && (
        <div className="Messagesbox">
          {chatMessages?.map((message, index) => (
            <div className="chatBox" key={index}>
              {message.type === 'ENTER' && (
                <div className="introMessage">{message.message}</div>
              )}
              {message.type === 'LEAVE' && (
                <div className="goodByeMessage">{message.message}</div>
              )}
              {message.type === 'TALK' && (
                <>
                  {message.sender === data?.nickname ? (
                    // 자신이 보낸 메시지인 경우
                    <>
                      <div className="myChat">
                        {message.image ? (
                          <div>
                            <img
                              className="sendMyImageBox"
                              src={message.image}
                            />
                          </div>
                        ) : (
                          <div>{message.message}</div>
                        )}
                      </div>
                      <div className="nowTime1">{timestring.slice(13, -3)}</div>
                    </>
                  ) : (
                    // 다른 사용자가 보낸 메시지인 경우
                    <>
                      <button type="button" className="yourChatProfile">
                        .
                      </button>
                      <div className="yourChat">
                        {message.image ? (
                          <div>
                            <img
                              className="sendYourImageBox"
                              src={message.image}
                            />
                          </div>
                        ) : (
                          <div>{message.message}</div>
                        )}
                      </div>
                      <div className="nowTime2">{timestring.slice(13, -3)}</div>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
          {/* {message.type === "ENTER" && <div className="introMessage">{message.message}</div>} */}
          {/* {message.type === "LEAVE" && <div className="goodByeMessage">{message.message}</div>} */}
        </div>
      )}
      <div>
        <input
          className="SandInput"
          type="text"
          placeholder="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.which === 13 && sendMessage(message)}
        />
        <button
          className="SandButton"
          type="button"
          onClick={() => sendMessage(message)}
        >
          <FaArrowCircleUp />
        </button>
        <div className="filebox">
          <label htmlFor="ex_file">
            <FaCamera className="PoorTalkCamera" />
          </label>
          <input type="file" id="ex_file" onChange={sendImageHandler} />
          {image === '' ? (
            <button
              className="SandButton"
              type="button"
              onClick={() => sendMessage(message)}
            >
              <FaArrowCircleUp />
            </button>
          ) : (
            <button className="SandButton" type="button" onClick={sendImage}>
              <FaArrowCircleUp />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default PoorTalk;
