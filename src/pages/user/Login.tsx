/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import '../../styles/pages/_Login.scss';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Logo from '../../static/image/apoorpoorLogo.svg';
import KakaoLogin from '../../static/image/login/kakao_login_medium_wide.png';
import KAKAO_AUTH_URL from '../../api/Oauth';

function Login() {

  const JWTEXPIRYTIME = 24 * 3600 * 1000; // 만료 시간 (24시간 밀리 초로 표현)
  const navigate = useNavigate();
  useEffect(() => {
    const getAccessToken = async (urlCode: string): Promise<void> => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login?code=${urlCode}`
          // , {urlCode}
        );
        const { accessToken } = response.headers.Authorization.split(" ")[1];
        const refreshToken = response.headers['Authorization-Refresh'].split(" ")[1];

        // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
        // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        localStorage.setItem('ACC_Token', accessToken);
        Cookies.set('REF_Token', refreshToken, { expires: 7 });
        alert("로그인 성공");
        navigate(`/nickname`);
      } catch (error) {
        // 에러 처리
        console.log(error);
      }
    };

    const onSilentRefresh = () => {
      axios.post('/silent-refresh')
        .then(onLoginSuccess)
        .catch(error => {
          // ... 로그인 실패 처리
        });
    }

    const onLoginSuccess = (response: { data: { accessToken: any; }; }) => {
      const { accessToken } = response.data;

      // accessToken 설정
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // accessToken 만료하기 1분 전에 로그인 연장
      setTimeout(onSilentRefresh, JWTEXPIRYTIME - 60000);
    }

    const url = new URL(window.location.href);
    const urlCode = url.searchParams.get('code');
    if (urlCode) {
      getAccessToken(urlCode);
    }
  }, [navigate]);

  const KakaoLoginHandler = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <main className='Login'>
      <h1>
        <img src={Logo} alt='로고' />
        나만의 거지 키우기
      </h1>
      <div className='socialLogin'>
        <button type='button' onClick={KakaoLoginHandler}>
          <img src={KakaoLogin} alt='카카오로그인' />
        </button>
      </div>
    </main>
  );
}

export default Login;
