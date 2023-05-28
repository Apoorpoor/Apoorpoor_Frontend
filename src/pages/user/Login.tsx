/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/function-component-definition */
import '../../styles/pages/_Login.scss';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import axios from 'axios';
import Logo from '../../static/image/apoorpoorLogo.svg';
import KakaoLogin from '../../static/image/login/kakao_login_medium_wide.png';
import KAKAO_AUTH_URL from '../../api/Oauth';

function Login() {

  const navigate = useNavigate();

  useEffect(() => {
    const getAccessToken = async (urlCode: string): Promise<void> => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login?code=${urlCode}`
          // , {urlCode}
        );
        const { accessToken } = response.headers.Authorization.split(" ")[1];
        const refreshToken = response.headers['Authorization-Refresh'].split(" ")[1];
        localStorage.setItem('ACC_Token', accessToken);
        localStorage.setItem('REF_Token', refreshToken);
        alert("로그인 성공");
        navigate(`/nickname`);
      } catch (error) {
        // 에러 처리
        console.log(error);
      }
    };

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
