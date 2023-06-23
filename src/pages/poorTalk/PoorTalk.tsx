/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import '../../styles/pages/_PoorTalk.scss';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useQuery, useQueryClient } from 'react-query';
import { FaCamera, FaArrowCircleUp } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { getUser, getChatList, getMessageList, getImageList } from '../../api/members';
import { Header, SlickSlider } from '../../components';
import instance from '../../api/instance';
import UsersProfilePage from './UsersProfilePage';
import Loading from '../status/Loading';
import Error from '../status/Error';
import hamburgerBt from '../../static/image/poortalk/hamburgerBt.png';
import people from '../../static/image/poortalk/people.png';
import people2 from '../../static/image/poortalk/people2.png';
import photo from '../../static/image/poortalk/photo.png';
import rightArrow from '../../static/image/poortalk/rightArrow.png';
import x from '../../static/image/poortalk/x.png';

function PoorTalk(): JSX.Element {
  // 쿼리 클라이언트
  const queryClient = useQueryClient()
  const navigate = useNavigate();
  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate('/introTalk');
  };

  // 처음에 받아오는 내 푸어 정보
  const [user, setUser] = useState<any>(null);
  // 보내는 메세지 인풋값
  const [sendMessage, setSendMessage] = useState<string>('');
  // 보내는 이미지
  const [image, setImage] = useState<string | Blob>('');
  // 섬네일 이미지
  const [thumbnailImage, setThumbnailImage] = useState<string>('');
  // 메세지에서 추출한 유저 아이디 모달창으로 전달
  const [inMessageUserId, setinMessageUserId] = useState<number>(user?.userId);
  // 상대 유저 프로필 모달창
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // 채팅 참여 인원 확인 모달창
  const [chatListModal, setChatListModal] = useState(false)
  // 채팅 이미지 리스트 모달창
  const [imageListModal, setImageListModal] = useState(false);
  // 토큰
  const token = localStorage.getItem('AToken');
  // 내 정보 받아오기
  const { isLoading, error, data } = useQuery('getUser', getUser);

  // 채팅 유저들 받아오기(채팅 참여 목록, 인원수 확인용)
  const [chatList, setChatList] = useState([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: chatList2 } = useQuery('getChatList', getChatList, {
    onSuccess: (res) => {
      setChatList(res)
      // console.log("res= ", res)
    },
  })

  // 보여지는 메세지들, 닉네임 정보
  const [messageListAll, setmessageListAll] = useState<IMessage[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: messageList } = useQuery("getMessageList", getMessageList, {
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      setmessageListAll(res.chatList)
      // console.log("res.messageList= ", res.chatList)
    },
  })
  // a3 저장된 사진들 
  const { data: imageList2 = [] }: ImageListType | any = useQuery('getImageList', getImageList)
  const imageList = Array.isArray(imageList2) ? imageList2 : [];

  // 이미지 디테일 (확대)
  const [imageDetailModal, setImageDetailModal] = useState(false);
  // 이미지 디테일에 보내주는 img src값 src={imageDetailModalSrc}
  const [imageDetailModalSrc, setImageDetailModalSrc] = useState<
    string | undefined
  >('');

  // 클라이언트
  const stompClientRef = useRef<Client | null>(null);
  // 최신글이 올라오면 맨 밑으로 포커싱
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
  const time = {
    year: today.getFullYear(), // 현재 년도
    month: (today.getMonth() + 1).toString().padStart(2, '0'), // 현재 월
    date: today.getDate().toString().padStart(2, '0'), // 현제 날짜
    hours: today.getHours().toString().padStart(2, '0'), // 현재 시간
    minutes: today.getMinutes().toString().padStart(2, '0'), // 현재 분
    seconds: today.getSeconds().toString().padStart(2, '0'), // 현재 초
  };
  const timestring = `${time.year}-${time.month}-${time.date} ${time.hours} : ${time.minutes} ${time.seconds}`;

  // 스크롤 부분(채팅방 입장시 가장 아래로, 채팅로그가 업데이트 될 때마다 가장 아래로)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageListAll]);

  // 웹소켓 연결
  useEffect(() => {
    if (data !== undefined) {
      setUser(data);
      // 클라이언트 생성 후 소켓 연결(헤더에 토큰)
      const client = new Client({
        webSocketFactory: () =>
          new SockJS(`${process.env.REACT_APP_SERVER_URL}/ws-edit`),
        connectHeaders: {
          ACCESS_KEY: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        // 접속했을 때 구독 서버에서 받은 URL필요
        onConnect: () => {
          client.subscribe('/sub/chat/room', (chatContent) => {
            const newMessage = JSON.parse(chatContent.body) as IMessage;
            if (newMessage.beggar_id !== null) {
              setmessageListAll((originalMessages) => [
                ...originalMessages,
                newMessage,
              ]);
            }
          });
          // 서버에서 정해둔 URL 필요 => 구독 후 입장시 메세지 보내는 로직
          client.publish({
            destination: '/pub/chat/enter',
            body: JSON.stringify({
              beggar_id: data?.beggarId,
              date: timestring,
              message: `${data.nickname}님 입장213231하셨습니다.`,
              sender: data.nickname,
              type: 'ENTER',
              userId: data.userId,
              level: data.level,
            }),
          });
        },
        // 접속이 끊어졌을 때 서버에서 받은 URL 필요
        onDisconnect: () => {
          client.publish({
            destination: '/pub/chat/leave',
            body: JSON.stringify({
              beggar_id: data.beggarId,
              date: timestring,
              message: `${data.nickname}님 퇴장하셨습니다.`,
              sender: data.nickname,
              type: 'LEAVE',
              userId: data.userId,
              level: data.level,
            }),
          });
        },
      });
      // 객체를 할당하여 참조를 유지합니다. 이는 컴포넌트가 언마운트될 때 client 객체를 사용하여 연결을 끊을 수 있도록 합니다.
      stompClientRef.current = client;
      client.activate();
    }
    return () => {
      // 컴포넌트가 언마운트될 때 연결을 끊음
      if (stompClientRef.current) stompClientRef.current.deactivate();
    };
  }, [data]);

  // 채팅 업로드 핸들러
  const sendMessages = (nowChatMessage: string): void => {
    if (nowChatMessage.trim() === '') {
      // console.log('내용을 입력해주세요.');
      return;
    }
    const message2 = `${nowChatMessage}  `;

    const sendList = {
      beggar_id: data.beggarId,
      date: timestring,
      message: message2,
      sender: data.nickname,
      type: 'TALK',
      userId: data.userId,
      level: data.level,
    };
    // console.log("sendList = ", sendList)
    if (stompClientRef.current) {
      stompClientRef.current.publish({
        destination: '/pub/chat/send',
        body: JSON.stringify(sendList),
      });
      queryClient.invalidateQueries("getUser")
      queryClient.invalidateQueries("getChatList")
      queryClient.invalidateQueries("getMessageList")
      queryClient.invalidateQueries("getImageList")
    }
    setSendMessage('');
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
        beggar_id: data.beggarId,
        date: timestring,
        image: imageData,
        message: '',
        sender: data.nickname,
        type: 'TALK',
        userId: data.userId,
        level: data.level,
      };

      if (stompClientRef.current) {
        stompClientRef.current.publish({
          destination: '/pub/chat/send',
          body: JSON.stringify(sendList),
        });
      }
      setImage('');
      setSendMessage('');
      setThumbnailImage('');
    } catch (err) {
      console.log(`이미지 보내는 중에 오류 발생: ${err}`);
    }
  };
  // 모달창으로 유저ID 프롭스로 보내주고 오픈하는 함수
  const usersProfileHandler = (userId: number) => {
    setinMessageUserId(userId);
    setModalOpen(true);
  };
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    if (
      (error as AxiosError).response &&
      (error as AxiosError).response?.status === 403
    ) {
      localStorage.removeItem('AToken');
      localStorage.removeItem('userId');
      Cookies.remove('RToken');
      alert('로그인 시간이 만료 되었어요!');
    }
    return <Error />;
  }

  // 채팅 참여 목록 모달
  const chatListModalHandler = () => {
    setChatListModal(!chatListModal)
  }
  // 채팅 참여 목록 모달 속 이미지 모달 하나 더 있음
  const imageListModalHandler = () => {
    setImageListModal(!imageListModal)
  }
  // 이미지 디테일(확대) 핸들러
  const imageDetailModalHandler = (imageUrl: string | undefined) => {
    setImageDetailModalSrc(imageUrl);
    setImageDetailModal(!imageDetailModal)
  }

  // console.log("data = ", data)
  // console.log("userId = ", userId)
  // console.log("ChatList = ", ChatList)
  // console.log(chatListRef.current.current)
  return (
    <div className="currentBackGround">
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        푸어talk
        <button type="button" onClick={chatListModalHandler}>
          <img className="HamburgerBt" src={hamburgerBt} alt="햄버거 버튼" />
        </button>
        {imageDetailModal && (
          <div
            className="chatListModalContainer2"
            onClick={() => setImageDetailModal(!imageDetailModal)}
          >
            <img className="asdasdasd" src={imageDetailModalSrc} alt="" />
          </div>
        )}
        {imageListModal && (
          <div
            className="imageListModalOpen"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="button"
            tabIndex={0}
          >
            <div
              className="imageListModalCloseForm"
              onClick={imageListModalHandler}
            >
              <button type="button" onClick={imageListModalHandler}>
                <img className="imageListModalClose" src={x} alt="x 버튼" />
              </button>
              <div className="imageListModalCloseBack">사진</div>
            </div>
            <div className="imageListModalImageForm">
              {imageList?.map(
                (item: {
                  imageId: React.Key | null | undefined;
                  imageUrl: string | undefined;
                }) => (
                  <div key={item.imageId}>
                    {item.imageUrl !== null && item.imageUrl !== undefined && (
                      <button
                        type="button"
                        onClick={() => imageDetailModalHandler(item.imageUrl)}
                      >
                        <img
                          className="imageListModalImage"
                          src={item.imageUrl}
                          alt=""
                        />
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {chatListModal && 
          <div>
            <button
              className="chatListModalContainer"
              onClick={chatListModalHandler}
            >
              <div
                className="chatListModalWrapper"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="button"
                tabIndex={0}
              >
                <div
                  className="chatListHeaderImage"
                  onClick={imageListModalHandler}
                >
                  <div>
                    <img src={photo} alt="피플" />
                    사진
                  </div>
                  <img src={rightArrow} alt="애로우" />
                </div>
                <div className="chatMessageImagecontainer">
                  {/* {imageList?.map((item: { imageId: React.Key | number | null | undefined; imageUrl: string | undefined; }) => (
                  <div key={item.imageId}>
                    {item.imageUrl !== null && item.imageUrl !== undefined && (
                      <img className='chatMessageImage' src={item.imageUrl} alt='' />
                    )}
                  </div>
                ))} */}
                <SlickSlider
                  id="poorTalkSlide"
                  loop={false}
                  slidesToShow={3}
                  slidesToScroll={1}
                  arrows={false}
                >
                  {imageList?.map((item: { imageId: React.Key | number | null | undefined; imageUrl: string | undefined; }) => (
                    <div key={item.imageId}
                      className="item" role="button" tabIndex={0}>
                      {item.imageUrl !== null && item.imageUrl !== undefined && (
                        <img src={item.imageUrl} alt='' />
                      )}
                    </div>
                  ))}
                </SlickSlider>
              </div>
              <div className='chatListHeader'>
                <img className='chatListHeaderPeople' src={people} alt='피플' />대화상대
              </div>
              {chatList?.map((poor: any, index: React.Key | null | undefined) =>
                <div key={index} className='chatListModalForm'>
                  <div className={`chatListModalWrap${poor?.level}`}>{poor.level}</div>
                  <div>{poor.sender}</div>
                </div>
              )}
            </div>
          </button>
        </div>}
        <div className='AllUsers'>
          <img src={people2} alt='피플' />{chatList?.length}</div>
      </Header>
      {modalOpen && (
        <UsersProfilePage
          setModalOpen={setModalOpen}
          inMessageUserId={inMessageUserId}
        />
      )}
      {messageListAll && messageListAll.length > 0 && (
        <div className="Messagesbox">
          {messageListAll?.map((message, index) => (
            <div className="chatBox" key={index}>
              {message.type === 'ENTER' && message.beggar_id !== null && (
                <div className="introMessage">{message.message}</div>
              )}
              {message.type === 'LEAVE' && message.beggar_id !== null && (
                <div className="goodByeMessage">{message.message}</div>
              )}
              {message.type === 'TALK' && message.beggar_id !== null && (
                <>
                  {message.sender === data.nickname ? (
                    // 자신이 보낸 메시지인 경우
                    <>
                      <div className="myChat">
                        {message.image ? (
                          <div>
                            <img
                              className="sendMyImageBox"
                              src={message.image}
                              alt="images"
                            />
                          </div>
                        ) : (
                          <div>{message.message}</div>
                        )}
                      </div>
                      <div className="nowTime1">
                        {Number(message.date?.split(' ')[1]) > 12
                          ? `오후 ${Number(message.date?.split(' ')[1]) - 12
                          } : ${message.date?.split(' ')[3]}`
                          : `오전 ${message.date?.split(' ')[1]} : ${message.date?.split(' ')[3]
                          }`}
                      </div>
                    </>
                  ) : (
                    // 다른 사용자가 보낸 메시지인 경우
                    <>
                      <button
                        type="button"
                        className={`yourChatProfile${message?.level}`}
                        onClick={() => usersProfileHandler(message.userId)}
                      >
                        {message.level}
                      </button>
                      <div className="yourChatNickName">{message.sender}</div>
                      <div className="yourChat">
                        {message.image ? (
                          <div>
                            <img
                              className="sendYourImageBox"
                              src={message.image}
                              alt="images"
                            />
                          </div>
                        ) : (
                          <div>{message.message}</div>
                        )}
                      </div>
                      <div className="nowTime2">
                        {Number(message.date?.split(' ')[1]) > 12
                          ? `오후 ${
                              Number(message.date?.split(' ')[1]) - 12
                            } : ${message.date?.split(' ')[3]}`
                          : `오전 ${message.date?.split(' ')[1]} : ${
                              message.date?.split(' ')[3]
                            }`}
                      </div>
                    </>
                  )}
                  {/* 새로 채팅이 생기면 맨 아래로 포커싱 */}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="sendInputWrap">
        <div className="thumbnailImageBox">
          {thumbnailImage === '' ? (
            ''
          ) : (
            <img
              className="SanthumbnailImage"
              src={thumbnailImage}
              alt="Thumbnail"
            />
          )}
        </div>
        <input
          className="SendInput"
          type="text"
          placeholder="message"
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              sendMessages(sendMessage);
            }
          }}
        />
        <button
          className="SendButton"
          type="button"
          onClick={() => sendMessages(sendMessage)}
          aria-label="메세지 전송"
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
              className="SendButton"
              type="button"
              onKeyUp={() => sendMessages(sendMessage)}
              onClick={() => sendMessages(sendMessage)}
              aria-label="메세지 전송"
            >
              <FaArrowCircleUp />
            </button>
          ) : (
            <button
              className="SendButton"
              type="button"
              onClick={sendImage}
              aria-label="이미지 전송"
            >
              <FaArrowCircleUp />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PoorTalk;

interface IMessage {
  beggar_id: number;
  date: string;
  image?: string;
  message: string;
  sender: string | number;
  type: 'ENTER' | 'TALK' | 'LEAVE';
  userId: number;
  level: number;
}

// interface ChatListType {
//   length: ReactNode;
//   beggarId: number;
//   sender: string;
//   userId: number;
//   level: number;
// }


interface ImageListType {
  imageId: number,
  imageUrl: string,
}
