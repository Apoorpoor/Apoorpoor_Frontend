/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router';
import { Button } from '../../components/index';
import '../../styles/pages/_Nickname.scss';
import NicknamedbCheck from '../../components/elements/NicknamedbCheck';
import { dbNicknamecheck, UserNickname } from '../../shared/JoinUserInfo';
import inputState, { NicknameInputState } from '../../shared/Atom';

function Nickname() {
  const navigate = useNavigate();
  const dbNicknameCheck = useRecoilValue(dbNicknamecheck);
  const [inputValue, setInputValue] = useRecoilState(NicknameInputState);
  const [userNickname, setUserNickname] = useRecoilState(UserNickname);

  return (
    <main className="Nickname">
      <article>
        <h1>
          가입을 축하드려요!
          <br />
          푸어의 이름을 지어주세요.
        </h1>
        <NicknamedbCheck />
      </article>
      <Button
        className="common"
        disabled={dbNicknameCheck === false}
        onClick={() => {
          navigate('/age');
          setUserNickname(inputValue);
          setInputValue('');
        }}
      >
        다음
      </Button>
    </main>
  );
}

export default Nickname;
