/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import containerPositionState from '../../shared/ScrollContainer';
import '../../styles/components/_ProgressBar.scss';

// 게이지 기본 속성값
const RADIUS = 140; // 반지름
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // 둘레 길이
interface DataProps {
  exp: number;
  point: number;
  level: number;
}

function ProgressBar({ data }: { data: DataProps }) {
  // 레벨 별 필요 포인트
  const requiredPoint: { [key: number]: number } = {
    1: 99,
    2: 299,
    3: 599,
    4: 999,
    5: 1499,
    6: 2099,
    7: 2799,
    8: 3599,
    9: 4499,
    10: 5500,
  };

  const scrollPosition = useRecoilValue(containerPositionState);
  const [render, setRender] = useState(false);
  // 현재 레벨 진행 상태
  const levelGage = (data.point / requiredPoint[data.level]) * 100;

  // circle svg 저장용
  const barRef = useRef<SVGCircleElement | null>(null);
  // levelGage 값 저장용
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (scrollPosition > 1900) {
      setRender(true);
    }
  }, [scrollPosition]);

  useEffect(() => {
    if (barRef.current) {
      // strokeDashoffset 시작 위치 설정
      // strokeDasharray는 dash의 길이와 간격 설정
      barRef.current.style.strokeDashoffset = '-374';
      barRef.current.style.strokeDasharray = '0, 879.645943005142';
    }
  }, []);

  useEffect(() => {
    if (render) {
      let startValue = 0;
      const interval = setInterval(() => {
        const accumulatePoint = startValue / 100;
        const gageMax = CIRCUMFERENCE * 0.65;

        setValue(startValue);
        if (barRef.current) {
          barRef.current.style.strokeDashoffset = '-374';
          barRef.current.style.strokeDasharray = `${
            gageMax * accumulatePoint
          } ${CIRCUMFERENCE - gageMax * accumulatePoint}`;
        }
        startValue += 1;

        if (startValue > levelGage) {
          clearInterval(interval);
        }
      }, 20);
    }
  }, [render]);

  return (
    <div id="LevelGage">
      <svg width="100%" height="280">
        <circle
          className="track"
          cx="50%"
          cy="180"
          r={RADIUS}
          strokeWidth="20"
          stroke="#f5f5f5"
          fill="transparent"
          strokeDasharray={`${CIRCUMFERENCE * 0.65} ${CIRCUMFERENCE * 0.35}`}
          strokeDashoffset="-372"
          strokeLinecap="round"
        />
        <circle
          ref={barRef}
          width="100%"
          className="value"
          cx="50%"
          cy="180"
          r={RADIUS}
          stroke="#4194F1"
          strokeWidth="20"
          strokeDasharray="-374"
          strokeDashoffset="0, 879.645943005142"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <p id="AccumulatePoint">누적 {data.exp} P</p>
      <p id="Point">
        <span>{data.point}</span> P
      </p>
      <p className="Level currentLevel">Lv {data.level}</p>
      <p className="Level nextLevel">Lv {data.level + 1}</p>
    </div>
  );
}

export default ProgressBar;
