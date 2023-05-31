import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { VscCircleFilled } from 'react-icons/vsc';
import '../../styles/components/_Chart.scss';

function Chart(): JSX.Element {
  const priceComma = (price: number): string =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const data = [
    {
      id: '식비',
      label: priceComma(8000),
      value: 8000,
      color: '#4194F1',
    },
    {
      id: '쇼핑',
      label: priceComma(3000),
      value: 3000,
      color: '#FFD12E',
    },
    {
      id: '건강',
      label: priceComma(3000),
      value: 3000,
      color: '#8A2EFF',
    },
    {
      id: '문화',
      label: priceComma(1500),
      value: 1500,
      color: '#2ED9FF',
    },

    {
      id: '기타',
      label: priceComma(500),
      value: 500,
    },
  ];

  return (
    <div className="chartBackground">
      <div className="chartHeader">
        <h2>이번달 상세 지출내역</h2>
        <p>식비에 가장 많이 사용하셨어요.</p>
      </div>
      <div className="pieChart">
        <ResponsivePie
          colors={['#4194F1', '#FFD12E', '#8A2EFF', '#2ED9FF', '#F5F5F5']}
          data={data}
          margin={{ top: 60, right: 50, bottom: 0, left: 50 }}
          innerRadius={0.55}
          activeOuterRadiusOffset={12}
          isInteractive={false}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.2]],
          }}
          enableArcLinkLabels={false}
          enableArcLabels={false}
        />
      </div>
      <div className="innerChart">
        <p className="innerChartTitle">식비</p>
        <p className="innerChartPer">
          {Math.floor((8 / (8 + 3 + 3 + 1.5 + 0.5)) * 100)}%
        </p>
      </div>

      <div className="chartData">
        <div className="chartDataContents">
          <VscCircleFilled style={{ color: '#4194F1' }} />
          <p className="chartTitle">
            식비{' '}
            <span className="chartPer">
              {Math.floor((8 / (8 + 3 + 3 + 1.5 + 0.5)) * 100)}%
            </span>
          </p>
        </div>
        <p className="chartPrice">8,000원</p>
      </div>

      <div className="chartData">
        <div className="chartDataContents">
          <VscCircleFilled style={{ color: '#FFD12E' }} />
          <p className="chartTitle">
            쇼핑{' '}
            <span className="chartPer">
              {Math.floor((3 / (8 + 3 + 3 + 1.5 + 0.5)) * 100)}%
            </span>
          </p>
        </div>
        <p className="chartPrice">3,000원</p>
      </div>

      <div className="chartData">
        <div className="chartDataContents">
          <VscCircleFilled style={{ color: '#8A2EFF' }} />
          <p className="chartTitle">
            문화{' '}
            <span className="chartPer">
              {Math.floor((3 / (8 + 3 + 3 + 1.5 + 0.5)) * 100)}%
            </span>
          </p>
        </div>
        <p className="chartPrice">3,000원</p>
      </div>

      <div className="chartData">
        <div className="chartDataContents">
          <VscCircleFilled style={{ color: '#2ED9FF' }} />
          <p className="chartTitle">
            건강{' '}
            <span className="chartPer">
              {Math.floor((1.5 / (8 + 3 + 3 + 1.5 + 0.5)) * 100)}%
            </span>
          </p>
        </div>
        <p className="chartPrice">1,500원</p>
      </div>

      <div className="chartData">
        <div className="chartDataContents">
          <VscCircleFilled style={{ color: '#F5F5F5' }} />
          <p className="chartTitle">
            기타{' '}
            <span className="chartPer">
              {Math.floor((0.5 / (8 + 3 + 3 + 1.5 + 0.5)) * 100)}%
            </span>
          </p>
        </div>
        <p className="chartPrice">500원</p>
      </div>
    </div>
  );
}

export default Chart;
