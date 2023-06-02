import React from 'react';
import '../../styles/pages/_AddAccount.scss';
import { useNavigate } from 'react-router';
import doneImg from '../../static/image/addAccountDone/Group 4257.png';

function AddAccountDone() {
  const navigate = useNavigate();
  return (
    <div className="doneBg">
      <div className="doneTitle">
        <div className="donePoint">10포인트 적립</div>
        <h1>오늘도 저축 성공!</h1>
        <p>아싸 치킨값 굳었다</p>
        <img className="doneImg" src={doneImg} alt="doneImg" />
      </div>

      <div className="doneFooter">
        <button
          onClick={() => navigate('/account')}
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

export default AddAccountDone;
