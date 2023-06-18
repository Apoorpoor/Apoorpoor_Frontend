/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import containerPositionState from '../../shared/ScrollContainer';
import scrollMoveDirection from '../../shared/ScrollMoveDirection';
import '../../styles/components/_Layout.scss';
import Controller from './Controller';

type ChildrenType = {
  children: ReactNode;
};

function Layout({ children }: ChildrenType) {
  // 스크롤 이벤트
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useRecoilState(
    containerPositionState
  );
  const [scollMoveDirection, setSrollMoveDirection] =
    useRecoilState(scrollMoveDirection);
  const [throttle, setThrottle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (throttle) return;
      if (!throttle) {
        setThrottle(true);
        setTimeout(async () => {
          const position = containerRef.current?.scrollTop || 0;
          const scrollChange = position - scrollPosition;
          // 컨트롤러 위치 조정
          if (scrollChange > 0) {
            setSrollMoveDirection('bottom');
          } else {
            setSrollMoveDirection('top');
          }
          setScrollPosition(position);
          setThrottle(false);
        }, 500);
      }
    };

    const currentContainerRef = containerRef.current;
    currentContainerRef?.addEventListener('scroll', handleScroll);

    return () => {
      currentContainerRef?.removeEventListener('scroll', handleScroll);
    };
  }, [throttle]);

  return (
    <div className="Wrapper">
      <div className="Container" ref={containerRef}>
        {children}
      </div>
      <Controller />
    </div>
  );
}

export default Layout;
