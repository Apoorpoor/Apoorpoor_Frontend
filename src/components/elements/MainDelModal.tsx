import React from 'react';
import { useMutation } from 'react-query';
import Portal from '../../shared/Portal';
import accounts from '../../api/accounts';

interface MainDelModalProps {
  delModalClose: () => void;
  id: string;
}

function MainDelModal({ delModalClose, id }: MainDelModalProps) {
  // 가계부 삭제
  const delAccountMutation = useMutation(() => accounts.delAccountList(id), {
    onSuccess: () => {
      console.log('가계부 이름 삭제 성공!');
    },
    onError: (err) => {
      console.log('가계부 삭제 실패:', err);
    },
  });

  const handledelAccount = async () => {
    try {
      await delAccountMutation.mutateAsync();
      delModalClose();
    } catch (err) {
      console.log('가계부 삭제 실패:', err);
    }
  };

  return (
    <Portal>
      <div className="delModalBg">
        <div className="delModalBox">
          <h2>가계부를 삭제할까요?</h2>
          <div>
            <button className="cancleBtn" type="button" onClick={delModalClose}>
              취소
            </button>
            <button className="delBtn" type="button" onClick={handledelAccount}>
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default MainDelModal;
