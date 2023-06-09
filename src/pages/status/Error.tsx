import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components';
import error from '../../static/image/status/error.png';
import '../../styles/pages/_Error.scss';

function Error() {
  const navigate = useNavigate();
  const [refreshCount, setRefreshCount] = useState(0);

  const handleRefresh = () => {
    // 상태 업데이트로 컴포넌트 다시 렌더링
    setRefreshCount(refreshCount + 1);
  };

  return (
    <div id="errorPage">
      <div>
        <h1>텅 비었네요</h1>
        <p>
          서버와 통신이 원활하지 않아
          <br />
          정보를 불러올 수 없어요
        </p>
        <img src={error} alt="에러이미지" />
      </div>
      <div>
        <Button className="textType" onClick={() => navigate('/account')}>
          자산탭 바로가기
        </Button>
        <Button className="common" onClick={handleRefresh}>
          다시 시도
        </Button>
      </div>
    </div>
  );
}

export default Error;
