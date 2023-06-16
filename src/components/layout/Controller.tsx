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
    '/social': 0,
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
        navigate('/social');
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

  const isSelected = (targetPages: string[]) => {
    const regex = /^\/account\/\d+$/; // '/account'로 시작하고 뒤에 숫자가 오는지 확인
    const regex2 = /^\/addAccount\/\d+$/; // '/addAccount'로 시작하고 뒤에 숫자가 오는지 확인

    return targetPages.includes(page) ||
      (regex.test(page) && targetPages.includes('/account')) ||
      (regex2.test(page) && targetPages.includes('/addAccount'))
      ? 'select'
      : 'noSelect';
  };

  // 컨트롤러 없어야 하는 페이지 필요하시다면 추가 해주세요!
  if (
    page === '/poorTalk' ||
    page === '/poorRoom' ||
    page === '/poorItemSetting' ||
    page === '/badgeList' ||
    page === '/login' ||
    page === '/nickname' ||
    page === '/age' ||
    page === '/gender' ||
    page === '/finished' ||
    page === '/AlarmStation' ||
    page === '/oauth/kakao' ||
    /^\/addAccount\/\d+$/.test(page) ||
    /^\/addAccountDone\/\d+$/.test(page) ||
    /^\/editAccount\/\d+$/.test(page)
  ) {
    return null;
  }

  return (
    <div className="controller">
      <div className="controllerRale">
        <button
          type="button"
          className={isSelected([
            '/social',
            '/social/reduction',
            '/social/flex',
          ])}
          onClick={() => controllerHandler(0)}
        >
          소셜
        </button>
        <button
          type="button"
          className={isSelected(['/', '/account'])}
          onClick={() => controllerHandler(1)}
        >
          자산
        </button>
        <button
          type="button"
          className={isSelected(['/introTalk'])}
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
