import React, { useState, useEffect } from 'react';

interface NumberAnimationProps {
  targetNumber: number;
}

function NumberAnimation({ targetNumber }: NumberAnimationProps): JSX.Element {
  // 숫자 증가 애니메이션
  const [displayNumber, setDisplayNumber] = useState(0);
  const duration = 3000;

  useEffect(() => {
    const startTime = performance.now();
    let animationFrame: number;

    const animate = (timestamp: number) => {
      const elapsedTime = timestamp - startTime;
      let progress = elapsedTime / duration;

      if (progress > 1) progress = 1;

      const nextNumber = Math.floor(targetNumber * progress);
      setDisplayNumber(nextNumber);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayNumber(targetNumber);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [targetNumber, duration]);

  return <>{displayNumber.toLocaleString()}</>;
}

export default NumberAnimation;
