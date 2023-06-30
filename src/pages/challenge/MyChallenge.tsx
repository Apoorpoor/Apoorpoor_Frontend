/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import {
  getChallengeAccountHistory,
  getMyChallenge,
  postChallenge,
} from '../../api/challenge';
import { Button, Header } from '../../components';
import infoIcon from '../../static/image/ui/info_ic.png';
import Error from '../status/Error';
import Loading from '../status/Loading';

function MyChallenge() {
  const navigate = useNavigate();
  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(-1);
  };
  // 나의 가계부 정보 불러오기
  const accountId = sessionStorage.getItem('accountId');

  // 클릭한 챌린지 타입
  const param = useLocation();
  const amount = param.pathname.split('')[13];
  let challengeType = '';
  // console.log(amount);
  if (amount === '무') {
    challengeType = '0';
  } else if (amount === '1') {
    challengeType = String(Number(amount) * 100000);
  } else {
    challengeType = String(Number(amount) * 10000);
  }

  // =================================================================
  // *** Challenge Data Query ****************************************
  // =================================================================
  const {
    isLoading: myChallengeLoading,
    error: myChallengeError,
    data: myChallengeData,
  } = useQuery('getMyChallenge', getMyChallenge);

  useEffect(() => {
    getMyChallenge();
  }, []);

  // 챌린지 없을 때 표시하기 위한 가짜 데이터
  const fakeData = {
    challengeAmount: 20000,
    myExpenditureSum: 17000,
    success: true,
  };

  // 챌린지 목표 금액 저장
  const [targetAmount, setTargetAmount] = useState(0);

  // 챌린지 진행 주차 캘린더 저장 state
  const [calendar, setCalendar] = useState<{ day: string; date: string }[]>([
    { day: '', date: '' },
  ]);
  // 오늘 날짜
  const today = new Date().getDate();

  useEffect(() => {
    if (myChallengeData) {
      // 챌린지가 진행 중일땐 목표 금액 설정
      if (myChallengeData.challengeTitle !== null) {
        setTargetAmount(
          Number(myChallengeData?.challengeTitle.split('')[0]) * 10000
        );
      }

      // 챌린지 진행 주차 캘린더 구하기
      const getChallengeCalendar = (dateStr: string) => {
        const date = new Date(dateStr);
        const weekday = date.getDay();

        const startDate = new Date(
          // 일요일이 아니라 월요일 부터 시작하고 싶어서 -2
          date.getTime() - (weekday > 0 ? weekday - 2 : 6) * 86400000
        );

        const weekDates: { day: string; date: string }[] = [];

        const weekD = ['월', '화', '수', '목', '금', '토', '일'];
        for (let i = 0; i < 7; i += 1) {
          const currentDate = new Date(startDate.getTime() + i * 86400000);
          const formattedDate = currentDate
            .toISOString()
            .split('T')[0]
            .slice(8);
          const dayIndex = i % 7;
          weekDates.push({ day: weekD[dayIndex], date: formattedDate });
        }

        return weekDates;
      };

      if (myChallengeData.challengeTitle !== null) {
        const result = getChallengeCalendar(myChallengeData.startTime);
        setCalendar(result);
      } else if (myChallengeData.challengeTitle === null) {
        const result = getChallengeCalendar('2023/06/27 01:56:17');
        console.log('챌린지 예시');
        setCalendar(result);
      }
    }
  }, [myChallengeData]);

  // =================================================================
  // *** Challenge Account History Query *****************************
  // =================================================================
  type ChallengeLedger = {
    title: string;
    expenditureType: string;
    expenditure: number;
    date: string;
  };

  type AccountHistoryType = {
    challengeLedgerHistoryList: ChallengeLedger[];
  };

  const {
    isLoading: accountHistoryLoading,
    error: accountHistoryError,
    data: accountHistoryData,
  } = useQuery('getChallengeAccountHistory', getChallengeAccountHistory);

  // 챌린지동안 사용한 금액 저장
  const [usedAmount, setUsedAmount] = useState(0);

  // 챌린지 진행 상태 퍼센트 저장
  const [usedPercent, setUsedPercent] = useState(0);

  // 챌린지 상태 문구 저장
  const [challengeMessege, setChallengeMessage] = useState('');
  const [challengeTheme, setChallengeTheme] = useState('step1');

  // 소비 내역 타입 변환
  const newIndex = (expenditureType: string) => {
    switch (expenditureType) {
      case 'UTILITY_BILL':
        return '월세/관리비/공과금';
      case 'CONDOLENCE_EXPENSE':
        return '경조사비';
      case 'TRANSPORTATION':
        return '교통비';
      case 'COMMUNICATION_EXPENSES':
        return '통신비';
      case 'INSURANCE':
        return '보험';
      case 'EDUCATION':
        return '교육';
      case 'SAVINGS':
        return '저축';
      case 'CULTURE':
        return '문화';
      case 'HEALTH':
        return '건강';
      case 'FOOD_EXPENSES':
        return '식비';
      case 'SHOPPING':
        return '쇼핑';
      case 'LEISURE_ACTIVITIES':
        return '여가활동';
      case 'OTHER':
        return '기타';
      default:
        return expenditureType;
    }
  };

  // 챌린지 소비 내역 조회 및 총 사용 금액 계산
  useEffect(() => {
    getChallengeAccountHistory();
    if (accountHistoryData) {
      const AmountUsed = (expenditureData: AccountHistoryType) => {
        let totalAmount = 0;
        expenditureData.challengeLedgerHistoryList.forEach(
          (list: ChallengeLedger) => {
            totalAmount += list.expenditure;
          }
        );

        return totalAmount;
      };

      setUsedAmount(AmountUsed(accountHistoryData));

      // 챌린지 진행 상태 표시
      const challengeGage = (usedAmount / targetAmount) * 100;
      setUsedPercent(challengeGage);

      // 챌린지 문구
      if (challengeGage <= 50) {
        setChallengeTheme('step1');
        setChallengeMessage('이제 시작! 1주일 동안 잘 할 수 있어요!');
      } else if (challengeGage <= 70) {
        setChallengeTheme('step2');
        setChallengeMessage('슬슬 허리띠 졸라매기!');
      } else if (challengeGage <= 100) {
        setChallengeTheme('step3');
        setChallengeMessage('아슬아슬 한데요?');
      } else {
        setChallengeTheme('step4');
        setChallengeMessage('이제라도 아껴보는건 어때요?');
      }
    }
  }, [accountHistoryData, challengeMessege]);

  const formatNumber = (value: number) => {
    if (value >= 100000000) {
      const stringValue = value.toString();
      const remainingDigits = stringValue.substring(0, stringValue.length - 8);
      return `${remainingDigits}억원`;
    }
    if (value >= 100000) {
      const stringValue = value.toString();
      const firstTwoDigits = stringValue.substring(0, stringValue.length - 4);
      return `${firstTwoDigits}만원`;
    }
    if (value >= 10000 && value < 100000) {
      const stringValue = value.toString();
      const firstDigit = stringValue[0];
      const secondDigit = stringValue[1];
      let remainingDigits = stringValue.substring(2);
      if (remainingDigits[0] === '0') {
        remainingDigits = '';
      }
      return `${firstDigit}만${secondDigit}천${remainingDigits}원`;
    }
    if (value >= 1000 && value < 10000) {
      const firstDigit = Math.floor(value / 1000);
      let remainingDigits = (value % 1000).toString();
      if (remainingDigits === '0') {
        remainingDigits = '';
      }
      return `${firstDigit}천${remainingDigits}원`;
    }
    const roundedValue = Math.round(value * 100) / 100; // 소수점 둘째 자리까지 반올림
    return `${roundedValue.toLocaleString().split('.')[0]}원`;
  };

  // 챌린지 시작하기
  const startChallengeHandler = async () => {
    try {
      await postChallenge(`CHALLENGE_${challengeType}`);
      navigate(`/challenge`);
    } catch (error) {
      console.log(error);
    }
  };

  // 챌린지 가계부 내역 조회
  const [selectedDay, setSelectedDay] = useState(today);
  const selectedDayHandler = (day: number) => {
    setSelectedDay(day);
  };

  if (myChallengeLoading || accountHistoryLoading) {
    return <Loading />;
  }
  if (myChallengeError || accountHistoryError) {
    if (
      ((myChallengeError as AxiosError).response &&
        (myChallengeError as AxiosError).response?.status === 403) ||
      ((accountHistoryError as AxiosError).response &&
        (accountHistoryError as AxiosError).response?.status === 403)
    ) {
      localStorage.removeItem('AToken');
      localStorage.removeItem('userId');
      Cookies.remove('RToken');
      alert('로그인 시간이 만료 되었어요!');
      navigate('/login');
    }
    return <Error />;
  }
  return (
    <main id="challengeSt">
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        {myChallengeData.challengeTitle === null
          ? '챌린지 예시'
          : myChallengeData.challengeTitle &&
            myChallengeData.challengeTitle[0] === '0'
          ? '무지출 챌린지'
          : `${
              myChallengeData.challengeTitle &&
              myChallengeData.challengeTitle[0]
            }만원 챌린지`}
      </Header>

      <article>
        <section className="myChallenge">
          <div
            className={`${
              myChallengeData.challengeTitle === null ? 'example' : ''
            }`}
          >
            <div>
              <p className="challengeMessage">
                {myChallengeData.challengeTitle === null
                  ? '두근두근 챌린지를 시작할 준비가 되셨나요?'
                  : `${challengeMessege}`}
              </p>
              <div className="challengeProcessBar">
                <p>
                  {myChallengeData.challengeTitle === null
                    ? `${
                        amount === '1'
                          ? '10만원'
                          : amount === '%'
                          ? '무지출'
                          : amount === '2'
                          ? '2만원'
                          : '5만원'
                      }`
                    : myChallengeData.challengeTitle &&
                      myChallengeData.challengeTitle[0] === '0'
                    ? '무지출'
                    : `${
                        myChallengeData.challengeTitle &&
                        myChallengeData.challengeTitle[0]
                      }만원`}
                </p>
                <div className="progressTrack">
                  <div
                    className={`progressValue ${challengeTheme}`}
                    style={{
                      width: `${
                        myChallengeData.challengeTitle !== null
                          ? `${usedPercent}%`
                          : `40%`
                      }`,
                      minWidth: '16px',
                    }}
                  >
                    <span>
                      {myChallengeData.challengeTitle !== null
                        ? `- ${formatNumber(usedAmount)}`
                        : `17000 원`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="challengeCalendar">
                <ul>
                  {calendar.map((date, i) => (
                    <li key={date.day}>
                      <label>{date.day}</label>
                      <button
                        type="button"
                        className={`${
                          today === Number(date.date)
                            ? 'today'
                            : (today > 25 && today < Number(date.date)) ||
                              Number(date.date) === 1 ||
                              Number(date.date) === 2 ||
                              Number(date.date) === 3 ||
                              Number(date.date) === 4 ||
                              Number(date.date) === 5 ||
                              Number(date.date) === 6
                            ? 'next'
                            : ''
                        } ${
                          selectedDay === Number(date.date) ? 'selected' : ''
                        }`}
                        onClick={() => selectedDayHandler(Number(date.date))}
                      >
                        {date.date}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="challengeAccount">
                  <ul>
                    {myChallengeData.challengeTitle === null ? (
                      <li>
                        <p>
                          <span>6월 19일</span>
                          <span>푸어푸어 구매</span>
                          <span>쇼핑</span>
                        </p>
                        <p>????원</p>
                      </li>
                    ) : accountHistoryData.challengeLedgerHistoryList.length ===
                      0 ? (
                      <li className="emptyList">
                        <img src={infoIcon} alt="정보" />
                        챌린지 내역은 가계부와 자동으로 연동돼요
                      </li>
                    ) : (
                      accountHistoryData.challengeLedgerHistoryList
                        .filter(
                          (date: ChallengeLedger) =>
                            Number(date.date.substring(8, 10)) === selectedDay
                        )
                        .map((list: ChallengeLedger) => (
                          <li key={list.title}>
                            <p>
                              <span>{list.date}</span>
                              <span>{list.title}</span>
                              <span>{newIndex(list.expenditureType)}</span>
                            </p>
                            <p>-{list.expenditure}원</p>
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
            {myChallengeData.challengeTitle !== null ? (
              <Button
                className="common"
                onClick={() => {
                  navigate(`/account/${accountId}`);
                }}
              >
                가계부 바로가기
              </Button>
            ) : (
              <div>
                <div className="notice" style={{ marginBottom: '30px' }}>
                  <p>
                    <img src={infoIcon} alt="정보" />
                    챌린지 내역은 가계부와 자동으로 연동돼요
                  </p>
                </div>
                <Button
                  className="common"
                  onClick={() => startChallengeHandler()}
                >
                  {amount === '1'
                    ? '10만원 '
                    : amount === '%'
                    ? '무지출 '
                    : amount === '2'
                    ? '2만원 '
                    : '5만원 '}
                  챌린지 시작하기
                </Button>
              </div>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}

export default MyChallenge;
