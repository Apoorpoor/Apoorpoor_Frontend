import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import Portal from '../../shared/Portal';
import '../../styles/components/_AccountModal.scss';
import inputState from '../../shared/Atom';
import Input from './Input';

interface AccountNameProps {
  setNameModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: { title: string } | undefined;
}

function AccountName({ setNameModal, data }: AccountNameProps) {
  const nameModalClose = (): void => {
    setNameModal(false);
  };

  const [inputValue, setInputValue] = useRecoilState(inputState);
  const [accountNameInput, setAccountNameInput] = useState(data?.title || '');

  const accountNameOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setAccountNameInput(event.target.value);
  };

  if (!data) {
    return <span>data가 없습니다</span>;
  }

  return (
    <Portal>
      <div className="accountModalBg">
        <div className="accountNameModalBox">
          <Input
            value={accountNameInput}
            id="accountNameInput"
            placeholder="가계부 이름"
            className="accountName"
            onChange={accountNameOnchange}
          />
          <label
            htmlFor="accountNameInput"
            className={`cursor ${inputValue.length > 0 ? 'active' : ''}`}
          >
            {' '}
          </label>
          <button
            className="accountNameBtn"
            type="button"
            onClick={nameModalClose}
          >
            확인
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default AccountName;
