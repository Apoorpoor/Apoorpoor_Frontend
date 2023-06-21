/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
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
    isError: myChallengeError,
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

  useEffect(() => {
    if (myChallengeData) {
      // data가 로딩 되면 목표금액 다시 설정
      setTargetAmount(
        Number(myChallengeData.challengeTitle.split('')[0]) * 10000
      );

      // 챌린지 진행 주차 캘린더 구하기
      const getChallengeCalendar = (dateStr: string) => {
        const date = new Date(dateStr);
        const weekday = date.getDay();

        const startDate = new Date(date.getTime() - weekday * 86400000);
        const weekDates: { day: string; date: string }[] = [];

        for (let i = 0; i < 7; i += 1) {
          const weekD = ['일', '월', '화', '수', '목', '금', '토'];
          const currentDate = new Date(startDate.getTime() + i * 86400000);
          const formattedDate = currentDate
            .toISOString()
            .split('T')[0]
            .slice(8);
          weekDates.push({ day: weekD[i], date: formattedDate });
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
    isError: accountHistoryError,
    data: accountHistoryData,
  } = useQuery('getChallengeAccountHistory', getChallengeAccountHistory);

  // 챌린지동안 사용한 금액 저장
  const [usedAmount, setUsedAmount] = useState(0);

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
    }
  }, []);

  // 챌린지 시작하기
  const startChallengeHandler = async () => {
    try {
      await postChallenge(myChallengeData.challengeTitle);
    } catch (error) {
      console.log(error);
    }
  };

  if (myChallengeLoading || accountHistoryLoading) {
    return <Loading />;
  }
  if (myChallengeError || accountHistoryError) {
    return <Error />;
  }
  return (
    <main id="challengeSt">
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        2만원 챌린지
      </Header>
      <article>
        <section>
          {myChallengeData !== null ? (
            <div className="myChallenge">
              <div>
                <p>이제 시작! 1주일 동안 잘 할 수 있어요!</p>
                <div className="challengeProcessBar">
                  <p>{myChallengeData.challengeTitle.split('')[0]}만원</p>
                  <div className="progressTrack">
                    <div className="progressValue">
                      <p>&nbsp;</p>
                      <span>- {targetAmount - usedAmount} 원</span>
                    </div>
                  </div>
                </div>
                <div className="challengeCalendar">
                  <ul>
                    {calendar.map((date) => (
                      <li key={date.day}>
                        <label>{date.day}</label>
                        <button type="button">{date.date}</button>
                      </li>
                    ))}
                  </ul>
                  <div className="challengeAccount">
                    <ul>
                      {/* {accountHistoryData.map((list) => {

                      })} */}
                      <li>
                        <p>
                          <span>6월 19일</span>
                          <span>세븐일레븐</span>
                          <span>식비</span>
                        </p>
                        <p>-3000원</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button
                className="common"
                onClick={() => {
                  navigate('/account');
                }}
              >
                가계부 바로가기
              </Button>
            </div>
          ) : (
            <div className="myChallenge">
              <div>
                <div className="challengeProcessBar example">
                  <p>{fakeData.challengeAmount / 10000}만원</p>
                  <div className="progressTrack">
                    <div className="progressValue">
                      <p>&nbsp;</p>
                      <span>
                        - {fakeData.challengeAmount - fakeData.myExpenditureSum}
                        원
                      </span>
                    </div>
                  </div>
                </div>
                <div className="challengeCalendar">
                  <ul>
                    <li>
                      <label htmlFor="mon" className="pre">
                        월
                      </label>
                      <button type="button" id="mon" className="pre">
                        30
                      </button>
                    </li>
                    <li>
                      <label htmlFor="tue" className="pre">
                        화
                      </label>
                      <button type="button" id="tue" className="pre">
                        31
                      </button>
                    </li>
                    <li>
                      <label htmlFor="wed" className="today">
                        수
                      </label>
                      <button type="button" id="wed" className="today">
                        1
                      </button>
                    </li>
                    <li>
                      <label htmlFor="thu" className="next">
                        목
                      </label>
                      <button type="button" id="thu" className="next">
                        2
                      </button>
                    </li>
                    <li>
                      <label htmlFor="fri" className="next">
                        금
                      </label>
                      <button type="button" id="fri" className="next">
                        3
                      </button>
                    </li>
                    <li>
                      <label htmlFor="sat" className="next">
                        토
                      </label>
                      <button type="button" id="sat" className="next">
                        4
                      </button>
                    </li>
                    <li>
                      <label htmlFor="sun" className="next">
                        일
                      </label>
                      <button type="button" id="sun" className="next">
                        5
                      </button>
                    </li>
                  </ul>
                  <div className="challengeAccount">
                    <ul>
                      <li>
                        <p>
                          <span>6월 19일</span>
                          <span>푸어푸어 구매</span>
                          <span>쇼핑</span>
                        </p>
                        <p>????원</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
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
              </div>
            </div>
          )}
        </section>
      </article>
    </main>
  );
}

export default MyChallenge;
