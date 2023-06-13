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
  const margin = 20; // 추가된 부분

  const maxDataValue = Math.max(...data.map((item) => item.value));
  const barCount = data.length;
  const barWidth = (width - (barCount - 1) * 15 - margin * 2) / barCount; // 변경된 부분
  const borderRadius = 12;

  // 숫자 형식화 함수
  const formatNumber = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만원`;
    }
    return value.toString();
  };

  return (
    <svg width={width} height={height}>
      {data.map((item, index) => {
        const x = index * (barWidth + 15) + margin; // 변경된 부분
        const y = height - (item.value / maxDataValue) * height + 25;
        const barHeight = (item.value / maxDataValue) * height;
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
