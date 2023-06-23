/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
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
    if (myChallengeData && myChallengeData.challengeTitle) {
      setTargetAmount(
        Number(myChallengeData.challengeTitle.split('')[0]) * 10000
      );

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

      const result = getChallengeCalendar(myChallengeData.startTime);
      setCalendar(result);
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

  // 챌린지 진행 상태 퍼센트
  const [usedPercent, setUsedPercent] = useState(0);

  // 챌린지 상태 문구
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

  // 챌린지 시작하기
  const startChallengeHandler = async () => {
    try {
      await postChallenge(myChallengeData.challengeTitle);
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
    }
    return <Error />;
  }
  return (
    <main id="challengeSt">
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        {myChallengeData === null
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
          <div className={`${myChallengeData !== null ? '' : 'example'}`}>
            <div>
              <p className="challengeMessage">{challengeMessege}</p>
              <div className="challengeProcessBar">
                <p>
                  {myChallengeData === null
                    ? '5만원'
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
                    style={{ width: `${usedPercent}%`, minWidth: '16px' }}
                  >
                    <span>{usedAmount} 원</span>
                  </div>
                </div>
              </div>
              <div className="challengeCalendar">
                <ul>
                  {calendar.map((date) => (
                    <li key={date.day}>
                      <label>{date.day}</label>
                      <button
                        type="button"
                        className={
                          today < Number(date.date)
                            ? 'next'
                            : today === Number(date.date)
                            ? 'today'
                            : ''
                        }
                        onClick={() => selectedDayHandler(Number(date.date))}
                      >
                        {date.date}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="challengeAccount">
                  <ul>
                    {myChallengeData && accountHistoryData ? (
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
                    ) : (
                      <li>
                        <p>
                          <span>6월 19일</span>
                          <span>푸어푸어 구매</span>
                          <span>쇼핑</span>
                        </p>
                        <p>????원</p>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            {myChallengeData !== null ? (
              <Button
                className="common"
                onClick={() => {
                  navigate('/account');
                }}
              >
                가계부 바로가기
              </Button>
            ) : (
              <>
                <div className="notice">
                  <p>
                    <img src={infoIcon} alt="정보" />
                    챌린지 내역은 가계부와 자동으로 연동돼요
                  </p>
                </div>
                <Button
                  className="common"
                  onClick={() => startChallengeHandler()}
                >
                  챌린지 시작하기
                </Button>
              </>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}

export default MyChallenge;
