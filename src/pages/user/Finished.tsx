import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import '../../styles/pages/_Finished.scss';
import { useNavigate } from 'react-router';
import good2 from '../../static/image/gender/good2.png';
import base from '../../static/image/gender/base.png';
import base2 from '../../static/image/gender/base2.png';

function Finished() {
  const navigate = useNavigate();

  return (
    <main className="finishedPage">
      <div>
        <button type="button" onClick={() => navigate('/age')}>
          <FaChevronLeft className="ArrowBackground" />
        </button>
        <h1>푸어생성 완료!</h1>
        <div className="finishedInfo">이제 어푸어푸의 모든 서비스를</div>
        <div className="finishedInfo">이용할 수 있어요!</div>
      </div>
      <article>
        <div className="finishedImages">
          <img className="finishedImage" src={good2} alt="달력" />
          <img className="finishedImage1" src={base} alt="뒷배경" />
          <img className="finishedImage" src={base2} alt="뒷배경2" />
        </div>
      </article>

      <div>
        <button className="common" type="button" onClick={() => navigate('/')}>
          다음
        </button>
      </div>
    </main>
  );
}

export default Finished;
