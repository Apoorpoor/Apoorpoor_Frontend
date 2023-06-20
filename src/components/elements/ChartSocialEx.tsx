import React from 'react';
import '../../styles/components/_Chart.scss';
import '../../styles/pages/_Social.scss';

interface ChartSocialExProps {
  data: {
    category: string;
    value: number;
    color: string;
  }[];
}

function ChartSocialEx({ data }: ChartSocialExProps) {
  const width = 175;
  const height = 175;
  const margin = 20;
  const minBarHeight = 50;

  const maxDataValue = Math.max(...data.map((item) => item.value));
  const barCount = data.length;
  const barWidth = (width - (barCount - 1) * 15 - margin * 2) / barCount;
  const borderRadius = 12;

  // 숫자 형식화 함수
  const formatNumber = (value: number) => {
    if (value >= 100000000) {
      const stringValue = value.toString();
      const remainingDigits = stringValue.substring(0, stringValue.length - 8);
      return `${remainingDigits}억원`;
    }
    if (value >= 100000) {
      const stringValue = value.toString();
      const firstTwoDigits = stringValue.substring(0, stringValue.length - 4);
      return `${firstTwoDigits}만원`;
    }
    if (value >= 10000 && value < 100000) {
      const stringValue = value.toString();
      const firstDigit = stringValue[0];
      const secondDigit = stringValue[1];
      return `${firstDigit}만${secondDigit}천원`;
    }
    if (value >= 1000 && value < 10000) {
      const firstDigit = Math.floor(value / 1000);
      return `${firstDigit}천원`;
    }
    return `${value.toLocaleString().split('.')[0]}원`;
  };

  const calculateBarHeight = (value: number) => {
    const calculatedHeight =
      (value / maxDataValue) * (height - minBarHeight) + minBarHeight;
    return Math.max(calculatedHeight, minBarHeight);
  };

  return (
    <svg width={width} height={height}>
      {data.map((item, index) => {
        const x = index * (barWidth + 15) + margin;
        const y = height - calculateBarHeight(item.value) + 25;
        const barHeight = calculateBarHeight(item.value);
        const topRadius = borderRadius;

        const pathData = `
          M ${x + topRadius} ${y}
          h ${barWidth - topRadius * 2}
          a ${topRadius} ${topRadius} 0 0 1 ${topRadius} ${topRadius}
          v ${barHeight - topRadius}
          h -${barWidth}
          v -${barHeight - topRadius}
          a ${topRadius} ${topRadius} 0 0 1 ${topRadius} -${topRadius}
          Z
        `;

        return (
          <g key={item.category}>
            <path d={pathData} fill={item.color} />
            <text
              x={x + barWidth / 2}
              y={y - 10}
              textAnchor="middle"
              fill="#fff"
              fontSize="14"
              fontWeight={700}
            >
              {formatNumber(item.value)}
            </text>
            <text
              x={x + barWidth / 2}
              y={y + 20}
              textAnchor="middle"
              fill="#fff"
              fontSize="14"
            >
              {item.category}
            </text>
          </g>
        );
      })}
      <line
        x1={0}
        y1={height - 1}
        x2={175}
        y2={height - 1}
        stroke="#fff"
        strokeWidth={1}
      />
    </svg>
  );
}

export default ChartSocialEx;
