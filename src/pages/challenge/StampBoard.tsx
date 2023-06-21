import React from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../../components';

function StampBoard() {
  const navigate = useNavigate();
  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(-1);
  };
  return (
    <main id="challengeSt">
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        스탬프 보기
      </Header>
      <article>
        <section>
          <div className="challengeStamp">
            <ul>
              <li>
                <div className="stamp fail">&nbsp;</div>
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
        </section>
      </article>
    </main>
  );
}

export default StampBoard;
