import React, { useState } from 'react';
import { VscCircleFilled } from 'react-icons/vsc';
import Portal from '../../shared/Portal';
import '../../styles/components/_Tutorial.scss';

// Main.tsx에서 받아오는 props
interface TutorialProps {
  setTutorial: React.Dispatch<React.SetStateAction<boolean>>;
  setFir: React.Dispatch<React.SetStateAction<boolean>>;
  fir: boolean;
}

function Tutorial({ setTutorial, setFir, fir }: TutorialProps) {
  // 모달창 닫기
  const tutorialClose = () => {
    setTutorial(false);
  };

  // 페이지 상태 관리
  const [sec, setSec] = useState(false);
  const [thir, setThir] = useState(false);
  const [four, setFour] = useState(false);

  // 두 번째 페이지
  const secClick = () => {
    setSec(false);
    setThir(true);
  };

  const handleSecDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setSec(false);
      setThir(true);
    }
  };

  // 세 번째 페이지
  const thirClick = () => {
    setThir(false);
    setFour(true);
  };

  const handleThirDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setThir(false);
      setFour(true);
    }
  };

  // 네 번째 페이지
  const fourClick = () => {
    setFour(false);
  };

  const handleFourDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setFour(false);
    }
  };
  return (
    <Portal>
      <main id="tutorial">
        {/* 첫번째 튜토리얼 */}
        {fir && (
          <div id="page">
            <div className="background">
              <div className="rowBox">
                <div className="mainIcon" />
                <p>여기서 언제든지 다시 볼 수 있어요.</p>
              </div>
            </div>
            <div className="contentBg">
              <div className="welcomeBox">
                <div className="welcomeModal">
                  <section id="title">
                    <h2>만나서 반가워요</h2>
                    <p>
                      어푸어푸를 이용하시는데 필요한 <br />
                      사용법을 알려드릴게요!
                    </p>
                  </section>
                  <section id="bottomBox">
                    <button type="button" onClick={tutorialClose}>
                      그만 볼래요
                    </button>
                    <button
                      onClick={() => {
                        setFir(false);
                        setSec(true);
                      }}
                      type="button"
                      style={{ color: '#4194F1' }}
                    >
                      좋아요
                    </button>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 두번째 튜토리얼 */}
        {sec && (
          <div
            id="page"
            role="button"
            tabIndex={0}
            onClick={secClick}
            onKeyDown={handleSecDown}
          >
            <div className="background">
              <p className="goAccountText">
                이곳에서 가계부를 생성하고 관리할 수 있어요!
              </p>
              <div className="goAccount" />
            </div>

            <div className="contentBg">
              <div>
                <button
                  className="closeBtn"
                  type="button"
                  onClick={tutorialClose}
                >
                  그만 볼래요
                </button>

                <div className="slideBtnBox">
                  <VscCircleFilled style={{ color: '#4194F1' }} />
                  <VscCircleFilled />
                  <VscCircleFilled />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 세번째 튜토리얼 */}
        {thir && (
          <div
            id="page"
            role="button"
            tabIndex={0}
            onClick={thirClick}
            onKeyDown={handleThirDown}
          >
            <div className="background">
              <div className="third">
                <div className="goPoorRoom" />
                <div className="goPoorRoomRight" />
              </div>
              <p className="goText">
                나만의 푸어를 키우고 커스텀 할 수 있어요!
              </p>
            </div>

            <div className="contentBg">
              <div>
                <button
                  className="closeBtn"
                  type="button"
                  onClick={tutorialClose}
                >
                  그만 볼래요
                </button>

                <div className="slideBtnBox">
                  <VscCircleFilled />
                  <VscCircleFilled style={{ color: '#4194F1' }} />
                  <VscCircleFilled />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 네번째 튜토리얼 */}
        {four && (
          <div
            id="page"
            role="button"
            tabIndex={0}
            onClick={fourClick}
            onKeyDown={handleFourDown}
          >
            <div className="background">
              <div className="fourth">
                <div className="goChalLeft" />
                <div className="goChal" />
              </div>
              <p className="goText">
                소비 챌린지를 통해 포인트를 얻을 수 있어요!
              </p>
            </div>

            <div className="contentBg">
              <div>
                <button
                  className="closeBtn"
                  type="button"
                  onClick={tutorialClose}
                >
                  그만 볼래요
                </button>

                <div className="slideBtnBox">
                  <VscCircleFilled />
                  <VscCircleFilled />
                  <VscCircleFilled style={{ color: '#4194F1' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </Portal>
  );
}

export default Tutorial;
