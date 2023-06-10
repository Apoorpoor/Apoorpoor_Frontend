/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import '../../styles/components/_Controller.scss';
import { useLocation, useNavigate } from 'react-router-dom';

function Controller() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname;

  type PageIndex = {
    [key: string]: number;
  };

  const pageIndex: PageIndex = {
    '/poorRoom': 0,
    '/': 1,
    '/account': 1,
    '/introTalk': 2,
  };

  const [markerPosition, setMarkerPosition] = useState(
    pageIndex[page] * 100 + 5
  );

  useEffect(() => {
    setMarkerPosition(pageIndex[page] * 100 + 5);
  }, [page]);

  const controllerHandler = (index: number) => {
    const ButtonWidth = 100;
    const newPosition = index * ButtonWidth + 5;
    setMarkerPosition(newPosition);

    switch (index) {
      case 0:
        navigate('/poorRoom');
        break;
      case 1:
        navigate('/');
        break;
      case 2:
        navigate('/introTalk');
        break;
      default:
        break;
    }
  };

  const isSelected = (targetPage: string) =>
    page === targetPage ? 'select' : 'noSelect';

  // 컨트롤러 없어야 하는 페이지 필요하시다면 추가 해주세요!
  if (
    page === '/poorTalk' ||
    page === '/poorItemSetting' ||
    page === '/badgeList'
  ) {
    return null;
  }

  return (
    <div className="controller">
      <div className="controllerRale">
        <button
          type="button"
          className={isSelected('/poorRoom')}
          onClick={() => controllerHandler(0)}
        >
          푸어룸
        </button>
        <button
          type="button"
          className={`${isSelected('/')} ${isSelected('/account')}`}
          onClick={() => controllerHandler(1)}
        >
          자산
        </button>
        <button
          type="button"
          className={isSelected('/introTalk')}
          onClick={() => controllerHandler(2)}
        >
          푸어톡
        </button>
      </div>
      <div className="controllerMark" style={{ left: `${markerPosition}px` }} />
    </div>
  );
}

export default Controller;
