import React, { useEffect, useRef, useState } from 'react';
import '../../styles/components/_ProgressBar.scss';

// 게이지 기본 속성값
const RADIUS = 140; // 반지름
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // 둘레 길이

function ProgressBar() {
  // circle svg 저장용
  const barRef = useRef<SVGCircleElement | null>(null);
  // levelGage 값 저장용
  const [value, setValue] = useState(60);

  const progress = (per: number) => {
    // 누적 포인트
    const accumulatePoint = per / 100;
    const gageMax = CIRCUMFERENCE * 0.65;

    setValue(per);
    if (barRef.current) {
      // strokeDashoffset 시작 위치 설정
      // strokeDasharray는 dash의 길이와 간격 설정
      barRef.current.style.strokeDashoffset = '-372';
      barRef.current.style.strokeDasharray = `${
        gageMax * accumulatePoint
      } ${500}`;
    }
  };

  useEffect(() => {
    progress(value);
  }, [value]);

  return (
    <div id="LevelGage">
      <svg width="100%" height="280">
        <circle
          className="track"
          cx="50%"
          cy="180"
          r={RADIUS}
          strokeWidth="20"
          stroke="#d9d9d9"
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
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <p id="AccumulatePoint">누적 5,000 P</p>
      <p id="Point">
        <span>1,000</span> P
      </p>
      <p className="Level currentLevel">Lv 1</p>
      <p className="Level nextLevel">Lv 2</p>
    </div>
  );
}

export default ProgressBar;
