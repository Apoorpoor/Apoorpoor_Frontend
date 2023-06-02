import React from 'react';
import { useRecoilState } from 'recoil';
import Portal from '../../shared/Portal';
import '../../styles/components/_AccountModal.scss';
import inputState from '../../shared/Atom';
import Input from './Input';

interface AccountNameProps {
  setNameModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function AccountName({ setNameModal }: AccountNameProps) {
  const nameModalClose = (): void => {
    setNameModal(false);
  };

  // const [accountNameInput, setAccountNameInput] = useState('');
  const [inputValue, setInputValue] = useRecoilState(inputState);

  const accounNameOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  return (
    <Portal>
      <div className="accountModalBg">
        <div className="accountNameModalBox">
          <Input
            value={inputValue}
            id="accountNameInput"
            placeholder="가계부 이름"
            className="accountName"
            onChange={accounNameOnchange}
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
