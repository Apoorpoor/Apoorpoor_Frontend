import React from 'react';
import error from '../../static/image/status/error.png';
import '../../styles/pages/_Error.scss';

function ServerError() {
  return (
    <div id="errorPage">
      <div>
        <h1 style={{ color: '#333333' }}>서버 보수 중입니다</h1>
        <p style={{ color: '#333333' }}>
          더 나은 어푸어푸가 되기 위해
          <br />
          서버를 이전하고 있습니다
          <br />
          <br />
          빠른 시일 내에 해결하겠습니다
          <br />
          불편을 드려 죄송합니다
        </p>
        <p>- 어푸어푸 개발팀 -</p>
        <img src={error} alt="에러이미지" />
      </div>
    </div>
  );
}

export default ServerError;
