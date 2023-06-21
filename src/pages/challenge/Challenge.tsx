import React from 'react';
import { SlArrowRight } from 'react-icons/sl';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { Button, Header } from '../../components';
import '../../styles/pages/_Challenge.scss';

function Challenge() {
  const navigate = useNavigate();
  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(-1);
  };
  return (
    <main id="challenge">
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        1주일 소비 챌린지
      </Header>
      <article>
        <div className="snackbar">
          <IoAlertCircleOutline />
          1주일에 한가지 챌린지만 가능해요!
        </div>
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
          <button type="button" className="myChallenge">
            <p>진행중인 챌린지가 있어요!</p>
            <SlArrowRight />
          </button>
          <ul>
            <li>
              <p>2만원 챌린지</p>
            </li>
            <li>
              <p>5만원 챌린지</p>
            </li>
            <li>
              <p>10만원 챌린지</p>
            </li>
            <li>
              <p>무지출 챌린지</p>
            </li>
            <li>
              <p>스탬프 보기</p>
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}

export default Challenge;
