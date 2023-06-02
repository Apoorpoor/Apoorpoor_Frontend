import React from 'react';
import { ResponsiveLine } from '@nivo/line';

// state로 data 받기
// 리액트 쿼리

function nivoLine() {
  const theme = {
    background: 'transparent', // 배경 설정
    fontFamily: 'Pretendard, sans-serif', // 원하는 폰트 패밀리로 변경
    fontSize: 14, // 폰트 크기 설정
    fontWeight: 900,
    textColor: '#949494', // 텍스트 색상 설정
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

  const data = [
    {
      id: 'monthlyConsume',
      data: [
        { x: '1월', y: 100 },
        { x: '2월', y: 200 },
        { x: '3월', y: 300 },
        { x: '4월', y: 200 },
        { x: '5월', y: 400 },
        { x: '6월', y: 500 },
      ],
    },
  ];
  
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 20, bottom: 50, left: 50 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: Math.min(...data[0].data.map((d) => d.y)) - 100,
        max: Math.max(...data[0].data.map((d) => d.y)) + 100,
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      theme={theme}
      colors={['#4194F1']}
      enableGridX={false}
      pointSize={18}
      pointColor="#4194F1"
      pointBorderWidth={7}
      pointBorderColor="#E9F2FC"
      pointLabelYOffset={-12}
      useMesh={false}
      legends={[]}
    />
  );
}

export default nivoLine;
