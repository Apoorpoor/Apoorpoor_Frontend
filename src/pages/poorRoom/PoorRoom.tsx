/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router';
import { useQuery, UseQueryResult } from 'react-query';
import beggars from '../../api/beggars';
import '../../styles/pages/_PoorRoom.scss';
import '../../styles/components/_Slickslider.scss';
import {
  Button,
  Controller,
  Header,
  LevelMedal,
  RecentMyConsumechart,
  MyConsumePropensitychart,
  ProgressBar,
  SlickSlider,
} from '../../components';
import communication from '../../static/image/badge/badge_communication.svg';
import culture from '../../static/image/badge/badge_culture.svg';
import deposit from '../../static/image/badge/badge_deposit.svg';
import education from '../../static/image/badge/badge_education.svg';
import food from '../../static/image/badge/badge_food.svg';
import myPoorState from '../../shared/MyPoor';

function PoorRoom() {
  const navigate = useNavigate();
  const [myPoorLevel, setMyPoorLevel] = useRecoilState(myPoorState);
  // const queryClient = useQueryClient();

  // 마이푸어룸 데이터 불러오기
  interface MyData {
    beggarId: string;
    userId: string;
    nickname: string;
    point: number;
    level: number;
    description: string;
    age: number;
    gender: string;
  }

  const { isLoading, error, data }: UseQueryResult<MyData> = useQuery(
    'getMyPoorRoom',
    beggars.getMyPoorRoom
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (data !== undefined) {
      setMyPoorLevel(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setMyPoorLevel]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  return (
    <main id="myPoorRoom">
      <Header>MY</Header>
      <article>
        <section id="myPoorInfo">
          <div className="poorProfile">{/* 나중에 이미지 삽입 */}</div>
          <LevelMedal level={data?.level as number} />
          <h2 className="nickname">{data?.nickname}</h2>
          <p className="info">
            {data?.gender === 'female' ? '여' : '남'} / {data?.age}
          </p>
          <Button
            className="whiteButton"
            onClick={() => navigate('/poorItemSetting')}
          >
            아이템
          </Button>
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
          <div style={{ width: '100%', height: '430px' }}>
            <MyConsumePropensitychart />
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
              <img src={communication} alt="" />
              <p>여보세요?</p>
            </div>
            <div className="item">
              <img src={culture} alt="" />
              <p>#여유 #휴식</p>
            </div>
            <div className="item">
              <img src={deposit} alt="" />
              <p>티끌모아 태산</p>
            </div>
            <div className="item">
              <img src={education} alt="" />
              <p>공부의 신</p>
            </div>
            <div className="item">
              <img src={food} alt="" />
              <p>햄버억</p>
            </div>
          </SlickSlider>
          <Button
            className="whiteCommon"
            onClick={() => navigate('/badgeList')}
          >
            모든 뱃지 보기
          </Button>
        </section>
        <section id="myConsumeRecentGraph">
          <h1>최근 6개월 소비근황</h1>
          <p>단위 : 만원</p>
          <div style={{ width: '100%', height: '370px' }}>
            <RecentMyConsumechart />
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
                  가계부 작성 <span>05.22 &#62; 가계부 작성</span>
                </p>
                <p className="value save">
                  +10P <span>적립</span>
                </p>
              </li>
              <li>
                <p className="title">
                  나이키 에어포스 <span>05.27 &#62; 아이템 구매</span>
                </p>
                <p className="value use">
                  -20P <span>사용</span>
                </p>
              </li>
              <li>
                <p className="title">
                  뱃지 획득 <span>05.28 &#62; 뱃지</span>
                </p>
                <p className="value save">
                  +20P <span>적립</span>
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
