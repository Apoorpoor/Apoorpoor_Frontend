import React from 'react';
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
          </ul>
        </section>
      </article>
    </main>
  );
}

export default Challenge;
