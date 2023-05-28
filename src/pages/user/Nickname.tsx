/* eslint-disable no-alert */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { Button, Input } from '../../components/index';
import inputState from '../../shared/Atom';
import '../../styles/pages/_Nickname.scss';
import { useQuery, useMutation, useQueryClient } from "react-query";
import instance from '../../api/instance';
import { getNickNameDoubleCheck } from '../../api/members';
import { useNavigate } from 'react-router';

function Nickname() {
  const [inputValue, setInputValue] = useRecoilState(inputState);
  const [dbNameCheck, setDbNameCheck] = useState(false);
  const [checkError, setCheckError] = useState("");

  const { isLoading, isError, data } = useQuery(
    ["nickname", inputValue],
    () => getNickNameDoubleCheck(inputValue)
  );
  console.log("data = ", data)

  const nicknameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (event.target.value !== "data" && event.target.value.length > 0) {
      setCheckError("사용가능 닉네임");
      setDbNameCheck(true);
    } else {
      if (event.target.value === "data") setCheckError("※ 이미 다른 사용자가 사용 중 입니다.");
      else setCheckError("");
      setDbNameCheck(false);

    }
  }
  const navigate = useNavigate();

  const checkNickname = (event: React.MouseEvent<HTMLButtonElement>): void => {
    navigate("/age")
  }
  const checkNickname2 = (event: React.MouseEvent<HTMLButtonElement>): void => {
    alert("닉네임 체크해주세요.!")
  }
  return (
    <main className='Nickname'>
      <article>
        <h1>가입을 축하드려요!<br />푸어의 이름을 지어주세요.</h1>
        <div className='nicknameForm'>
          <Input
            value={inputValue}
            id='nicknameInput'
            placeholder='닉네임을 입력하세요'
            className='nickname'
            onChange={nicknameChangeHandler}
          />
          <label htmlFor='nicknameInput' className={`nicknameLabel ${inputValue.length > 0 ? 'active' : ''}`}>닉네임</label>
          <label htmlFor='nicknameInput' className={`cursor ${inputValue.length > 0 ? 'active' : ''}`}> </label>
          <label htmlFor='nicknameInput' className={`nicknameValidationAlert ${inputValue.length > 0 ? 'active' : ''}`}>
            ※ 욕설 및 성희롱을 연상하게 하는 이름은 쓸 수 없어요.
          </label>
        </div>
        <div className='checkError'>
          {dbNameCheck ? "※" : "※ checkError"}
        </div>
      </article>

      {/* <Button
        className='common'
        onClick={() => checknickname()}>
        다음
      </Button> */}
      {dbNameCheck ? <button
        className='common'
        type='button'
        onClick={checkNickname}>다음
      </button>
        : <button
          className='common'
          type='button'
          onClick={checkNickname2}>다음
        </button>}
    </main>
  );
}

export default Nickname;
