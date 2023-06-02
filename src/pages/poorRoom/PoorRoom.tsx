import React from 'react';
import '../../styles/pages/_PoorRoom.scss';
import '../../styles/components/_Slickslider.scss';
import {
  Controller,
  Header,
  LevelMedal,
  NivoLine,
  NivoRadar,
  ProgressBar,
  SlickSlider,
} from '../../components';
import badgeMedical from '../../static/image/badge/badge_medical.svg';

function PoorRoom() {
  return (
    <main id="myPoorRoom">
      <Header>MY</Header>
      <article>
        <section id="myPoorInfo">
          <div className="poorProfile">{/* 나중에 이미지 삽입 */}</div>
          <LevelMedal level="2" />
          <h2 className="nickname">만수르</h2>
          <p className="info">남 / 24</p>
        </section>
        {/* <section id="myPoorCharacter">
          <div className="poor">푸어 캐릭터</div>
          <div className="poorItemStorage">
            <ul>
              <li>모자</li>
              <li>장갑</li>
            </ul>
          </div>
        </section> */}
        <section id="myConsumePropensity">
          <h1>소비성향</h1>
          <ul className="consumeStyle">
            <li>#Flex</li>
            <li>#문화생활</li>
            <li>#뚜벅이</li>
          </ul>
          <div style={{ width: '100%', height: '370px' }}>
            <NivoRadar />
          </div>
        </section>
        <section id="consumeBadgeArea">
          <h1>소비뱃지</h1>
          <SlickSlider
            id="badgeSlide"
            loop={false}
            slidesToShow={3}
            slidesToScroll={1}
            arrows={false}
          >
            <div className="item">
              <img src={badgeMedical} alt="" />
              <p>아프면 손드세요</p>
            </div>
            <div className="item">
              <img src={badgeMedical} alt="" />
              <p>아프면 손드세요</p>
            </div>
            <div className="item">
              <img src={badgeMedical} alt="" />
              <p>아프면 손드세요</p>
            </div>
            <div className="item">
              <img src={badgeMedical} alt="" />
              <p>아프면 손드세요</p>
            </div>
          </SlickSlider>
        </section>
        <section id="myConsumeRecentGraph">
          <h1>최근 6개월 소비근황</h1>
          <p>단위 : 만원</p>
          <div style={{ width: '100%', height: '370px' }}>
            <NivoLine />
          </div>
        </section>
        <section id="myPointBreakdown">
          <h1>
            만수르님의 푸어포인트 <span className="tooltip">!</span>
          </h1>
          <ProgressBar />
          <ul className="periodInquiry">
            <li className="checked">1주일</li>
            <li>1개월</li>
            <li>3개월</li>
            <li>6개월</li>
            <li>1년</li>
          </ul>
          <div className="detailOfPoint">
            <ul className="detailOfPointFilter">
              <li className="checked">전체</li>
              <li>적립</li>
              <li>사용</li>
            </ul>
            <ul className="detailOfPointList">
              <li>
                <p className="title">
                  포인트 상세 내역 <span>날짜 &#62; 카테고리</span>
                </p>
                <p className="value save">
                  +10P <span>적립</span>
                </p>
              </li>
            </ul>
          </div>
        </section>
      </article>
      <Controller />
    </main>
  );
}

export default PoorRoom;
