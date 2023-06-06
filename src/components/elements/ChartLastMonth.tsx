import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import Select from 'react-select';
import '../../styles/components/_Chart.scss';

function ChartLastMonth(): JSX.Element {
  // const theme = {
  //   ticks: {
  //     text: {
  //       fontSize: 14,
  //     },
  //   },
  // };

  const compareOptions: { value: string; label: string }[] = [
    { value: 'lastMonth', label: '지난달' },
    { value: 'sameMonthLastYear', label: '작년 동월' },
    { value: 'sameQuarterLastYear', label: '작년 동분기' },
  ];

  const [selectCpValue, setSelectCpValue] = useState('');
  console.log('선택:', selectCpValue);

  const cpSelectCustom = {
    control: (provided: any) => ({
      ...provided,
      // 'width': '166px',
      'height': '32px',
      'border': 'none',
      'fontSize': '24px',
      'fontWeight': 'bold',
      'textAlign': 'center',
      '&:hover': {
        border: 'none',
      },
      'boxShadow': 'none',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      'backgroundColor': state.isSelected ? '#FFF3C7' : 'ffffff',
      'borderRadius': '5px',
      'color': state.isSelected ? 'black' : 'black',
      'fontSize': '14px',
      'textAlign': 'center',
      '&:hover': { backgroundColor: '#F5F5F5' },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '10px',
      // width: '166px',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      '& svg': {
        width: '20px',
        height: '20px',
      },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  // 비교 데이터
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
        <div className="chartHeaderTitle">
          <Select
            defaultValue={compareOptions[0]}
            options={compareOptions}
            onChange={(e: any) => setSelectCpValue(e.value)}
            styles={cpSelectCustom}
          />{' '}
          <h2>대비 지출내역</h2>
        </div>
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
