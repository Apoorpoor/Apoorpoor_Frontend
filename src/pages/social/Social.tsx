import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/pages/_Social.scss';
import { useNavigate } from 'react-router';
import ChartSocialEx from '../../components/elements/ChartSocialEx';
import bundle from '../../static/image/social/ranking1.png';
import flex from '../../static/image/social/ranking2.png';
import noneData from '../../static/image/social/noneData.png';

function Social() {
  const navigate = useNavigate();

  const data = useMemo(
    () => [
      {
        category: '내 소비',
        value: 800000,
        color: '#326BCF',
      },
      {
        category: '평균',
        value: 600000,
        color: '#3E4F6A',
      },
    ],
    []
  );

  // 데이터 상태에 따른 state 관리
  const [rankData, setRankData] = useState<boolean>(true);

  useEffect(() => {
    if (data && data.length > 0) {
      setRankData(true);
    } else {
      setRankData(false);
    }
  }, [data]);

  return (
    <div className="socialBg">
      <div className="title">
        {rankData && rankData ? (
          <>
            <p className="titleFirst">20대 남자 중 내 소비</p>
            <p className="titleSecond">상위10%</p>
          </>
        ) : (
          <p className="noneDatatitle">
            가계부를 작성하고 <br />내 소비습관 수준을 알아보세요!
          </p>
        )}
      </div>

      {rankData && rankData ? (
        <>
          <ChartSocialEx data={data} />
          <div className="socialController">
            <div className="contr income">소비</div>
            <div className="contrNone expend">저축</div>
          </div>
        </>
      ) : (
        <div className="noneData">
          <img src={noneData} alt="noneData" />
          <button type="button" onClick={() => navigate('/')}>
            가계부 작성하기
          </button>
        </div>
      )}

      <div className="socialRankingBox">
        <h2>랭킹</h2>

        <div className="row">
          <div className="socialRanking">
            <div className="imgBox">
              <img src={bundle} alt="bundle" className="imgBundle" />
            </div>
            <p>절약 푸어</p>
            <button type="button">랭킹 보기</button>
          </div>

          <div className="socialRanking">
            <div className="imgBox">
              <img src={flex} alt="flex" className="imgFlex" />
            </div>
            <p>플렉스 푸어</p>
            <button type="button">랭킹 보기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Social;
