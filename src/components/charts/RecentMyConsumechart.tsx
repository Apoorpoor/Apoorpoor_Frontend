import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useQuery } from 'react-query';
import getRecentMyConsume from '../../api/charts/RecentMyConsumechart';
import lineDefaultImg from '../../static/image/ui/lineChart_default.png';
import { Error, Loading } from '../../pages';

type ExpenditureData = {
  month: string;
  expenditure_sum: number;
};

type IncomeData = {
  month: string;
  income_sum: number;
};

type InputData = {
  expenditureSum: ExpenditureData[];
  incomeSum: IncomeData[];
};

// 데이터 변환 함수 추가
function transformData(inputData: InputData) {
  const { expenditureSum, incomeSum } = inputData;

  const expenditureDataSet = {
    id: '지출',
    data: expenditureSum
      .map((item) => ({
        x: `${parseInt(item.month.split('-')[1], 10)}월`,
        y: item.expenditure_sum / 10000,
      }))
      .reverse(),
  };

  const incomeDataSet = {
    id: '수입',
    data: incomeSum
      .map((item) => ({
        x: `${parseInt(item.month.split('-')[1], 10)}월`,
        y: item.income_sum / 10000,
      }))
      .reverse(),
  };

  return [expenditureDataSet, incomeDataSet];
}

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
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  if (
    data === undefined ||
    data.expenditureSum === undefined ||
    data.incomeSum === undefined
  ) {
    return (
      <div className="dataNone">
        <p>가계부를 작성하고 소비근황을 확인해보세요!</p>
        <img
          src={lineDefaultImg}
          alt="기본그래프"
          style={{
            width: '95%',
            margin: '20px 0',
            transform: 'translateX(-10px)',
          }}
        />
      </div>
    );
  }

  const transformedData = transformData(data);

  const yValues = transformedData.flatMap((dataset) =>
    dataset.data.map((value) => value.y)
  );

  console.log('yValues', yValues);
  const minY = Math.min(...yValues) - 100
  const maxY = Math.max(...yValues) + 100;

  return (
    <>
      <p>단위 : 만원</p>
      <ResponsiveLine
        data={transformedData}
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: minY,
          max: maxY,
          stacked: false,
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
        motionConfig="wobbly"
        theme={theme}
        colors={['#4194F1', '#FFD12E']}
        enableGridX={false}
        pointSize={15}
        pointBorderWidth={10}
        pointBorderColor={{
          from: 'color',
          modifiers: [['opacity', 0.3]],
        }}
        pointLabelYOffset={-12}
        isInteractive
        useMesh
        legends={[
          {
            anchor: 'top-right',
            direction: 'row',
            justify: false,
            translateX: -40,
            translateY: -40,
            itemsSpacing: 20,
            itemDirection: 'left-to-right',
            itemWidth: 35,
            itemHeight: 20,
            itemOpacity: 1,
            symbolSize: 15,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </>
  );
}

export default RecentMyConsumechart;
