/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/function-component-definition */

import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import instance from '../../api/instance';

const Redirection: React.FC = () => {
  const JWTEXPIRYTIME = 24 * 3600 * 1000; // 만료 시간 (24시간 밀리 초로 표현)
  const navigate = useNavigate();

  useEffect(() => {
    const getAccessToken = async (urlCode: string): Promise<void> => {
      try {
        const response = await axios.get(
          `http://3.34.85.5:8080/oauth/kakao?code=${urlCode}`
          // , {urlCode}
        );
        const accessToken = response.headers.access_key;
        const AToken = accessToken.split(' ')[1];

        const refreshToken = response.headers.refresh_key;
        const RToken = refreshToken.split(' ')[1];

        const nickname = response.headers.nickname_flag;
        // console.log("nickname", nickname);
        // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
        // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        localStorage.setItem('AToken', AToken);
        Cookies.set('RToken', RToken, { expires: 7 });
        nickname === 'true' && nickname ? navigate(`/`) : navigate(`/nickname`);
        // navigate(`/nickname`);
      } catch (error) {
        // 에러 처리
        console.log(error);
      }
    };

    const onSilentRefresh = () => {
      axios
        .post('/silent-refresh')
        .then(onLoginSuccess)
        .catch((error) => {
          // ... 로그인 실패 처리
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
  return (
    <div>
      <h1>리다이렉션 페이지</h1>
    </div>
  );
};

export default Redirection;
