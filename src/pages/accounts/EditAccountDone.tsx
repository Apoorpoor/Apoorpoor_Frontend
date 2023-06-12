import React from 'react';
import '../../styles/pages/_AddAccount.scss';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { accountIdState } from '../../shared/Atom';
import doneImg from '../../static/image/addAccountDone/Group 4257.png';

function EditAccountDone() {
  const navigate = useNavigate();

  // 가계부 id
  const accountId = useRecoilValue(accountIdState);

  return (
    <div className="doneBg">
      <div className="doneTitle">
        <h1>수정이 완료 되었어요!</h1>
        <img className="doneImg" src={doneImg} alt="doneImg" />
      </div>

      <div className="doneFooter">
        <button
          onClick={() => navigate(`/account/${accountId}`)}
          className="doneBtn"
          type="button"
        >
          <p>완료</p>
        </button>
        <button
          onClick={() => navigate('/poorRoom')}
          className="goPoorRoomBtn"
          type="button"
        >
          푸어 키우러 가기
        </button>
      </div>
    </div>
  );
}

export default EditAccountDone;
