import React, { useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { useRecoilState } from 'recoil';
import { checkNicknameValidation } from '../../api/members';
import inputState from '../../shared/Atom';
import Input from './Input';

interface ValidationResult {
  status: number;
}

function NicknamedbCheck() {
  const [inputValue, setInputValue] = useRecoilState(inputState);
  const [dbNicknameCheck, setdbNicknameCheck] = useState(false);
  const [validationAlert, setValidationAlert] = useState('');

  const { data }: UseQueryResult<ValidationResult> = useQuery(
    ['checkNicknameValidation', inputValue],
    () => checkNicknameValidation(inputValue)
  );

  const nicknameChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValue(event.target.value);

    if (data && data.status === 403) {
      setValidationAlert('욕설 및 비속어가 들어간 이름은 쓸 수 없어요.');
      setdbNicknameCheck(false);
    } else if (data && data.status === 400) {
      setValidationAlert('중복된 닉네임이에요.');
      setdbNicknameCheck(false);
    } else if (event.target.value.length === 0) {
      setValidationAlert('');
      setdbNicknameCheck(false);
    } else if (event.target.value.length === 1) {
      setValidationAlert('닉네임은 2글자 이상으로 해주세요.');
      setdbNicknameCheck(false);
    } else if (event.target.value.length < 2) {
      setValidationAlert('닉네임은 2글자 이상으로 해주세요.');
      setdbNicknameCheck(false);
    } else if (event.target.value.length > 8) {
      setValidationAlert('닉네임은 8글자 이하로 해주세요.');
      setdbNicknameCheck(false);
    } else {
      setValidationAlert('');
      setdbNicknameCheck(true);
    }
  };

  return (
    <div>
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
      >
        {`※ ${validationAlert}`}
      </label>
    </div>
  );
}

export default NicknamedbCheck;
