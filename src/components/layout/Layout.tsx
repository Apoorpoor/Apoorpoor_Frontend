/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import containerPositionState from '../../shared/ScrollContainer';
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
  const [throttle, setThrottle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (throttle) return;
      if (!throttle) {
        setThrottle(true);
        setTimeout(async () => {
          const position = containerRef.current?.scrollTop || 0;
          setScrollPosition(position);
          setThrottle(false);
        }, 800);
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
