import React, { useState, useRef } from 'react';
import { useMutation } from 'react-query';
import Portal from '../../shared/Portal';
import accounts from '../../api/accounts';
import '../../styles/components/_AccountModal.scss';
import Input from './Input';

interface AccountNameProps {
  nameModalClose: () => void;
  data: { title: string; id: string } | undefined;
}

function AccountName({ nameModalClose, data }: AccountNameProps) {
  const [accountName, setAccountName] = useState('');
  const [accountNameInput, setAccountNameInput] = useState(data?.title || '');

  // 배경 누르면 모달 닫힘
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === modalRef.current) {
      // 배경을 클릭한 경우에만 모달을 닫기
      nameModalClose();
    }
  };

  // 엑스 버튼 누르면 내용 삭제
  const handleAccountNameInputClear = () => {
    setAccountName('');
  };

  const accountNameOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(event.target.value);
    setAccountNameInput(event.target.value);
  };

  // 가계부 이름 수정
  const editAccountNameMutation = useMutation((title: string) =>
    accounts.editAccountName(data?.id || '', title)
  );

  const handleEditAccountName = async () => {
    try {
      if (!accountNameInput) {
        console.log('가계부 이름을 작성해주세요.');
        return;
      }
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
      <div
        ref={modalRef}
        className="accountModalBg"
        onClick={handleBackgroundClick}
        aria-hidden="true"
      >
        <div className="accountNameModalBox">
          <Input
            value={accountNameInput}
            id="accountNameInput"
            placeholder="가계부 이름"
            className="accountName"
            onChange={accountNameOnchange}
            onClear={handleAccountNameInputClear}
          />
          <label
            htmlFor="accountNameInput"
            className={`cursor ${accountName.length > 0 ? 'active' : ''}`}
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
