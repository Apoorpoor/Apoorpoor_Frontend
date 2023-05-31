import React from 'react';
// import { ResponsiveRadar } from '@nivo/radar';
import { ResponsiveLine } from '@nivo/line';
import '../../styles/pages/_PoorRoom.scss';
import { Controller, Header, ProgressBar } from '../../components';

function PoorRoom() {
  // const RadarData = {
  //   data: [
  //     {
  //       category: '식비',
  //       value: 5000,
  //     },
  //     {
  //       category: '교통비',
  //       value: 2500,
  //     },
  //     {
  //       category: '건강',
  //       value: 2000,
  //     },
  //     {
  //       category: '미용',
  //       value: 4000,
  //     },
  //     {
  //       category: '공과금',
  //       value: 3000,
  //     },
  //     {
  //       category: '문화',
  //       value: 4000,
  //     },
  //   ],
  // };

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

  const recentSixMonthData = [
    {
      id: 'monthlyConsume',
      data: [
        { x: '1월', y: 1000 },
        { x: '2월', y: 2000 },
        { x: '3월', y: 3000 },
        { x: '4월', y: 2000 },
        { x: '5월', y: 4000 },
        { x: '6월', y: 5000 },
      ],
    },
  ];

  return (
    <main id="myPoorRoom">
      <Header>My</Header>
      <article>
        <section id="myPoorInfo">
          <h2>푸어 닉네임</h2>
          <h2>푸어 레벨 </h2>
        </section>
        <section id="myPoorCharacter">
          <div className="poor">푸어 캐릭터</div>
          <div className="poorItemStorage">
            <ul>
              <li>모자</li>
              <li>장갑</li>
            </ul>
          </div>
        </section>
        <section id="myConsumePropensity">
          <ul className="consumeStyle">
            <li>#Flex</li>
            <li>#문화생활</li>
            <li>#뚜벅이</li>
          </ul>
          <div style={{ width: '100%', height: '370px' }}>
            {/* <ResponsiveRadar
              data={RadarData.data}
              margin={{ top: 50, right: 20, bottom: 50, left: 50 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: Math.min(...RadarData.data.map((d) => d.value)) - 500,
                max: Math.max(...data.map((d) => d.value)) + 500,
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
            /> */}
          </div>
        </section>
        <section id="consumeBadgeArea" style={{ display: 'none' }}>
          <ul>
            <li>뱃지</li>
          </ul>
        </section>
        <section id="myConsumeRecentGraph">
          <h2>최근 6개월 소비근황</h2>
          <p>단위 : 만원</p>
          <div style={{ width: '100%', height: '370px' }}>
            <ResponsiveLine
              data={recentSixMonthData}
              margin={{ top: 50, right: 20, bottom: 50, left: 50 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min:
                  Math.min(...recentSixMonthData[0].data.map((d) => d.y)) - 500,
                max:
                  Math.max(...recentSixMonthData[0].data.map((d) => d.y)) + 500,
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
          </div>
        </section>
        <section id="myPointBreakdown">
          <h2>만수르님의 푸어포인트</h2>
          <ProgressBar />
          <ul>
            <li>1주일</li>
            <li>1개월</li>
            <li>3개월</li>
            <li>6개월</li>
            <li>1년</li>
          </ul>
          <div>
            <ul>
              <li>전체</li>
              <li>적립</li>
              <li>사용</li>
            </ul>
            <ul>
              <li>
                <p>
                  포인트 상세 내역 <span>날짜 및 카테고리</span>
                </p>
                <p>
                  +10P <span>적립</span>
                </p>
              </li>
            </ul>
          </div>
        </section>
      </article>
      <Controller />
    </main>
  );
}

export default PoorRoom;
