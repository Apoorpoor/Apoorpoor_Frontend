import React, { useState } from 'react';
import { Button } from '../../components';

function Error() {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleRefresh = () => {
    // 상태 업데이트로 컴포넌트 다시 렌더링
    setRefreshCount(refreshCount + 1);
  };

  return (
    <div>
      <h1>텅 비었네요</h1>
      <p>
        서버와 통신이 원활하지 않아
        <br />
        정보를 불러올 수 없어요
      </p>
      <Button className="common" onClick={handleRefresh}>
        다시시도
      </Button>
    </div>
  );
}

export default Error;
