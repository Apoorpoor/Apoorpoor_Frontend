import React from 'react';
import '../../styles/pages/_AddAccount.scss';
import { useNavigate, useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { messageState, categoryState, pointState } from '../../shared/Atom';
import done from '../../static/image/addAccountDone/Group 4498.png';

function AddAccountDone() {
  const navigate = useNavigate();

  const category = useRecoilValue(categoryState);
  const message = useRecoilValue(messageState);
  const point = useRecoilValue(pointState);

  const categoryMsg = (cate: string): string => {
    if (cate === 'INCOME') {
      return '냠냠 돈 들어왔어요!';
    }
    if (cate === 'SAVINGS') {
      return '오늘도 저축 성공!';
    }
    return '돈 나가는 소리 또로록...';
  };

  const { id } = useParams<{ id: string | undefined }>();

  return (
    <div className="doneBg">
      <div className="doneTitle">
        <div className="donePoint">{point}포인트 적립</div>
        <h1>{categoryMsg(category)}</h1>
        <p>{message}</p>
        <img className="doneImg" src={done} alt="doneImg" />
      </div>

      <div className="doneFooter">
        <button
          onClick={() => navigate(`/account/${id}`)}
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
