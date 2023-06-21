import React, { useEffect, useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { useRecoilState } from 'recoil';
import { IoMdAlert } from 'react-icons/io';
import { checkNicknameValidation } from '../../api/members';
import '../../styles/components/_Input.scss';
import { NicknameInputState } from '../../shared/Atom';
import Input from './Input';
import { dbNicknamecheck } from '../../shared/JoinUserInfo';

function NicknamedbCheck() {
  const [inputValue, setInputValue] = useRecoilState(NicknameInputState);
  const [dbNicknameCheck, setdbNicknameCheck] = useRecoilState(dbNicknamecheck);
  const [validationAlert, setValidationAlert] = useState('');
  const [isInputting, setIsInputting] = useState(false);

  const { data }: UseQueryResult<number> = useQuery(
    ['checkNicknameValidation', inputValue],
    () => checkNicknameValidation(inputValue)
  );

  const nicknameChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValue(event.target.value);
    setIsInputting(true);
  };

  useEffect(() => {
    if (isInputting) {
      return;
    }
    if (data && data === 403) {
      setValidationAlert('※ 욕설 및 비속어가 들어간 이름은 쓸 수 없어요.');
      setdbNicknameCheck(false);
    } else if (data && data === 400) {
      setValidationAlert('※ 중복된 닉네임이에요.');
      setdbNicknameCheck(false);
    } else if (inputValue.length === 0) {
      setValidationAlert('※ 닉네임을 입력해주세요');
      setdbNicknameCheck(false);
    } else if (inputValue.length !== 0 && inputValue.length < 2) {
      setValidationAlert('※ 닉네임은 2글자 이상으로 해주세요.');
      setdbNicknameCheck(false);
    } else if (inputValue.length > 8) {
      setValidationAlert('※ 닉네임은 8글자 이하로 해주세요.');
      setdbNicknameCheck(false);
    } else if (data && data === 200) {
      setValidationAlert('사용 가능한 닉네임이에요!');
      setdbNicknameCheck(true);
    } else {
      setValidationAlert('');
      setdbNicknameCheck(true);
    }
  }, [data, inputValue, isInputting, setdbNicknameCheck]);

  useEffect(() => {
    if (isInputting) {
      setIsInputting(false);
    }
  }, [inputValue, isInputting]);

  return (
    <div className="nicknameForm">
      <Input
        value={inputValue}
        id="nicknameInput"
        placeholder="닉네임을 입력하세요"
        className={`nickname ${dbNicknameCheck === true ? 'pass' : ''}`}
        onChange={nicknameChangeHandler}
      />
      <label
        htmlFor="nicknameInput"
        className={`nicknameLabel ${inputValue.length > 0 ? 'active' : ''} ${
          dbNicknameCheck === true ? 'pass' : ''
        }`}
      >
        닉네임
      </label>
      <label
        htmlFor="nicknameInput"
        className={`cursor ${inputValue.length > 0 ? 'active' : ''} ${
          dbNicknameCheck === true ? 'pass' : ''
        }`}
      />
      <label
        htmlFor="nicknameInput"
        className={`checkError ${inputValue.length > 0 ? 'active' : ''} ${
          dbNicknameCheck === true ? 'pass' : ''
        }`}
      >
        <IoMdAlert />
      </label>
      <p
        className={`nicknameValidationAlert ${
          dbNicknameCheck === true ? 'pass' : ''
        }`}
      >
        {validationAlert}
      </p>
    </div>
  );
}

export default NicknamedbCheck;
