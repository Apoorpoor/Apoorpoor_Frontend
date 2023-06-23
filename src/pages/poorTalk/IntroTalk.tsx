import React from 'react';
import '../../styles/pages/_IntroTalk.scss';
import { FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PoorCharacter from '../poorRoom/PoorCharacter';

function IntroTalk() {
  const navigate = useNavigate();

  return (
    <div id="IntroTalkLayout">
      <section>
        <div className="PoorImage">
          <PoorCharacter avatarType='MyPoorImage' />
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

        <button
          className="StartChat2"
          type="button"
          onClick={() => navigate('/poorTalk')}
        >
          채팅 시작하기
        </button>

      </section>
    </div>
  );
}

export default IntroTalk;
