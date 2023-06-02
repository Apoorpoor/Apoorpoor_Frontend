import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';

const data = [
  {
    "category": '교통',
    "value": 30,
  },
  {
    "category": '문화',
    "value": 35,
  },
  {
    "category": '식비',
    "value": 50,
  },
  {
    "category": '여가활동',
    "value": 30,
  },
  {
    "category": '쇼핑',
    "value": 40,
  },
  {
    "category": '건강',
    "value": 15,
  },
];

function nivoRadar() {
  const theme = {
    background: 'transparent', // 배경 설정
    fontFamily: 'Pretendard, sans-serif', // 원하는 폰트 패밀리로 변경
    fontSize: 13, // 폰트 크기 설정
    fontWeight: 900,
    textColor: '#111111', // 텍스트 색상 설정
    outlineWidth: 2,
    outlineColor: '#000000',
    axis: {
      legend: {
        text: {
          fontSize: 14, // 축 범례 폰트 크기 설정
        },
      },
    },
    legends: {
      text: {
        fontSize: 12, // 범례 폰트 크기 설정
      },
    },
    tooltip: {
      container: {
        fontSize: '13px', // 툴팁 폰트 크기 설정
      },
    },
  };
  return (
    <ResponsiveRadar
      data={data}
      keys={['value']}
      indexBy="category"
      valueFormat=">-.2f"
      margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
      borderColor={{ from: 'color' }}
      gridShape="linear"
      gridLabelOffset={36}
      dotSize={10}
      dotColor="#4194f1"
      dotBorderWidth={2}
      colors="#4194f1"
      blendMode="multiply"
      motionConfig="wobbly"
      theme={theme}
    />
  );
}

export default nivoRadar;
