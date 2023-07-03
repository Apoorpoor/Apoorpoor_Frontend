import React, { useState } from 'react';
import Select from 'react-select';
import '../../styles/components/_Chart.scss';
import { useParams } from 'react-router';
import { UseQueryResult, useQuery } from 'react-query';
import accounts from '../../api/accounts';
import barChartImg from '../../static/image/account/barChart.png';

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

function ChartLastMonth({ currentMonth }: ChartLastMonthProps): JSX.Element {
  // 현재 가계부의 id 조회
  const { id } = useParams<{ id?: string }>();

  const compareOptions: { value: string; label: string }[] = [
    { value: 'month', label: '지난달' },
    { value: 'year', label: '작년 동월' },
    { value: 'quarter', label: '작년 동분기' },
  ];

  const [selectCpValue, setSelectCpValue] = useState('');

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
  const { data, refetch }: UseQueryResult<BarChartData[]> = useQuery(
    ['getDifference', id, currentMonth, dateType],
    () => accounts.getDifference(id as string, currentMonth, dateType)
  );

  const getCategoryLabel = (month: string | null): string => {
    if (month === null) {
      return ''; // month가 null인 경우 빈 문자열 반환
    }

    if (dateType === '&dateType=year') {
      const monthValue = month.slice(-2);
      const formattedMonth =
        monthValue.charAt(0) === '0' ? monthValue.slice(1) : monthValue;
      return `${formattedMonth}월`;
    }
    if (dateType === '&dateType=quarter') {
      const quarter = parseInt(month.slice(-2), 10);
      if (quarter >= 1 && quarter <= 3) {
        return '1분기';
      }
      if (quarter >= 4 && quarter <= 6) {
        return '2분기';
      }
      if (quarter >= 7 && quarter <= 9) {
        return '3분기';
      }
      if (quarter >= 10 && quarter <= 12) {
        return '4분기';
      }
    }
    if (dateType === '&dateType=month') {
      const monthValue = month.slice(-2);
      const formattedMonth =
        monthValue.charAt(0) === '0' ? monthValue.slice(1) : monthValue;
      return `${formattedMonth}월`;
    }
    return ''; // 기타 경우에는 빈 문자열 반환
  };

  const category1 =
    data && data.length > 1 ? getCategoryLabel(data[1]?.month) : '';
  const value1 = data && data.length > 1 ? data[1]?.month_sum : 0;
  const color1 = '#FFD12E';

  const category2 =
    data && data.length > 0 ? getCategoryLabel(data[0]?.month) : '';
  const value2 = data && data.length > 0 ? data[0].month_sum : 0;
  const color2 = '#4194F1';

  const dataChange = [
    {
      category: category1,
      value: value1,
      color: color1,
    },
    {
      category: category2,
      value: value2,
      color: color2,
    },
  ];

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
  let lastMonth = '';

  if (data && data[1] && data[1].month) {
    lastMonth = data[1].month;
  } else if (data && data[0] && data[0].month) {
    const previousMonth = new Date(data[0].month);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    lastMonth = previousMonth.toISOString().slice(0, 7);
  }

  if (lastMonth) {
    monthDataRange =
      lastMonth.slice(-2).charAt(0) === '0'
        ? lastMonth.slice(-1)
        : lastMonth.slice(-2);
  }

  const formattedDataRange =
    monthDataRange && monthDataRange.charAt(0) === '0'
      ? monthDataRange.slice(1)
      : monthDataRange;

  // 작년 동월 데이터
  let yearDataRange = null;
  let lastYear = '';

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

  // 막대 그래프
  const width = 252;
  const height = 175;
  const margin = 20;
  const minBarHeight = 50;

  const maxDataValue = Math.max(...dataChange.map((item) => item.value));
  const barCount = dataChange.length;
  const barWidth = (width - (barCount - 1) * 15 - margin * 2) / barCount;
  const borderRadius = 12;

  const calculateBarHeight = (value: number) => {
    if (maxDataValue === 0 || Number.isNaN(maxDataValue)) {
      return minBarHeight;
    }

    const calculatedHeight =
      (value / maxDataValue) * (height - minBarHeight) + minBarHeight;
    return Math.max(calculatedHeight, minBarHeight);
  };

  const formatNumber = (value: number) => {
    if (value === null) {
      return '0원'; // 또는 원하는 처리 방식에 따라 적절한 값을 반환
    }
    if (value >= 100000) {
      const stringValue = value.toString();
      const firstTwoDigits = stringValue.substring(0, 2);
      return `${firstTwoDigits}만원`;
    }
    if (value >= 10000 && value < 100000) {
      const stringValue = value.toString();
      const firstDigit = stringValue[0];
      const secondDigit = stringValue[1];
      if (secondDigit === '0') {
        return `${firstDigit}만원`;
      }
      return `${firstDigit}만${secondDigit}천원`;
    }
    if (value >= 1000 && value < 10000) {
      const firstDigit = Math.floor(value / 1000);
      return `${firstDigit}천원`;
    }
    return `${value.toLocaleString()}원`;
  };

  return (
    <div className="chartBackground">
      <div className="chartHeader">
        <div className="chartHeaderTitle">
          <Select
            aria-label="compareSelect"
            defaultValue={compareOptions[0]}
            options={compareOptions}
            onChange={(e: any) => {
              setSelectCpValue(e.value);
              refetch();
            }}
            styles={cpSelectCustom}
          />{' '}
          <h2>대비 지출내역</h2>
        </div>
        <p>
          {data && data[0].month === null && data[1].month === null ? (
            '가계부를 작성하고 지출을 확인해보세요!'
          ) : (
            <>
              {dateTypeText}보다{' '}
              {difference !== null && (
                <span>
                  {difference < 0
                    ? `${Math.abs(difference).toLocaleString()}원 덜 쓰셨네요.`
                    : `${difference.toLocaleString()}원 더 쓰셨네요.`}
                </span>
              )}
            </>
          )}
        </p>
      </div>

      <div className="barChart">
        {data && data[0].month === null && data[1].month === null ? (
          <img src={barChartImg} alt="barChartImg" style={{ width: '320px' }} />
        ) : (
          <svg width={width} height={height}>
            {dataChange.map((item, index) => {
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
                  <rect
                    x={x}
                    y={y - barHeight}
                    width={barWidth}
                    height={barHeight}
                    fill="#FFFFFF"
                  />
                  <path d={pathData} fill={item.color} />
                  <text
                    x={x + barWidth / 2}
                    y={y - 10}
                    textAnchor="middle"
                    fill="#000"
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
                    fontWeight={700}
                  >
                    {item.category}
                  </text>
                </g>
              );
            })}
            <line
              x1={0}
              y1={height}
              x2={252}
              y2={height - 1}
              stroke="#DFDFDF"
              strokeWidth={1}
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default ChartLastMonth;
