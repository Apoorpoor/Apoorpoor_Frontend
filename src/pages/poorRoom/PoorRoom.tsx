/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { BsFillCaretRightFill } from 'react-icons/bs';
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
import PoorCharacter from './PoorCharacter';
import Loading from '../status/Loading';
import Error from '../status/Error';

function PoorRoom() {
  const navigate = useNavigate();
  const [myPoorLevel, setMyPoorLevel] = useRecoilState(myPoorState);
  const queryClient = useQueryClient();

  // 마이푸어룸 데이터 불러오기
  type Badge = {
    badgeImage: string;
    badgeNum: number;
    badgeTitle: string;
    createdAt: string;
    id: number;
    modifiedAt: string;
  };

  interface MyData {
    beggarId: string;
    userId: string;
    nickname: string;
    exp: number;
    point: number;
    level: number;
    description: string;
    age: number;
    gender: string;
    topImage: string;
    bottomImage: string;
    accImage: string;
    customImage: string;
    badgeList: Badge[];
  }

  interface MyPointData {
    point_id: number;
    pointDescription: string;
    earnedPoint: number | null;
    usedPoints: number | null;
    beggar_id: number;
    createdAt: string;
  }

  const { isLoading, error, data }: UseQueryResult<MyData> = useQuery(
    'getMyPoorRoom',
    beggars.getMyPoorRoom
  );

  const {
    isLoading: PointLoading,
    error: PointError,
    data: PointData,
  } = useQuery<MyPointData[]>(
    ['getMyPointInquiry', { dateType: 'week', kind: null, page: 0 }],
    () => beggars.getMyPointInquiry({ dateType: 'week', kind: null, page: 0 })
  );

  // 포인트 내역 조회 mutation
  const pointInquiryMutation = useMutation(beggars.getMyPointInquiry, {
    onSuccess: (response) => {
      queryClient.invalidateQueries('getMyPointInquiry');
    },
  });

  const getPointInquiry = (
    newDateType: string,
    newKind: string | null,
    newPage: number
  ) => {
    pointInquiryMutation.mutate({
      dateType: newDateType,
      kind: newKind,
      page: newPage,
    });
  };

  console.log('PointData', PointData);

  // 포인트 내역 기간별 조회하기
  // const pointInquirybyPeriod = ({}) => {
  //   getPointInquiry('newDateType', 'newKind', newPage);
  // };

  useEffect(() => {
    if (data !== undefined) {
      setMyPoorLevel(data);
    }
  }, [data, setMyPoorLevel]);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <main id="myPoorRoom">
      <Header>MY</Header>
      <article>
        <section id="myPoorInfo">
          <div className="poorProfile">
            <PoorCharacter />
          </div>
          <LevelMedal level={data?.level as number} />
          <h2 className="nickname">{data?.nickname}</h2>
          <p className="info">
            {data?.gender === 'female' ? '여' : '남'} / {data?.age}
            <Button
              className="whiteRoundCommon"
              onClick={() => navigate('/poorItemSetting')}
            >
              아이템 <BsFillCaretRightFill />
            </Button>
            <Button
              className="textType"
              onClick={() => navigate('/poorItemSetting')}
            >
              로그아웃
            </Button>
          </p>
        </section>
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
            {data?.badgeList
              .filter((item) => item.badgeNum >= 1 && item.badgeNum <= 5)
              .map((item) => (
                <div key={item.badgeNum} className="item">
                  <img src={item.badgeImage} alt={item.badgeTitle} />
                  <p>{item.badgeTitle}</p>
                </div>
              ))}
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
          {data && (
            <ProgressBar
              data={{ exp: data.exp, point: data.point, level: data.level }}
            />
          )}
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
              {PointData?.map((list) => (
                <li key={list.point_id}>
                  <p className="title">
                    {list.pointDescription} <span>05.22 &#62;</span>
                  </p>
                  <p
                    className={`value ${
                      list.usedPoints === null ? 'save' : 'use'
                    }`}
                  >
                    {list.usedPoints === null ? '+' : '-'}
                    {list.usedPoints === null
                      ? list.earnedPoint
                      : list.usedPoints}
                    P <span>{list.usedPoints === null ? '적립' : '사용'}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>
      <Controller />
    </main>
  );
}

export default PoorRoom;
