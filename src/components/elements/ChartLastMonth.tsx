import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import Select from 'react-select';
import '../../styles/components/_Chart.scss';
import { useParams } from 'react-router';
import { UseQueryResult, useQuery } from 'react-query';
import accounts from '../../api/accounts';

// Account.tsx에서 받아온 props
interface ChartLastMonthProps {
  currentMonth: string;
}

// Bar data
interface BarChartData {
  month: string;
  expenditureType: string;
  month_sum: number;
}

// BarDatum 타입
type BarDatum = {
  month: string;
  last?: number | undefined;
  this?: number | undefined;
  lastColor: string;
  thisColor: string;
};

function ChartLastMonth({ currentMonth }: ChartLastMonthProps): JSX.Element {
  // 현재 가계부의 id 조회
  const { id } = useParams<{ id?: string }>();

  const compareOptions: { value: string; label: string }[] = [
    { value: 'month', label: '지난달' },
    { value: 'year', label: '작년 동월' },
    { value: 'quarter', label: '작년 동분기' },
  ];

  const [selectCpValue, setSelectCpValue] = useState('');
  // console.log('선택:', selectCpValue);

  // 쿼리스트링
  let dateType = '&dateType=month';

  switch (selectCpValue) {
    case 'year':
      dateType = '&dateType=year';
      break;
    case 'quarter':
      dateType = '&dateType=quarter';
      break;
    default:
      break;
  }

  // 차트그래프 데이터
  const { data }: UseQueryResult<BarChartData[]> = useQuery(
    ['getDifference', id, currentMonth, dateType],
    () => accounts.getDifference(id as string, currentMonth, dateType)
  );
  // console.log('막대 데이터::', data);

  // 데이터 변환 함수
  const transformData = (chartData: BarChartData[] | undefined): BarDatum[] => {
    if (!chartData) {
      return [];
    }

    return chartData.map((item) => ({
      month: item.month,
      last: item.month_sum,
      lastColor: '#FFF3C7',
      thisColor: '#4194F1',
    }));
  };

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
  const comparisonData: BarDatum[] = data ? transformData(data) : [];

  // 서로 다른 두 데이터를 뺀 값
  const calculateDifference = () => {
    if (data && data.length >= 2) {
      const sum1 = data[0].month_sum;
      const sum2 = data[1].month_sum;
      return sum1 - sum2;
    }
    return null;
  };

  // 결과 출력
  const difference = calculateDifference();

  // 이전달 데이터
  let monthDataRange = null;
  let lastMonth = null;

  if (data && data[1]) {
    lastMonth = data[1].month;
  }

  if (lastMonth) {
    monthDataRange = lastMonth.slice(-2);
    monthDataRange =
      monthDataRange.charAt(0) === '0'
        ? monthDataRange.slice(1)
        : monthDataRange;
  }

  const formattedDataRange =
    monthDataRange && monthDataRange.charAt(0) === '0'
      ? monthDataRange.slice(1)
      : monthDataRange;

  // 작년 동월 데이터
  let yearDataRange = null;
  let lastYear = null;

  if (data && data[0]) {
    lastYear = data[0].month;
  }

  if (lastYear) {
    yearDataRange = lastYear.slice(-2);
    yearDataRange =
      yearDataRange.charAt(0) === '0' ? yearDataRange.slice(1) : yearDataRange;
  }

  const formattedYearDataRange =
    yearDataRange && yearDataRange.charAt(0) === '0'
      ? yearDataRange.slice(1)
      : yearDataRange;

  // 비교 데이터 기간 출력
  let dateTypeText = '';

  switch (dateType) {
    case '&dateType=month':
      dateTypeText = `${formattedDataRange}월`;
      break;
    case '&dateType=year':
      dateTypeText = `작년 ${formattedYearDataRange}월`;
      break;
    case '&dateType=quarter':
      dateTypeText = '작년 동분기';
      break;
    default:
      dateTypeText = '';
  }

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
        <p>
          {dateTypeText}보다{' '}
          {difference !== null && (
            <span>
              {difference < 0
                ? `${Math.abs(difference).toLocaleString()}원 덜 쓰셨네요.`
                : `${difference.toLocaleString()}원 더 쓰셨네요.`}
            </span>
          )}
        </p>
      </div>
      <div className="chartBarPrice">
        <p>
          {data && data[0] && data[0].month_sum
            ? `${data[0].month_sum.toLocaleString()}원`
            : ''}
        </p>
        <p>
          {data && data[1] && data[1].month_sum
            ? `${data[1].month_sum.toLocaleString()}원`
            : ''}
        </p>
      </div>
      <div className="barChart">
        <ResponsiveBar
          data={comparisonData}
          keys={['last', 'this']}
          indexBy="month"
          margin={{ top: 5, right: 65, bottom: 20, left: 65 }}
          padding={0.1}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          borderRadius={8}
          colors={({ index }) => (index === 0 ? '#4194F1' : '#FFF3C7')}
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
