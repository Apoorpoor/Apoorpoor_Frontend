import React from 'react';
import '../../styles/pages/_EditAccountDone.scss';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { accountIdState } from '../../shared/Atom';
import Portal from '../../shared/Portal';
import editDone from '../../static/image/addAccountDone/editDone.png';

function EditAccountDone() {
  const navigate = useNavigate();

  // 가계부 id
  const accountId = useRecoilValue(accountIdState);

  return (
    <Portal>
      <div className="editAccountBg">
        <div className="ModalBox">
          <p>수정이 완료 됐어요!</p>
          <img src={editDone} alt="editDone" />

          <button
            onClick={() => navigate(`/account/${accountId}`)}
            type="button"
          >
            지출내역 보러가기
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default EditAccountDone;
