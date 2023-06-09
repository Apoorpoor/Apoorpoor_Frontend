/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/no-extraneous-dependencies */

import '../../styles/pages/_Login.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import Logo from '../../static/image/apoorpoorLogo.svg';
import KakaoLogin from '../../static/image/login/kakao_login_medium_wide.png';
import KAKAO_AUTH_URL from '../../api/Oauth';
import carousel1 from '../../static/image/carousel/carousel1.png';
import carousel2 from '../../static/image/carousel/carousel2.png';
import carousel3 from '../../static/image/carousel/carousel3.png';

function Login() {
  // 캐러셀
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 5000,
    dots: true,
    swipe: true,
  };

  const JWTEXPIRYTIME = 24 * 3600 * 1000; // 만료 시간 (24시간 밀리 초로 표현)
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const urlCode = url.searchParams.get('code');

  const KakaoLoginHandler = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <main className="Login">
      <div className="carouselBg">
        <Slider
          infinite={settings.infinite}
          slidesToShow={settings.slidesToShow}
          slidesToScroll={settings.slidesToScroll}
          autoplay={settings.autoplay}
          dots={settings.dots}
          swipe={settings.swipe}
          speed={settings.speed}
          autoplaySpeed={settings.autoplaySpeed}
        >
          <div className="carousel">
            <div className="carouselText">
              <p className="carouselTitle">
                가계부 작성하고
                <br />
                푸어 포인트도 받으세요
              </p>
              <p className="carouselComment">
                가게부 작성 습관으로 절약, 저축까지!
                <br />
                올해는 해낼 수 있어요
              </p>
            </div>
            <img className="carouselImg first" src={carousel1} alt="캐러셀1" />
          </div>

          <div className="carousel">
            <div className="carouselText">
              <p className="carouselTitle">
                열심히 모은 포인트로
                <br />
                나만의 푸어를 꾸며보세요
              </p>
              <p className="carouselComment">
                레벨별로 구매할 수 있는 아이템이 달라요
                <br />
                누구보다 빠르게 남들과는 다르게 만들러 갈까요?
              </p>
            </div>

            <img className="carouselImg second" src={carousel2} alt="캐러셀2" />
          </div>

          <div className="carousel">
            <div className="carouselText">
              <p className="carouselTitle">
                이렇게 멋진 푸어를
                <br />
                나만 볼 수는 없죠
              </p>
              <p className="carouselComment">
                푸어들과 채팅하면서 절약 꿀팁도 공유하고,
                <br />
                랭킹도 올리면서 나만의 푸어를 자랑해 봐요!
              </p>
            </div>
            <img className="carouselImg third" src={carousel3} alt="캐러셀3" />
          </div>
        </Slider>
      </div>

      <div className="socialLogin">
        <button type="button" onClick={KakaoLoginHandler}>
          <img src={KakaoLogin} alt="카카오로그인" />
        </button>
      </div>
    </main>
  );
}

export default Login;
