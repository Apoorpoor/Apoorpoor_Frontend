import React, { useState, useEffect } from 'react';

// interface NumberAnimationProps {
//   targetNumber: number;
// }

function NumberAnimation(): JSX.Element {
  // 숫자 증가 애니메이션
  const [number, setNumber] = useState(0);

  const targetNumber = 99999;

  useEffect(() => {
    const animationDuration = 5000; // 5초
    const framesPerSecond = 60; // 초당 프레임 수
    const framesCount = (animationDuration / 1000) * framesPerSecond; // 총 프레임 수
    const increment = targetNumber / framesCount; // 프레임당 증가량 계산

    const animate = () => {
      setNumber((prevNumber) => {
        const nextNumber = prevNumber + increment;

        if (nextNumber >= targetNumber) {
          return targetNumber;
        }

        requestAnimationFrame(animate);
        return nextNumber;
      });
    };

    const animationId = requestAnimationFrame(animate);

    // 컴포넌트가 언마운트되면 애니메이션을 멈춥니다.
    return () => cancelAnimationFrame(animationId);
  }, [targetNumber]);

  return <div>{Math.floor(number)}</div>;
}

export default NumberAnimation;
