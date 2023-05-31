/* eslint-disable import/order */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { Button, Input } from '../../components/index';
import inputState from '../../shared/Atom';
import '../../styles/pages/_Nickname.scss';
import instance from '../../api/instance';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

function Nickname() {
  const [inputValue, setInputValue] = useRecoilState(inputState);
  const [dbNameCheck, setDbNameCheck] = useState(false);
  const [checkError, setCheckError] = useState("닉네임은 2글자 이상이여야합니다");

  const navigate = useNavigate();
  const token = localStorage.getItem("AToken");
  const Rtoken = Cookies.get('RToken');

  const nicknameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (event.target.value.length <= 1) {
      setCheckError("닉네임은 2글자 이상이여야합니다");
      setDbNameCheck(false);
    } else if (event.target.value.length > 8) {
      setCheckError("닉네임은 8글자 이하여야합니다");
      setDbNameCheck(false)
    }
    if (event.target.value.length < 8 && event.target.value.length >= 2) {
      setCheckError("※ 가능한 닉네임입니다.");
      setDbNameCheck(true)
    } if (event.target.value === "data") {
      setCheckError("※ 이미 다른 사용자가 사용 중 입니다.");
      setDbNameCheck(false)
    }

  }
  // setCheckError("※ 이미 다른 사용자가 사용 중 입니다.");
  // setCheckError("사용가능 닉네임");

  const checkNickname = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    try {
      const response = await instance.post(`/beggar`, {
        nickname: inputValue
      },
        {
          headers: {
            ACCESS_KEY: `Bearer ${token}`,
          },
        });
      navigate("/age")
      return response.data;

    } catch (err) {
      console.log(`닉네임  API 오류 발생: ${err}`);
      throw err;
    }
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
          {checkError}
          {/* {dbNameCheck ? "" : checkError} */}
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
          onClick={checkNickname2}>다음가짜
        </button>}
    </main>
  );
}

export default Nickname;
