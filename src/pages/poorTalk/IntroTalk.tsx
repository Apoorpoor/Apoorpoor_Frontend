import React from 'react';
import '../../styles/pages/_IntroTalk.scss';
import { FaExclamationCircle, FaCheckSquare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import basicPoor from '../../static/image/gender/basicPoor.png';

function IntroTalk() {
  const navigate = useNavigate();

  const [checked, setChecked] = React.useState(false);
  const CheckBoxHandler = () => {
    setChecked(!checked);
  };
  return (
    <main id="IntroTalkLayout">
      <section>
        <div className="PoorImage">
          <img src={basicPoor} alt="거지 이미지" />
        </div>
        <div className="RuleBox">
          <div className="Rule">
            <h2>푸어TALK 이용규칙</h2>
            <br />
            <div className="RuleText">
              소비관련 이야기 외 다른 대화는 지양해주세요.
            </div>
            <div className="RuleText">
              상처보다는 응원 가득한 푸어러가 되어봅시다!
            </div>
          </div>
          <div className="TextAgree ">
            <FaExclamationCircle /> 개인정보 요구, 욕설 등은 이용에 제한이 있을
            수 있어요.
          </div>
        </div>
      </section>

      <section>
        {checked ? (
          <div className="CheckBox2">
            이해했어요
            <FaCheckSquare
              className="CheckBoxPoint2"
              onClick={CheckBoxHandler}
            />
          </div>
        ) : (
          <div className="CheckBox1">
            이해했어요
            <FaCheckSquare
              className="CheckBoxPoint1"
              onClick={CheckBoxHandler}
            />
          </div>
        )}
        {checked ? (
          <button
            className="StartChat2"
            type="button"
            onClick={() => navigate('/poorTalk')}
          >
            채팅 시작하기
          </button>
        ) : (
          <button type="button" className="StartChat1">
            채팅 시작하기
          </button>
        )}
      </section>
    </main>
  );
}

export default IntroTalk;
