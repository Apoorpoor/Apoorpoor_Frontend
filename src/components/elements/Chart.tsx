import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import '../../styles/components/_Chart.scss';

function Chart(): JSX.Element {
    const theme = {
        background: 'transparent', // 배경 설정
        fontFamily: 'Pretendard, sans-serif', // 원하는 폰트 패밀리로 변경
        fontSize: 15, // 폰트 크기 설정
        fontWeight: 800,
        textColor: '#333333', // 텍스트 색상 설정
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
const priceComma = (price: number): string =>
price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
return (
<div className="chartBackground">
<h2>이번달 상세 지출내역</h2>
<p>식비에 가장 많이 사용하셨어요.</p>
<div style={{ width: '100%', height: '370px' }}>

<ResponsivePie
colors={['#4194F1', '#FFD12E', '#8A2EFF', '#2ED9FF', '#F5F5F5']}
data={[
{
id: '식비',
label: priceComma(8000),
value: 8000,
},
{
id: '쇼핑',
label: priceComma(3000),
value: 3000,
},
{
id: '문화',
label: priceComma(1500),
value: 1500,
},
{
id: '건강',
label: priceComma(3000),
value: 3000,
},
{
id: '기타',
label: priceComma(500),
value: 500,
},
]}
theme={theme}
margin={{ top: 0, right: 80, bottom: 0, left: 80 }}
padAngle={0.7}
cornerRadius={3}
activeOuterRadiusOffset={12}
borderWidth={1}
borderColor={{
from: 'color',
modifiers: [['darker', 0.2]],
}}
arcLinkLabel={(e) => `${e.id} (${e.label})`}
// enableArcLinkLabels={false}
arcLinkLabelsSkipAngle={10}
arcLinkLabelsTextColor={{ from: 'color', modifiers: [] }}
arcLinkLabelsDiagonalLength={0}
arcLinkLabelsStraightLength={10}
arcLinkLabelsThickness={0}
arcLinkLabelsColor={{ from: 'color' }}
enableArcLabels={false}
/>
</div>
<div className="chartData">
<p>
식비 <span className="chartPer">40%</span>
</p>
<p className="chartPrice">8,000원</p>
</div>
</div>
);
}

export default Chart;
