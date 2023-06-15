import React, { useRef } from 'react';
import { useMutation } from 'react-query';
import Portal from '../../shared/Portal';
import accounts from '../../api/accounts';

interface MainDelModalProps {
  delModalClose: () => void;
  id: string;
  modalAnimation: string;
}

function MainDelModal({
  delModalClose,
  id,
  modalAnimation,
}: MainDelModalProps) {
  // 배경 누르면 모달 닫힘
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === modalRef.current) {
      // 배경을 클릭한 경우에만 모달을 닫기
      delModalClose();
    }
  };

  // 가계부 삭제
  const delAccountListMutation = useMutation(
    () => accounts.delAccountList(id),
    {
      onSuccess: () => {
        console.log('가계부 이름 삭제 성공!');
      },
      onError: (err) => {
        console.log('가계부 삭제 실패:', err);
      },
    }
  );

  const handledelAccountList = async () => {
    try {
      await delAccountListMutation.mutateAsync();
      delModalClose();
    } catch (err) {
      console.log('가계부 삭제 실패:', err);
    }
  };

  return (
    <Portal>
      <div
        className="delModalBg"
        ref={modalRef}
        onClick={handleBackgroundClick}
        aria-hidden="true"
      >
        <div className={`delModalBox ${modalAnimation}`}>
          <h2>가계부를 삭제할까요?</h2>
          <div>
            <button className="cancleBtn" type="button" onClick={delModalClose}>
              취소
            </button>
            <button
              className="delBtn"
              type="button"
              onClick={handledelAccountList}
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default MainDelModal;
