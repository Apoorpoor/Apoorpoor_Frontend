import React from 'react';
import '../../styles/pages/_Login.scss';
import Logo from '../../static/image/apoorpoorLogo.svg';
import KakaoLogin from '../../static/image/login/kakao_login_medium_wide.png';
import KAKAO_AUTH_URL from '../../api/Oauth';

function Login() {
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
