import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useQuery } from 'react-query';
import getRecentMyConsume from '../../api/charts/RecentMyConsumechart';

function RecentMyConsumechart() {
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

  const { isLoading, error, data } = useQuery(
    'getRecentMyConsume',
    getRecentMyConsume
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  if (data === undefined) {
    return <div>데이터가 충분히 모이지 않았습니다 ㅜㅠ</div>;
  }

  return (
    <ResponsiveLine
      data={[
        {
          id: 'line',
          data: data.map(({ month, month_sum } : {month : string, month_sum: number}) => ({
            x: month,
            y: month_sum,
          })),
        },
      ]}
      margin={{ top: 50, right: 20, bottom: 50, left: 50 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
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

export default RecentMyConsumechart;
