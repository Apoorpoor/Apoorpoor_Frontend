import React, { useState } from 'react';
import Portal from '../../shared/Portal';
import '../../styles/components/_AccountName.scss';
import Input from './Input';

interface AccountNameProps {
  setNameModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function AccountName({ setNameModal }: AccountNameProps) {
  const nameModalClose = (): void => {
    setNameModal(false);
  };

  const [accountNameInput, setAccountNameInput] = useState('');

  const accounNameOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNameInput(event.target.value);
  };
  return (
    <Portal>
      <div className="accountNameModalBg">
        <div className="accountNameModalBox">
          <Input
            value={accountNameInput}
            id="accountNameInput"
            placeholder="가계부 이름"
            className="accountName"
            onChange={accounNameOnchange}
          />
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
