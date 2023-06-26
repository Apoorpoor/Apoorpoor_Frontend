import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import infoIcon from '../../static/image/ui/info_ic.png';
import { Header } from '../../components';
import challengeSuccess from '../../static/image/challenge/challenge_success.png';

function ChallengeEx() {
  const navigate = useNavigate();
  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(-1);
  };

  const [dynamicBoxOpen, setDynamicBoxOpen] = useState(false);
  const data = {
    challengeAmount: 20000,
    myExpenditureSum: 17000,
    success: true,
  };
  return (
    <main id="challengeSt">
      <Header navigateToPreviousPage={navigateToPreviousPage}>&nbsp;</Header>
      <article>
        <section>
          <h1>
            <span>1주일동안</span> 한정된 금액으로
          </h1>
          <p>무지출 부터 10만원까지 한정된 금액으로 1주일 동안 살아보기!</p>
          <div className="challengeProcessBar">
            <p>{data.challengeAmount / 10000}만원</p>
            <div className="progressTrack">
              <div className="progressValue">
                <p>&nbsp;</p>
                <span>- {data.challengeAmount - data.myExpenditureSum} 원</span>
              </div>
            </div>
          </div>
          <p>
            챌린지를 시작하면 챌린지 진행 상황과 챌린지 기간 중 사용내역을
            조회할 수 있어요
          </p>
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
              {data.success === true ? (
                <>
                  <img src={challengeSuccess} alt="챌린지 성공" />
                  <p>챌린지 성공!</p>
                  <p>스탬프도 모아보세요</p>
                </>
              ) : (
                <ul>
                  <li>가계부 리스트입니다.</li>
                </ul>
              )}
            </div>
          </div>
        </section>
        <section>
          <h1>
            스탬프로 <span>포인트 획득</span>
          </h1>
          <p>1주일 챌린지에 성공할 때마다 포인트와 스탬프 획득!</p>
          <p>챌린지를 10번 성공하면 보너스 100포인트 더!</p>
          <div className="challengeStamp">
            <ul>
              <li>
                <div className="stamp success">&nbsp;</div>
              </li>
              <li>
                <div className="stamp success">&nbsp;</div>
              </li>
              <li>
                <div className="stamp possible">&nbsp;</div>
              </li>
              <li>
                <div className="stamp next">&nbsp;</div>
              </li>
              <li>
                <div className="stamp next">&nbsp;</div>
              </li>
              <li>
                <div className="stamp next">&nbsp;</div>
              </li>
              <li>
                <div className="stamp next">&nbsp;</div>
              </li>
              <li>
                <div className="stamp next">&nbsp;</div>
              </li>
              <li>
                <div className="stamp next">&nbsp;</div>
              </li>
              <li>
                <div className="stamp point100">&nbsp;</div>
              </li>
            </ul>
          </div>
          <div
            className={`notice ${dynamicBoxOpen === true ? 'open' : ''}`}
            id="dynamicBox"
          >
            <p>
              <img src={infoIcon} alt="정보" />
              <span>1주일에 한가지 챌린지</span>만 도전 가능해요
            </p>
            <div>
              <p>
                <img src={infoIcon} alt="정보" />
                포인트 획득 기준을 알려드릴게요
                <span className="gray">(완료기준)</span>
              </p>
              <ul>
                <li>
                  2만원 챌린지 <span>200P</span>
                </li>
                <li>
                  5만원 챌린지 <span>100P</span>
                </li>
                <li>
                  10만원 챌린지 <span>40P</span>
                </li>
                <li>
                  무지출 챌린지 <span>500P</span>
                </li>
                <li>
                  스탬프 <span>5P</span>
                </li>
              </ul>
            </div>
          </div>
          <label
            htmlFor="dynamicBox"
            onClick={() => setDynamicBoxOpen(!dynamicBoxOpen)}
            onKeyDown={() => setDynamicBoxOpen(!dynamicBoxOpen)}
          >
            {dynamicBoxOpen === true ? `최소화` : `자세히 보기`}
          </label>
        </section>
      </article>
    </main>
  );
}

export default ChallengeEx;
