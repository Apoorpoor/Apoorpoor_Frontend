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
import { MdLock } from 'react-icons/md';
import { BsFillCaretRightFill, BsPenFill } from 'react-icons/bs';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import beggars from '../../api/beggars';
import '../../styles/pages/_PoorRoom.scss';
import '../../styles/components/_Slickslider.scss';
import {
  Button,
  Header,
  LevelMedal,
  RecentMyConsumechart,
  MyConsumePropensitychart,
  ProgressBar,
  SlickSlider,
  Tooltip,
  Input,
} from '../../components';
import { myPoorState } from '../../shared/MyPoor';
import BadgeState from '../../shared/BadgeList';
import PoorCharacter from './PoorCharacter';
import Loading from '../status/Loading';
import Error from '../status/Error';
import containerPositionState from '../../shared/ScrollContainer';
import Portal from '../../shared/Portal';
import NicknamedbCheck from '../../components/elements/NicknamedbCheck';
import nonePoorInfoImg from '../../static/image/poor/nonePoorInfo.png';
import PoorInfoError from '../status/PoorInfoError';
import { Badge, MyData, MyPointData, RecoilBadge } from '../../types/poorRoomTypes';

function PoorRoom() {
  // PoorRoom Hooks & State
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [myPoorInfo, setMyPoorInfo] = useRecoilState(myPoorState);
  const BadgeListState = useRecoilValue(BadgeState);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modifyNicknameModal, setModifyNicknameModal] = useState(false);
  const [badgeModal, setBadgeModal] = useState(false);

  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate('/');
  };
  // 나의 가계부 정보 불러오기
  const accountId = sessionStorage.getItem('accountId');

  // =================================================================
  // *** PoorRoom Data Query *****************************************
  // =================================================================
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

  // 닉네임 수정 모달 핸들러
  const modifyModalOpen = () => {
    setIsModalOpen(!isModalOpen);
    setModifyNicknameModal(true);
  };

  // 뱃지 모달
  const handleBadgeClick = (badge: Badge) => {
    setIsModalOpen(!isModalOpen);
    setSelectedBadge(badge);
    setBadgeModal(true);
  };

  const handleNoneBadgeClick = (badge: RecoilBadge) => {
    const newBadge = {
      badgeImage: `https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/badge/badge_${badge.title}.svg`,
      badgeNum: 0,
      badgeTitle: badge.name,
      createdAt: '2023-06-07T22:05:00.826883',
      id: 404,
      modifiedAt: '2023-06-07T22:05:00.826883',
    };
    setIsModalOpen(!isModalOpen);
    setSelectedBadge(newBadge);
    setBadgeModal(true);
  };

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
  const kindFilterHandler = (index: number, kindFilter: string) => {
    setSelectednavButtonIndex(index);
    setKind(kindFilter);
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
    // 가계부 ID 삭제
    sessionStorage.removeItem('accountId');
    navigate('/login');
  };

  // 소비 뱃지

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    if (
      (error as AxiosError).response &&
      (error as AxiosError).response?.status === 403
    ) {
      localStorage.removeItem('AToken');
      localStorage.removeItem('userId');
      Cookies.remove('RToken');
      alert('로그인 시간이 만료 되었어요!');
      navigate('/login');
    }
    if (
      (error as AxiosError).response &&
      (error as AxiosError).response?.status === 404
    ) {
      return <PoorInfoError />;
    }
    return <Error />;
  }

  return (
    <main id="myPoorRoom">
      <Header navigateToPreviousPage={navigateToPreviousPage}>MY</Header>
      <article>
        <section id="myPoorInfo">
          {data === undefined ||
          data?.age === null ||
          data?.gender === null ||
          data?.nickname === null ||
          data?.nickname === '' ? (
            <>
              <img
                src={nonePoorInfoImg}
                alt="nonePoorInfoImg"
                onClick={() => navigate('/nickname')}
              />
              <Button className="textType" onClick={logout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <div className="poorProfile">
                <PoorCharacter avatarType="poorRoom" />
              </div>
              <LevelMedal level={data?.level as number} />
              <h2 className="nickname">
                {data?.nickname}{' '}
                <Button className="icon" onClick={() => modifyModalOpen()}>
                  <BsPenFill style={{ color: '#d8d8d8', fontSize: '14px' }} />
                </Button>
              </h2>
              <p className="info">
                {data?.gender === 'female' ? '여' : '남'} / {data?.age}
                <Button
                  className="whiteRoundCommon"
                  onClick={() => navigate('/poorItemSetting')}
                >
                  아이템{' '}
                  <BsFillCaretRightFill
                    style={{ transform: 'translateY(2px)' }}
                  />
                </Button>
                <Button className="textType" onClick={logout}>
                  로그아웃
                </Button>
              </p>
            </>
          )}
        </section>
        <section id="myConsumePropensity">
          <h1>소비성향</h1>
          <MyConsumePropensitychart />
        </section>
        <section id="consumeBadgeArea">
          <h1>소비뱃지</h1>

          {data?.badgeList.length === 0 ? (
            <SlickSlider
              id="badgeSlide"
              loop={false}
              slidesToShow={3}
              slidesToScroll={1}
              arrows={false}
            >
              {BadgeListState.slice(0, 5).map((item) => (
                <div
                  key={item.name}
                  className="item dontHave"
                  onClick={() => handleNoneBadgeClick(item)}
                  onKeyDown={() => handleNoneBadgeClick(item)}
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                  role="button"
                  tabIndex={0}
                >
                  <div className="disabled">
                    <p>
                      <MdLock />
                    </p>
                    <p>{item.name}</p>
                  </div>
                  <img
                    src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/badge/badge_${item.title}.svg`}
                    alt={item.title}
                  />
                </div>
              ))}
            </SlickSlider>
          ) : (
            <SlickSlider
              id="badgeSlide"
              loop={false}
              slidesToShow={3}
              slidesToScroll={1}
              arrows={false}
            >
              {data?.badgeList.slice(0, 5).map((item) => (
                <div
                  key={item.badgeTitle}
                  className="item"
                  onClick={() => handleBadgeClick(item)}
                  onKeyDown={() => handleBadgeClick(item)}
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                  role="button"
                  tabIndex={0}
                >
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
          <h1>최근 6개월 소비, 수입 근황</h1>

          <RecentMyConsumechart />
        </section>
        <section id="myPointBreakdown">
          <h1>
            {data?.nickname}님의 푸어포인트
            <Tooltip>
              <h2>푸어포인트로 거지를 꾸밀 수 있어요.</h2>
              <ul>
                <li>
                  가계부 작성 <span>100P</span>
                </li>
                <li>
                  소비뱃지 획득 <span>20P</span>
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
                  newKind: kind,
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
                  newKind: kind,
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
                  newKind: kind,
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
                  newKind: kind,
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
                  newKind: kind,
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
                    navigate(`/account/${accountId}`);
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
                    onClick={() => kindFilterHandler(0, 'total')}
                  >
                    전체
                  </Button>
                  <Button
                    className={`smallNav ${
                      selectednavButtonIndex === 1 ? 'checked' : ''
                    }`}
                    onClick={() => kindFilterHandler(1, 'earn')}
                  >
                    적립
                  </Button>
                  <Button
                    className={`smallNav ${
                      selectednavButtonIndex === 2 ? 'checked' : ''
                    }`}
                    onClick={() => kindFilterHandler(2, 'use')}
                  >
                    사용
                  </Button>
                </nav>
                <ul className="detailOfPointList">
                  {pointInquiryList?.map((list) => (
                    <li key={list.point_id}>
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
      <Portal>
        <div
          className={`modalbg ${isModalOpen ? 'active' : ''}`}
          onClick={(e) => {
            setIsModalOpen(false);
            setModifyNicknameModal(false);
            setBadgeModal(false);
          }}
          onKeyDown={(e) => {
            setIsModalOpen(false);
            setModifyNicknameModal(false);
            setBadgeModal(false);
          }}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          role="button"
          tabIndex={0}
        >
          {/* 닉네임 모달 */}
          <div
            className={`modal modifyNickname ${
              modifyNicknameModal === true ? 'show' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 전파를 막습니다.
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            role="button"
            tabIndex={0}
          >
            <NicknamedbCheck />
            <div className="buttonWrap">
              <Button
                className="grayCommon"
                onClick={() => {
                  setIsModalOpen(!isModalOpen);
                  setModifyNicknameModal(!modifyNicknameModal);
                }}
              >
                취소
              </Button>
              <Button className="common" onClick={() => navigate(-1)}>
                수정
              </Button>
            </div>
          </div>

          {/* 뱃지 모달 */}
          <div
            className={`modal badge ${isModalOpen ? 'active' : ''} ${
              badgeModal === true ? 'show' : ''
            }`}
          >
            <div className="badge">
              <div>
                <img
                  src={selectedBadge?.badgeImage}
                  alt={selectedBadge?.badgeTitle}
                />
              </div>
              <p>{selectedBadge?.badgeTitle}</p>
            </div>
            <p>
              {selectedBadge?.id === 404 ? (
                <>
                  {`${
                    BadgeListState.find(
                      (badge) => badge.name === selectedBadge?.badgeTitle
                    )?.name
                  } 뱃지를 받으려면 `}
                  <span>
                    {
                      BadgeListState.find(
                        (badge) => badge.name === selectedBadge?.badgeTitle
                      )?.n_description
                    }
                  </span>
                  을 해보세요
                </>
              ) : (
                <>
                  {
                    BadgeListState.find(
                      (badge) => badge.name === selectedBadge?.badgeTitle
                    )?.description
                  }
                  <span>
                    {
                      BadgeListState.find(
                        (badge) => badge.name === selectedBadge?.badgeTitle
                      )?.sub_description
                    }
                  </span>
                </>
              )}
            </p>

            <Button
              className="common"
              onClick={() => navigate(`/account/${accountId}`)}
            >
              가계부 작성하기
            </Button>
          </div>
        </div>
      </Portal>
    </main>
  );
}

export default PoorRoom;
