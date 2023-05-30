import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import '../../styles/components/_Chart.scss';

function ChartLastMonth(): JSX.Element {
  // const theme = {
  //   ticks: {
  //     text: {
  //       fontSize: 14,
  //     },
  //   },
  // };

  type BarDatum = {
    month: string;
    last?: number;
    this?: number;
    lastColor: string;
    thisColor: string;
  };

  const data: BarDatum[] = [
    {
      month: '4월',
      last: 20000,
      lastColor: '#FFF3C7',
      thisColor: '#4194F1',
    },
    {
      month: '5월',
      this: 70000,
      lastColor: '#FFF3C7',
      thisColor: '#4194F1',
    },
  ];
  return (
    <div className="chartBackground">
      <div className="chartHeader">
        <h2>지난달 대비 지출내역</h2>
        <p>4월보다 5만원 더 쓰셨네요.</p>
      </div>
      <div className="chartBarPrice">
        <p>2만원</p>
        <p>7만원</p>
      </div>
      <div className="barChart">
        <ResponsiveBar
          data={data}
          keys={['last', 'this']}
          indexBy="month"
          margin={{ top: 5, right: 65, bottom: 20, left: 65 }}
          padding={0.1}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={['#FFF3C7', '#4194F1']}
          borderRadius={8}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={null}
          enableGridY={false}
          enableLabel={false}
          legends={[]}
          isInteractive={false}
          animate={false}
          role="application"
          ariaLabel="Nivo bar chart demo"
          // theme={theme}
        />
      </div>
    </div>
  );
}

export default ChartLastMonth;
