import React from 'react';
import '../../styles/pages/_Challenge.scss';
import { useNavigate } from 'react-router';
import challDone from '../../static/image/challenge/challDone.png';

function ChallengeDone() {
  const navigate = useNavigate();
  return (
    <main id="challengeDone">
      <section id="title">
        <p>2만원 챌린지</p>
      </section>
      <section id="body">
        <img src={challDone} alt="challDone" />
        <p>챌린지 성공!</p>
      </section>
      <section id="footer">
        <button
          type="button"
          className="done"
          onClick={() => navigate('/challenge')}
        >
          완료
        </button>
        <button
          type="button"
          className="goStamp"
          onClick={() => navigate('/stampBoard')}
        >
          스탬프 획득하기
        </button>
      </section>
    </main>
  );
}

export default ChallengeDone;
