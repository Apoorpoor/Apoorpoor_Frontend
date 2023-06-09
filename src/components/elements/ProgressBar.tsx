import React, { useEffect, useRef, useState } from 'react';
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
  console.log('포인트게이지props', data);
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

  // 현재 레벨 진행 상태
  const levelGage = (data.point / requiredPoint[data.level]) * 100;
  console.log('레벨 게이지', levelGage);

  // circle svg 저장용
  const barRef = useRef<SVGCircleElement | null>(null);
  // levelGage 값 저장용
  const [value, setValue] = useState(levelGage);

  const progress = (per: number) => {
    // 누적 포인트
    const accumulatePoint = per / 100;
    const gageMax = CIRCUMFERENCE * 0.65;

    setValue(per);
    if (barRef.current) {
      // strokeDashoffset 시작 위치 설정
      // strokeDasharray는 dash의 길이와 간격 설정
      barRef.current.style.strokeDashoffset = '-374';
      barRef.current.style.strokeDasharray = `${gageMax * accumulatePoint} ${
        CIRCUMFERENCE - gageMax * accumulatePoint
      }`;
    }
  };

  useEffect(() => {
    let startValue = 0;

    const interval = setInterval(() => {
      setValue(startValue);
      startValue += 1;

      if (startValue > levelGage) {
        clearInterval(interval);
      }
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [levelGage]);

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
