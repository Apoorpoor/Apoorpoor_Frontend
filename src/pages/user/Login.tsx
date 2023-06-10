import '../../styles/pages/_Login.scss';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import KakaoLogin from '../../static/image/login/kakao_login_medium_wide.png';
import KAKAO_AUTH_URL from '../../api/Oauth';
import carousel1 from '../../static/image/carousel/carousel1.png';
import carousel2 from '../../static/image/carousel/carousel2.png';
import carousel3 from '../../static/image/carousel/carousel3.png';
import A from '../../static/image/login/A.png'
import Poor from '../../static/image/login/Poor.png'
import A2 from '../../static/image/login/A2.png'
import Poor2 from '../../static/image/login/Poor2.png'

function Login() {
  const [modalOpen, setModalOpen] = useState(true)

  const closeModal = () => {
    setTimeout(() => {
      setModalOpen(false);
    }, 4000);
  }
  const [imageSrc, setImageSrc] = useState({
    image1: A,
    image2: Poor2
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageSrc({
        image1: A2,
        image2: Poor
      });
    }, 1000);
    closeModal()
    return () => clearTimeout(timer);
  }, []);

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

  const KakaoLoginHandler = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (<main className="Login">
    {modalOpen &&
      <div className='splashScreen'>
        <img src={A} alt='어' />
        <img src={imageSrc.image2} alt='푸' />
        <img src={imageSrc.image1} alt='어' />
        <img src={Poor2} alt='푸' />
        <p>나만의 거지 키우기</p>
      </div>
    }
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
