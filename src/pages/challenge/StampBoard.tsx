/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { getMyChallenge, getStampBoard } from '../../api/challenge';
import { Button, Header } from '../../components';
import Error from '../status/Error';
import Loading from '../status/Loading';
import poorStamp from '../../static/image/challenge/stamp_possible.png';

function StampBoard() {
  const navigate = useNavigate();
  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(-1);
  };
  // =================================================================
  // *** ChallengeInfo Data Query ********************************************
  // =================================================================
  const { data: getMychallengeData } = useQuery('getChallenge', getMyChallenge);

  // =================================================================
  // *** Stamp Data Query ********************************************
  // =================================================================
  const { isLoading, isError, data } = useQuery('getStampBoard', getStampBoard);

  const totalStamp = 10;
  const [earnStamp, setEarnStamp] = useState(0);
  const [remainStamp, setRemainStamp] = useState(0);

  // 획득한 도장 갯수, 획득하지 못 한 도장 갯수
  useEffect(() => {
    if (data) {
      getStampBoard();
      setEarnStamp(data.successCount);
      setRemainStamp(totalStamp - data.successCount);
    }
  }, [data]);

  const earnStamps = Array.from({ length: earnStamp }, (_, index) => (
    <li key={index}>
      <div className="stamp success">&nbsp;</div>
    </li>
  ));

  const remainStamps = Array.from({ length: remainStamp }, (_, index) => (
    <li key={index}>
      <div className="stamp possible">&nbsp;</div>
    </li>
  ));

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }
  return (
    <main id="challengeSt">
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        스탬프 보기
      </Header>
      <article>
        <section>
          {getMychallengeData !== null ? (
            <div className="challengeStamp">
              <ul>
                {earnStamps}
                {remainStamps}
                <li>
                  <div className="stamp point100">&nbsp;</div>
                </li>
              </ul>
            </div>
          ) : (
            <div className="nonChallenge">
              <div>
                <h2>
                  챌린지를 통해 <br />
                  스탬프를 모아보세요!
                </h2>
                <img src={poorStamp} alt="poorStamp" />
              </div>
              <Button className="common" onClick={() => navigate('/challenge')}>
                챌린지 시작하기
              </Button>
            </div>
          )}
        </section>
      </article>
    </main>
  );
}

export default StampBoard;
