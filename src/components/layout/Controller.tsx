import React from 'react';
import '../../styles/components/_Controller.scss';
import { useLocation, useNavigate } from 'react-router-dom';

function Controller() {
  const navigate = useNavigate();

  const location = useLocation();

  const page = location.pathname;

  const poorRoomController = () => {
    let pageName;
    if (page === '/poorRoom') {
      pageName = 'select';
    } else {
      pageName = 'noSelect';
    }
    return pageName;
  };

  const accountController = () => {
    let pageName;
    if (page === '/') {
      pageName = 'select';
    } else if (page === '/account') {
      pageName = 'select';
    } else {
      pageName = 'noSelect';
    }
    return pageName;
  };

  const poorTalkController = () => {
    let pageName;
    if (page === '/introTalk') {
      pageName = 'select';
    } else if (page === '/poorTalk') {
      pageName = 'select';
    } else {
      pageName = 'noSelect';
    }
    return pageName;
  };

  return (
    <div className="controller">
      <button
        type="button"
        className={poorRoomController()}
        onClick={() => navigate('/poorRoom')}
      >
        푸어룸
      </button>
      <button
        type="button"
        className={accountController()}
        onClick={() => navigate('/')}
      >
        자산
      </button>
      <button
        type="button"
        className={poorTalkController()}
        onClick={() => navigate('/introTalk')}
      >
        푸어톡
      </button>
    </div>
  );
}

export default Controller;
