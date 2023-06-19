/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router';
import { Input } from '../../components/index';
import inputState from '../../shared/Atom';
import '../../styles/pages/_Age.scss';
import instance from '../../api/instance';
import { UserAge } from '../../shared/JoinUserInfo';

function Age() {
  const [inputValue, setInputValue] = useRecoilState(inputState);
  const [userAge, setUserAge] = useRecoilState(UserAge);
  const [nextButton, setNextButton] = useState(false);

  const navigate = useNavigate();

  const onlyNumber = (age: string) => {
    const inputNumber = age.replace(/[^0-9]/g, '');
    return inputNumber;
  };

  const nicknameChangeHandler = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputValue(e.target.value);
    if (e.target.value.length >= 1) {
      setNextButton(true);
    }
    if (e.target.value.length > 2) {
      alert('너무 많습니다');
      setInputValue('');
      setNextButton(false);
    }
  };

  // const ageButtonHandler = (event: string) => {
  //   const value = inputValue + event;
  //   setInputValue(value);
  //   if (inputValue.length > 1) {
  //     alert('너무 많습니다');
  //     setInputValue('');
  //     setNextButton(false);
  //   }
  // };
  // const ageRemoveButtonHandler = () => {
  //   const value = inputValue.slice(0, -1);
  //   setInputValue(value);
  // };

  return (
    <main className="AgePage">
      <div className="between">
        <button type="button" onClick={() => navigate('/nickname')}>
          <FaChevronLeft className="ArrowBackground" />
        </button>
        <article>
          <h1>나이를 알려주세요.</h1>
          <div className="ageInfo">
            나이, 성별 등 개인정보는 소셜 기능에 사용돼요.
          </div>
          <div className="nicknameForm">
            <Input
              value={onlyNumber(inputValue)}
              id="nicknameInput"
              placeholder="나이를 입력하세요"
              className={`nickname ${inputValue.length > 0 ? 'pass' : ''}`}
              onChange={nicknameChangeHandler}
            />
            <label
              htmlFor="nicknameInput"
              className={`nicknameLabel ${
                inputValue.length > 0 ? 'active' : ''
              }`}
            >
              나이
            </label>
            <label
              htmlFor="nicknameInput"
              className={`cursor ${inputValue.length > 0 ? 'active' : ''}`}
            >
              {' '}
            </label>
            <label
              htmlFor="nicknameInput"
              className={`nicknameValidationAlert ${
                inputValue.length > 0 ? 'active' : ''
              }`}
            >
              {/* ※ 욕설 및 성희롱을 연상하게 하는 이름은 쓸 수 없어요. */}
            </label>
          </div>
        </article>
      </div>
      <div>
        <button
          className="common"
          disabled={nextButton === false}
          type="button"
          onClick={() => {
            navigate('/gender');
            setUserAge(Number(inputValue));
            setInputValue('');
          }}
        >
          다음
        </button>
      </div>
    </main>
  );
}

export default Age;
