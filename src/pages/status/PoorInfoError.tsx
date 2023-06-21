import React from 'react';
import { useNavigate } from 'react-router';
import nonePoorInfoImg from '../../static/image/poor/nonePoorInfo.png';

function PoorInfoError() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100%',
        textAlign: 'center',
        boxSizing: 'border-box',
        padding: '60px 0px 20px 0px',
      }}
    >
      <div
        style={{ paddingLeft: '20px', marginBottom: '30px', textAlign: 'left' }}
      >
        <h2>푸어가 없어요!</h2>
        <p>푸어 생성하기를 눌러주세요</p>
      </div>
      <img
        style={{ width: '360px' }}
        src={nonePoorInfoImg}
        alt="nonePoorInfoImg"
        onClick={() => navigate('/nickname')}
      />
      <button
        onClick={() => navigate('/')}
        type="button"
        style={{
          color: '#4194F1',
          fontSize: '14px',
          fontWeight: '400',
          textDecorationLine: 'underline',
        }}
      >
        메인으로
      </button>
    </div>
  );
}

export default PoorInfoError;
