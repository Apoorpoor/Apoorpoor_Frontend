/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { SlArrowRight } from 'react-icons/sl';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { Button, Header } from '../../components';
import '../../styles/pages/_Challenge.scss';
import { getMyChallenge } from '../../api/challenge';
import { myChallengeInfo } from '../../shared/MyPoor';
import Loading from '../status/Loading';
import Error from '../status/Error';

function Challenge() {
  const navigate = useNavigate();
  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(-1);
  };

  // 나의 챌린지 정보
  const [myChallengeinfo, setMyChallengeinfo] = useRecoilState(myChallengeInfo);

  const [myChallenge, setMyChallenge] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);

  // 챌린지 타입
  const challengeTypeList: { [key: string]: string } = {
    '2만원 챌린지': 'CHALLENGE_20000 ',
    '5만원 챌린지': 'CHALLENGE_50000',
    '10만원 챌린지': 'CHALLENGE_100000',
    '무지출 챌린지': 'CHALLENGE_0',
  };

  // 진행중인 챌린지 불러오기
  const {
    isLoading,
    error,
    data: getMychallengeData,
  } = useQuery('getChallenge', getMyChallenge);

  useEffect(() => {
    if (getMychallengeData !== null) {
      setMyChallenge(true);
    }
  }, [getMychallengeData]);

  // 챌린지 버튼 클릭 핸들러
  const chooseChallengeHandler = (challengeType: string) => {
    const type = challengeType.split('')[0];
    if (getMychallengeData.challengeTitle === null) {
      navigate(`/myChallenge/${type}`);
    } else {
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2500);
    }
  };

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
    return <Error />;
  }
  return (
    <main id="challenge">
      <div className={`snackbar ${showSnackbar === false ? '' : 'show'}`}>
        <IoAlertCircleOutline />
        1주일에 한가지 챌린지만 가능해요!
      </div>
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        1주일 소비 챌린지
      </Header>
      <article>
        <div className="banner">
          <p>
            1주일 소비 챌린지<span>어떤 챌린지인지 궁금하신가요?</span>
          </p>
          <Button
            className="smallCommon"
            onClick={() => navigate('/challengeEx')}
          >
            알아보기
          </Button>
        </div>
        <section>
          <button
            type="button"
            className={`myChallenge ${
              getMychallengeData.challengeTitle === null ? '' : 'ing'
            }`}
            onClick={() => navigate('/myChallenge')}
          >
            <p>진행중인 챌린지가 있어요!</p>
            <SlArrowRight />
          </button>
          <ul>
            {Object.entries(challengeTypeList).map(([key, value]) => (
              <li
                key={key}
                onClick={() => {
                  setMyChallengeinfo({ challengeTitle: key, startTime: value });
                  chooseChallengeHandler(key);
                }}
              >
                <p>{key}</p>
                <div>&nbsp;</div>
              </li>
            ))}
            <li onClick={() => navigate('/stampBoard')}>
              <p>스탬프 보기</p>
              <div>&nbsp;</div>
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}

export default Challenge;
