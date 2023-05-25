import React from 'react';
import '../../styles/components/_Controller.scss';
import { useLocation, useNavigate } from 'react-router-dom';

function Controller() {
  const navigate = useNavigate();

  const location = useLocation();

  const page = location.pathname;
  console.log('page:', page);

  return (
    <div className="controller">
      <button
        type="button"
        className={`${page}` === '/poorRoom' ? 'select' : 'noSelect'}
        onClick={() => navigate('/poorRoom')}
      >
        푸어룸
      </button>
      <button
        type="button"
        className={`${page}` === '/' ? 'select' : 'noSelect'}
        onClick={() => navigate('/')}
      >
        자산
      </button>
      <button
        type="button"
        className={`${page}` === '/introTalk' ? 'select' : 'noSelect'}
        onClick={() => navigate('/introTalk')}
      >
        푸어톡
      </button>
    </div>
  );
}

export default Controller;
