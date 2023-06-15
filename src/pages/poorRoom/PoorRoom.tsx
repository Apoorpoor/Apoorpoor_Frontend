/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { BsFillCaretRightFill } from 'react-icons/bs';
import Cookies from 'js-cookie';
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
  Tooltip,
} from '../../components';
import myPoorState from '../../shared/MyPoor';
import BadgeState from '../../shared/BadgeList';
import PoorCharacter from './PoorCharacter';
import Loading from '../status/Loading';
import Error from '../status/Error';
import containerPositionState from '../../shared/ScrollContainer';
import badgeDefault01 from '../../static/image/ui/badge_disabled_01.png';
import badgeDefault02 from '../../static/image/ui/badge_disabled_02.png';
import badgeDefault03 from '../../static/image/ui/badge_disabled_03.png';

function PoorRoom() {
  // PoorRoom Hooks & State
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [myPoorInfo, setMyPoorInfo] = useRecoilState(myPoorState);
  const BadgeListState = useRecoilValue(BadgeState);
  const [scrollPosition, setScrollPosition] = useRecoilState(
    containerPositionState
  );

  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate('/');
  };

  // =================================================================
  // *** PoorRoom Data Query *****************************************
  // =================================================================
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
    shoesImage: string;
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

  useEffect(() => {
    if (data !== undefined) {
      setMyPoorInfo(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setMyPoorInfo]);

  // =================================================================
  // *** PoorRoom Point Inquiry Query ********************************
  // =================================================================
  // 초기값 설정
  const initialDateType = 'week';
  const initialKind = null;
  const initialPage = 0;
  const initialButtonIndex = 0;

  const [dateType, setDateType] = useState(initialDateType);
  const [kind, setKind] = useState<string | null>(initialKind);
  const [page, setPage] = useState(initialPage);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const [selectednavButtonIndex, setSelectednavButtonIndex] = useState(0);
  const [pointInquiryList, setPointInquiryList] = useState<MyPointData[]>([]);

  const {
    isLoading: PointLoading,
    error: PointError,
    data: PointData,
  } = useQuery<MyPointData[]>(
    ['getMyPointInquiry', { dateType, kind, page }],
    () => beggars.getMyPointInquiry({ dateType, kind, page })
  );

  // 포인트 내역 조회 mutation
  const pointInquiryMutation = useMutation(beggars.getMyPointInquiry, {
    onSuccess: (response) => {
      setPointInquiryList((prevList) => [...prevList, ...response]);
      queryClient.invalidateQueries('getMyPointInquiry');
    },
  });

  type PointInquiry = {
    newDateType: string;
    newKind: string | null;
    newPage: number;
    buttonIndex: number;
  };

  const getPointInquiry = ({
    newDateType,
    newKind,
    newPage,
    buttonIndex,
  }: PointInquiry) => {
    // 필터링 기간을 다르게 설정했을 경우
    if (newDateType !== dateType) {
      setPointInquiryList([]);
    }
    setDateType(newDateType);
    setKind(newKind);
    setPage(newPage);
    pointInquiryMutation.mutate({
      dateType: newDateType,
      kind: newKind,
      page: newPage,
    });
    setSelectedButtonIndex(buttonIndex);
  };

  // 전체,적립,사용 필터링
  const kindFilterHandler = (index: number) => {
    setSelectednavButtonIndex(index);
    // 전체
    if (index === 0) {
      setPointInquiryList(PointData || []);
      // 적립
    } else if (index === 1) {
      const filteredList = PointData?.filter(
        (item) => item.usedPoints === null || item.usedPoints === 0
      );
      setPointInquiryList(filteredList || []);
      // 사용
    } else {
      const filteredList = PointData?.filter(
        (item) => item.usedPoints !== null && item.usedPoints > 0
      );
      setPointInquiryList(filteredList || []);
    }
  };

  // 더보기 버튼
  const showNextList = () => {
    getPointInquiry({
      newDateType: dateType,
      newKind: kind,
      newPage: page + 1,
      buttonIndex: selectedButtonIndex,
    });
  };

  // 초기값 설정 및 첫번째 조회 실행
  useEffect(() => {
    getPointInquiry({
      newDateType: initialDateType,
      newKind: initialKind,
      newPage: initialPage,
      buttonIndex: initialButtonIndex,
    });
  }, []);

  // 로그아웃 핸들러
  const logout = () => {
    // userId 삭제
    localStorage.removeItem('userId');
    // AToken 삭제
    localStorage.removeItem('AToken');
    // RToken 삭제
    Cookies.remove('RToken');
    navigate('/login');
  };

  // 스크롤 이벤트
  const [radarChartSection, setRadarChartSection] = useState(false);
  const [lineChartSection, setLineChartSection] = useState(false);
  console.log(scrollPosition);
  useEffect(() => {
    if (scrollPosition > 200) {
      setRadarChartSection(true);
    }
    if (scrollPosition > 1300) {
      setLineChartSection(true);
    }
  }, [scrollPosition]);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <main id="myPoorRoom">
      <Header navigateToPreviousPage={navigateToPreviousPage}>MY</Header>
      <article>
        <section id="myPoorInfo">
          <div className="poorProfile">
            <PoorCharacter avatarType="poorRoom" />
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
            <Button className="textType" onClick={logout}>
              로그아웃
            </Button>
          </p>
        </section>
        <section id="myConsumePropensity">
          <h1>소비성향</h1>
          <div
            style={{
              width: radarChartSection === true ? '100%' : '90%',
              height: '450px',
              margin: '0 auto',
            }}
          >
            <MyConsumePropensitychart />
          </div>
        </section>
        <section id="consumeBadgeArea">
          <h1>소비뱃지</h1>

          {data?.badgeList.length === 0 ? (
            <div
              style={{
                display: 'flex',
                margin: '15px 0',
                gap: '20px',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <img
                src={badgeDefault01}
                alt="뱃지기본이미지"
                style={{ width: '112px' }}
              />
              <img
                src={badgeDefault02}
                alt="뱃지기본이미지"
                style={{ width: '112px' }}
              />
              <img
                src={badgeDefault03}
                alt="뱃지기본이미지"
                style={{ width: '112px' }}
              />
            </div>
          ) : (
            <SlickSlider
              id="badgeSlide"
              loop={false}
              slidesToShow={3}
              slidesToScroll={1}
              arrows={false}
            >
              {data?.badgeList.slice(0, 5).map((item) => (
                <div key={item.badgeTitle} className="item">
                  <img src={item.badgeImage} alt={item.badgeTitle} />
                  <p>{item.badgeTitle}</p>
                </div>
              ))}
            </SlickSlider>
          )}

          <Button
            className="whiteCommon"
            onClick={() => navigate('/badgeList')}
          >
            모든 뱃지 보기
          </Button>
        </section>

        <section id="myConsumeRecentGraph">
          <h1>최근 6개월 소비근황</h1>
          <div
            style={{
              width: lineChartSection === true ? '100%' : '80%',
              height: '400px',
              margin: '0 auto',
            }}
          >
            <RecentMyConsumechart />
          </div>
        </section>
        <section id="myPointBreakdown">
          <h1>
            {data?.nickname}님의 푸어포인트
            <Tooltip>
              <h2>푸어포인트로 거지를 꾸밀 수 있어요.</h2>
              <ul>
                <li>
                  가계부 작성<span>10P</span>
                </li>
                <li>
                  소비뱃지 획득<span>20P</span>
                </li>
              </ul>
            </Tooltip>
          </h1>
          {data && (
            <ProgressBar
              data={{ exp: data.exp, point: data.point, level: data.level }}
            />
          )}
          <div className="periodInquiry">
            <Button
              className={`filterButton ${
                selectedButtonIndex === 0 ? 'checked' : ''
              }`}
              onClick={() =>
                getPointInquiry({
                  newDateType: 'week',
                  newKind: 'total',
                  newPage: 0,
                  buttonIndex: 0,
                })
              }
            >
              1주일
            </Button>
            <Button
              className={`filterButton ${
                selectedButtonIndex === 1 ? 'checked' : ''
              }`}
              onClick={() =>
                getPointInquiry({
                  newDateType: 'month',
                  newKind: 'total',
                  newPage: 0,
                  buttonIndex: 1,
                })
              }
            >
              1개월
            </Button>
            <Button
              className={`filterButton ${
                selectedButtonIndex === 2 ? 'checked' : ''
              }`}
              onClick={() =>
                getPointInquiry({
                  newDateType: '3month',
                  newKind: 'total',
                  newPage: 0,
                  buttonIndex: 2,
                })
              }
            >
              3개월
            </Button>
            <Button
              className={`filterButton ${
                selectedButtonIndex === 3 ? 'checked' : ''
              }`}
              onClick={() =>
                getPointInquiry({
                  newDateType: '6month',
                  newKind: 'total',
                  newPage: 0,
                  buttonIndex: 3,
                })
              }
            >
              6개월
            </Button>
            <Button
              className={`filterButton ${
                selectedButtonIndex === 4 ? 'checked' : ''
              }`}
              onClick={() =>
                getPointInquiry({
                  newDateType: 'year',
                  newKind: 'total',
                  newPage: 0,
                  buttonIndex: 4,
                })
              }
            >
              1년
            </Button>
          </div>
          <div className="detailOfPoint">
            {pointInquiryList?.length === 0 ||
            pointInquiryList === undefined ? (
              <div className="dataNone textType">
                <h2>텅 비었네요</h2>
                <p>
                  가계부를 작성하고
                  <br />
                  포인트를 받아보세요
                </p>
                <Button
                  className="textType"
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  가계부 작성하기
                </Button>
              </div>
            ) : (
              <>
                <nav className="detailOfPointFilter">
                  <Button
                    className={`smallNav ${
                      selectednavButtonIndex === 0 ? 'checked' : ''
                    }`}
                    onClick={() => kindFilterHandler(0)}
                  >
                    전체
                  </Button>
                  <Button
                    className={`smallNav ${
                      selectednavButtonIndex === 1 ? 'checked' : ''
                    }`}
                    onClick={() => kindFilterHandler(1)}
                  >
                    적립
                  </Button>
                  <Button
                    className={`smallNav ${
                      selectednavButtonIndex === 2 ? 'checked' : ''
                    }`}
                    onClick={() => kindFilterHandler(2)}
                  >
                    사용
                  </Button>
                </nav>
                <ul className="detailOfPointList">
                  {pointInquiryList?.map((list) => (
                    <li key={list.createdAt}>
                      <p className="title">
                        {list.pointDescription}{' '}
                        <span>
                          {new Date(list.createdAt).toLocaleString(undefined, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: 'numeric',
                            minute: 'numeric',
                          })}
                        </span>
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
                        P{' '}
                        <span>
                          {list.usedPoints === null ? '적립' : '사용'}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {PointData?.length !== 0 && (
              <Button className="whiteCommon" onClick={showNextList}>
                더 보기
              </Button>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}

export default PoorRoom;
