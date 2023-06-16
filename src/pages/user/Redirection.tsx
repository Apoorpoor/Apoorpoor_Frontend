/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/function-component-definition */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loading from '../status/Loading';

const Redirection: React.FC = () => {
  const JWTEXPIRYTIME = 2 * 3600 * 1000; // 만료 시간 (2시간 밀리 초로 표현)
  const navigate = useNavigate();

  useEffect(() => {
    const getAccessToken = async (urlCode: string): Promise<void> => {
      try {
        const response = await axios.get(`https://www.apoorpoor.com/oauth/kakao?code=${urlCode}`
          // , {urlCode}
        );
        const accessToken = response.headers.access_key;
        const AToken = accessToken.split(' ')[1];
        localStorage.setItem('AToken', AToken);

        const refreshToken = response.headers.refresh_key;
        const RToken = refreshToken.split(' ')[1];
        Cookies.set('RToken', RToken, { expires: 7 });

        // 유저아이디 받기
        const userId = response.headers.user_id;
        localStorage.setItem('userId', userId);

        // 닉네임이 있는지 확인 체크 있으면 메인페이지로
        const nickname = response.headers.nickname_flag;

        if (nickname === 'true' && nickname) {
          navigate(`/`);
        } else {
          navigate(`/nickname`);
        }
      } catch (error) {
        // 에러 처리
        console.log(error);
      }
    };

    const onSilentRefresh = () => {
      axios.get(`https://www.apoorpoor.com/oauth/kakao?code=${urlCode}`)
        .then(onLoginSuccess)
        .catch((error) => {
          // ... 로그인 실패 처리
          console.log(error);
        });
    };

    const onLoginSuccess = (response: { data: { accessToken: any } }) => {
      const { accessToken } = response.data;

      // accessToken 설정
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // accessToken 만료하기 1분 전에 로그인 연장
      setTimeout(onSilentRefresh, JWTEXPIRYTIME - 60000);
    };

    const url = new URL(window.location.href);
    const urlCode = url.searchParams.get('code');
    if (urlCode) {
      getAccessToken(urlCode);
    }
  }, []);
  return <Loading />;
};

export default Redirection;
