/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/no-extraneous-dependencies */

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
  const url = new URL(window.location.href);
  const urlCode = url.searchParams.get('code');

  const KakaoLoginHandler = () => {
    window.location.href = KAKAO_AUTH_URL;
  }

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
