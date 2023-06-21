/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { getMyChallenge } from '../../api/challenge';
import { Button, Header } from '../../components';
import { myChallengeInfo } from '../../shared/MyPoor';
import Error from '../status/Error';
import Loading from '../status/Loading';

function MyChallenge() {
  const navigate = useNavigate();
  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(-1);
  };

  // 나의 챌린지 정보
  const [myChallengeinfo, setMyChallengeinfo] = useRecoilState(myChallengeInfo);

  const fakeData = {
    challengeAmount: 20000,
    myExpenditureSum: 17000,
    success: true,
  };

  const [calendar, setCalendar] = useState<{ day: string; date: string }[]>([
    { day: '', date: '' },
  ]);

  const { isLoading, isError, data } = useQuery(
    'getMyChallenge',
    getMyChallenge
  );

  console.log(data);

  useEffect(() => {
    if (data) {
      // 챌린지 달력 구하기
      const getChallengeCalendar = (dateStr: string) => {
        const date = new Date(dateStr);
        const weekday = date.getDay();

        const startDate = new Date(date.getTime() - weekday * 86400000);
        const weekDates: { day: string; date: string }[] = [];

        for (let i = 0; i < 7; i += 1) {
          const weekD = ['일', '월', '화', '수', '목', '금', '토'];
          const currentDate = new Date(startDate.getTime() + i * 86400000);
          const formattedDate = currentDate.toISOString().split('T')[0];
          weekDates.push({ day: weekD[i], date: formattedDate });
        }

        return weekDates; // 주의 날짜 배열 반환
      };

      const result = getChallengeCalendar(data.startTime);
      setCalendar(result);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }
  return (
    <main id="challengeSt">
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        2만원 챌린지
      </Header>
      <article>
        <section>
          {myChallengeinfo !== null ? (
            <>
              <p>이제 시작! 1주일 동안 잘 할 수 있어요!</p>
              <div className="challengeProcessBar">
                <p>{data.challengeTitle.split()[0] / 10000}만원</p>
                <div className="progressTrack">
                  <div className="progressValue">
                    <p>&nbsp;</p>
                    <span>
                      - {data.challengeAmount - data.myExpenditureSum} 원
                    </span>
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
              <Button
                className="common"
                onClick={() => {
                  navigate('/account');
                }}
              >
                가계부 바로가기
              </Button>
            </>
          ) : (
            <>
              {' '}
              <div className="challengeProcessBar example">
                <p>{fakeData.challengeAmount / 10000}만원</p>
                <div className="progressTrack">
                  <div className="progressValue">
                    <p>&nbsp;</p>
                    <span>
                      - {fakeData.challengeAmount - fakeData.myExpenditureSum}{' '}
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
                        <span>세븐일레븐</span>
                        <span>식비</span>
                      </p>
                      <p>-3000원</p>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </section>
      </article>
    </main>
  );
}

export default MyChallenge;
