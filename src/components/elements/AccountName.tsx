import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useMutation } from 'react-query';
import Portal from '../../shared/Portal';
import accounts from '../../api/accounts';
import '../../styles/components/_AccountModal.scss';
import inputState from '../../shared/Atom';
import Input from './Input';

interface AccountNameProps {
  nameModalClose: () => void;
  data: { title: string; id: string } | undefined;
}

function AccountName({ nameModalClose, data }: AccountNameProps) {
  const [inputValue, setInputValue] = useRecoilState(inputState);
  const [accountNameInput, setAccountNameInput] = useState(data?.title || '');

  const accountNameOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setAccountNameInput(event.target.value);
  };

  // 가계부 이름 수정
  const editAccountNameMutation = useMutation((title: string) =>
    accounts.editAccountName(data?.id || '', title)
  );

  const handleEditAccountName = async () => {
    try {
      await editAccountNameMutation.mutateAsync(accountNameInput);
      console.log('가계부 이름 수정 성공!');
      nameModalClose();
    } catch (error) {
      console.log('가계부 이름 수정 실패:', error);
    }
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
            onClick={handleEditAccountName}
          >
            확인
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default AccountName;
