import React from 'react';
import { useNavigate } from 'react-router';
import nonePoorInfoImg from '../../static/image/poor/nonePoorInfo.png';
import '../../styles/pages/_PoorInfoError.scss';

function PoorInfoError() {
  const navigate = useNavigate();

  return (
    <main id="poorInfoError">
      <section id="title">
        <h2>푸어가 없어요!</h2>
        <p>푸어 생성하기를 눌러주세요</p>
      </section>
      <img
        src={nonePoorInfoImg}
        alt="nonePoorInfoImg"
        onClick={() => navigate('/nickname')}
      />
      <button onClick={() => navigate('/')} type="button">
        <p>메인으로</p>
      </button>
    </main>
  );
}

export default PoorInfoError;
