import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ResponsiveRadar } from '@nivo/radar';
import { useQuery } from 'react-query';
import getMyConsumePropensity from '../../api/charts/MyconsumePropensitychart';
import '../../styles/pages/_Error.scss';
import radarDefaultImg from '../../static/image/ui/radarChart_default.png';
import { Error, Loading } from '../../pages';
import containerPositionState from '../../shared/ScrollContainer';

function MyConsumePropensitychart() {
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

  const { isLoading, error, data } = useQuery(
    'getMyConsumePropensity',
    getMyConsumePropensity
  );

  // 스크롤 이벤트
  const scrollPosition = useRecoilValue(containerPositionState);
  const [radarChartSection, setRadarChartSection] = useState(false);

  useEffect(() => {
    if (scrollPosition > 180) {
      setRadarChartSection(true);
    }
  }, [scrollPosition]);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  const newIndex = (expenditureType: string) => {
    switch (expenditureType) {
      case 'UTILITY_BILL':
        return '월세/관리비/공과금';
      case 'CONDOLENCE_EXPENSE':
        return '경조사비';
      case 'TRANSPORTATION':
        return '교통비';
      case 'COMMUNICATION_EXPENSES':
        return '통신비';
      case 'INSURANCE':
        return '보험';
      case 'EDUCATION':
        return '교육';
      case 'SAVINGS':
        return '저축';
      case 'CULTURE':
        return '문화';
      case 'HEALTH':
        return '건강';
      case 'FOOD_EXPENSES':
        return '식비';
      case 'SHOPPING':
        return '쇼핑';
      case 'LEISURE_ACTIVITIES':
        return '여가활동';
      case 'OTHER':
        return '기타';
      default:
        return expenditureType;
    }
  };

  const consumeKeyword = (expenditureType: string) => {
    switch (expenditureType) {
      case 'UTILITY_BILL':
        return '집순이';
      case 'CONDOLENCE_EXPENSE':
        return '프로참석러';
      case 'TRANSPORTATION':
        return '동에번쩍 서에번쩍';
      case 'COMMUNICATION_EXPENSES':
        return '데이터 만수르';
      case 'INSURANCE':
        return '이달의 보험왕';
      case 'EDUCATION':
        return '지식왕';
      case 'SAVINGS':
        return '절약이 곧 재테크';
      case 'CULTURE':
        return '교~호~양';
      case 'HEALTH':
        return '건강 지킴이';
      case 'FOOD_EXPENSES':
        return '위대한 미식가';
      case 'SHOPPING':
        return '쇼핑 마니아';
      case 'LEISURE_ACTIVITIES':
        return '취미 수집가';
      case 'OTHER':
        return '기타';
      default:
        return expenditureType; // 기본적으로는 원래의 expenditureType 값을 반환합니다.
    }
  };
  if (data === undefined || data.length === 0) {
    return (
      <div className="dataNone">
        <p>가계부를 작성하고 소비성향을 확인해보세요!</p>
        <img
          src={radarDefaultImg}
          alt="기본그래프"
          style={{ width: '90%', marginTop: '60px' }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        width: radarChartSection === true ? '100%' : '70%',
        height: '450px',
        margin: '0 auto',
      }}
    >
      <ul className="consumeStyle">
        {data.map((d) => (
          <li key={d.expenditureType}>
            #{consumeKeyword(String(d.expenditureType))}
          </li>
        ))}
      </ul>
      <ResponsiveRadar
        data={data}
        keys={['total_sum']}
        indexBy={(d) => newIndex(d.expenditureType)}
        valueFormat=">-.2f"
        margin={{ top: 0, right: 80, bottom: 40, left: 80 }}
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
    </div>
  );
}

export default MyConsumePropensitychart;
