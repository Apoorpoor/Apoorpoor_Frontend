import React, { useEffect, useState } from 'react';
import '../../styles/components/_NumberAnimation.scss';

interface NumberAnimationProps {
  targetNumber: number;
}

function NumberAnimation({ targetNumber }: NumberAnimationProps): JSX.Element {
  const targetNumberOnly = Number(targetNumber.toString().replace('-', ''));
  const [animatedDigits, setAnimatedDigits] = useState<number[]>([]);

  useEffect(() => {
    const animationDuration = 1000; // 애니메이션 지속 시간 (1초)
    const intervalDelay = 50; // 애니메이션 갱신 간격 (0.08초)

    // 랜덤 배열 생성
    const generateRandomDigits = (num: number): number[] => {
      const digits = Array.from(String(num), Number);
      const digitsLength = digits.length;
      const randomDigits: number[] = [];

      for (let i = 0; i < digitsLength; i += 1) {
        const randomDigit = Math.floor(Math.random() * 10);
        randomDigits.push(randomDigit);
      }

      return randomDigits;
    };

    // 숫자 변화 애니메이션
    let currentFrame = 0;
    let animationTimeout: NodeJS.Timeout | null = null;

    const animateNumberAnimation = () => {
      const randomDigits = generateRandomDigits(targetNumberOnly);
      setAnimatedDigits(randomDigits);

      if (currentFrame < animationDuration / intervalDelay) {
        currentFrame += 1;
        animationTimeout = setTimeout(animateNumberAnimation, intervalDelay);
      } else {
        const finalDigits = Array.from(String(targetNumberOnly), Number);
        setAnimatedDigits(finalDigits);
        animationTimeout = null;
      }
    };

    animateNumberAnimation();

    return () => {
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
    };
  }, [targetNumberOnly]);

  const arrayDigits = Array.from(animatedDigits);

  // 배열의 고유 key
  let key = 0;

  return (
    <span id="numberAnimation">
      {targetNumber < 0 ? '-' : ''}
      {arrayDigits.map((item, index) => {
        const uniqueKey = `${(key += 1)}`;
        const comma =
          index > 0 &&
          (arrayDigits.length - index) % 3 === 0 &&
          index !== arrayDigits.length - 1
            ? ','
            : '';
        const formattedItem = `${comma}${item}`;
        return (
          <React.Fragment key={uniqueKey}>
            <span className="number">{formattedItem}</span>
          </React.Fragment>
        );
      })}
    </span>
  );
}

export default NumberAnimation;
