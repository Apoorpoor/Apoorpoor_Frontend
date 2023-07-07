/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import instance from './instance';

const userId = localStorage.getItem('userId');

interface ErrorType extends Error {
  response: {
    data: {
      message: string;
      code: number;
    };
    status: number;
  };
}

// 닉네임 전체 조회
const getNicknameCheck = async () => {
  try {
    const response = await instance.get(`/beggar/info`);
    return response.data;
  } catch (err) {
    return err as ErrorType;
  }
};

// 닉네임 중복, 욕설 테스트
const checkNicknameValidation = async (nickname: string): Promise<any> => {
  try {
    const response = await instance.get(`/beggar/check/${nickname}`);
    return response.status;
  } catch (error) {
    return (error as ErrorType).response.status;
  }
};

// 닉네임 등록하기
const postNickname = async (nickname: string): Promise<any> => {
  try {
    const response = await instance.post(`/beggar`, {
      nickname,
    });
    return response.data;
  } catch (error) {
    throw error as ErrorType;
  }
};

// 나이 등록하기
const putAge = async (age: number): Promise<any> => {
  try {
    const response = await instance.put(`/user/age`, {
      age,
    });
    return response.data;
  } catch (error) {
    throw error as ErrorType;
  }
};

// 성별 등록하기
const putGender = async (gender: string): Promise<any> => {
  try {
    const response = await instance.put(`/user/gender`, {
      gender,
    });
    return response.data;
  } catch (error) {
    throw error as ErrorType;
  }
};

const firstLogin = async () => {
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const urlCode = url.searchParams.get('code');

  try {
    console.log('try 실행');
    await instance.post(`/kakao?code=${urlCode}`).then((response) => {
      const accessToken = response.headers.Authorization;
      // const aToken = accessToken.split(" ")[1];
      console.log('response = ', response);
      //     // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      const refreshToken = response.headers['Authorization_refresh'];
      // const rToken = refreshToken.split(" ")[1];
      localStorage.setItem('AToken', accessToken);
      Cookies.set('RToken', refreshToken, { expires: 7 });

      alert('로그인 성공');
      navigate(`/nickname`);

      return { response };
    });
  } catch (err) {
    console.log(`로그인 중 API 오류 발생: ${err}`);
    throw err;
  }
};

const getUser = async () => {
  try {
    const response = await instance.get(`/beggar`);
    return response.data;
  } catch (err) {
    console.log(`거지조회  API 오류 발생: ${err}`);
    throw err;
  }
};

const getUsersProfile = async (userId: any) => {
  // 토큰
  const token = localStorage.getItem('AToken');
  try {
    const response = await instance.get(`/beggar/${userId}`, {
      headers: {
        ACCESS_KEY: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(`다른유저 조회 API 오류 발생: ${err}`);
    throw err;
  }
};

// 채팅참여 전체 조회
const getChatList = async () => {
  try {
    const response = await instance.get(`/chat/list`);
    return response.data;
  } catch (err) {
    console.log(`채팅참여 API 오류 발생: ${err}`);
    throw err;
  }
};

// 메세지 불러오기
const getMessageList = async () => {
  try {
    const response = await instance.get(`/chatRoom/enter/${userId}`);
    return response.data;
  } catch (err) {
    console.log(`메시지 받아오기 API 오류 발생: ${err}`);
    throw err;
  }
};

// 사진 불러오기
const getImageList = async () => {
  try {
    const response = await instance.get(`/chat/images`);
    return response.data;
  } catch (err) {
    console.log(`이미지 받아오기 API 오류 발생: ${err}`);
    throw err;
  }
};

export {
  getNicknameCheck,
  firstLogin,
  getUser,
  getUsersProfile,
  postNickname,
  putAge,
  putGender,
  checkNicknameValidation,
  getChatList,
  getMessageList,
  getImageList,
};
