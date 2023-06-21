import React from 'react';
import '../../styles/pages/_Challenge.scss';
import { useNavigate } from 'react-router';
import challFail from '../../static/image/challenge/challFail.png';

function ChallengeFail() {
  const navigate = useNavigate();
  return (
    <main id="challengeFail">
      <section id="title">
        <p>2만원 챌린지</p>
      </section>
      <section id="body">
        <img src={challFail} alt="challFail" />
        <p>챌린지 실패...</p>
      </section>
      <section id="footer">
        <button type="button" className="goMain" onClick={() => navigate('/')}>
          홈으로
        </button>
      </section>
    </main>
  );
}

export default ChallengeFail;
