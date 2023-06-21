/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { myChallengeInfo } from '../../shared/MyPoor';
// import { postChallenge } from '../../api/challenge';
import { Header } from '../../components';

function ChallengeStart() {
  const navigate = useNavigate();
  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(-1);
  };
  // 나의 챌린지 정보
  const [myChallengeinfo, setMyChallengeinfo] = useRecoilState(myChallengeInfo);

  // // 챌린지 시작하기
  // const startChallengeHandler = async (type: string) => {
  //   try {
  //     await postChallenge(type);
  //   } catch (error) {}
  // };

  const fakeData = {
    challengeAmount: 20000,
    myExpenditureSum: 17000,
    success: true,
  };

  return (
    <main id="challengeSt">
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        {fakeData.challengeAmount / 10000}만원 챌린지
      </Header>
      <article>
        <section>
          <p>일주일 동안 2만원 챌린지! 시작해볼까요?</p>
          {myChallengeinfo === null ? (
            <>ㅇ</>
          ) : (
            <>
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

export default ChallengeStart;
