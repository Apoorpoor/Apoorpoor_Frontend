import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/pages/_Social.scss';
import { useNavigate } from 'react-router';
import { UseQueryResult, useQuery } from 'react-query';
import ChartSocialEx from '../../components/elements/ChartSocialEx';
import bundle from '../../static/image/social/ranking1.png';
import flex from '../../static/image/social/ranking2.png';
import noneData from '../../static/image/social/noneData.png';
import social from '../../api/social';
import Loading from '../status/Loading';
import Error from '../status/Error';

interface ApiDataItem {
  age_abb: number;
  gender: string;
  percent: number;
  expenditure: number;
  expenditure_sum: number;
  expenditure_avg: number;
  income: number;
  income_sum: number;
  income_avg: number;
}

interface SelectType {
  name: string;
  selected: boolean;
}

type AccountType = 'EXPENDITURE' | 'INCOME';

function Social() {
  const navigate = useNavigate();

  // 선택한 카테고리 관리
  const [selected, setSelected] = useState<SelectType[]>([
    { name: '소비', selected: true },
    { name: '수입', selected: false },
  ]);

  const selectedOnClick = (idx: number): void => {
    if (selected[idx].selected) {
      return;
    }
    const updatedSelect = selected.map((el, index) => {
      if (index === idx) {
        return { ...el, selected: !el.selected };
      }
      return { ...el, selected: false };
    });
    setSelected(updatedSelect);
  };

  const [currentSelect] = selected.filter((e) => e.selected === true);

  const accountType: AccountType =
    currentSelect?.name === '소비' ? 'EXPENDITURE' : 'INCOME';

  // 데이터 조회
  const { isLoading, error, data }: UseQueryResult<ApiDataItem> = useQuery(
    ['getAgeAvg', accountType],
    () => social.getAgeAvg(accountType)
  );
  console.log('data 호출:', data);

  const dataChange = useMemo(() => {
    const value =
      accountType === 'EXPENDITURE' ? data?.expenditure : data?.income;
    const valueAvg =
      accountType === 'EXPENDITURE' ? data?.expenditure_avg : data?.income_avg;

    return [
      {
        category: accountType === 'EXPENDITURE' ? '내 소비' : '내 수입',
        value: value !== undefined ? value : 0,
        color: '#326BCF',
      },
      {
        category: '평균',
        value: valueAvg !== undefined ? valueAvg : 0,
        color: '#3E4F6A',
      },
    ];
  }, [data, accountType]);

  // 데이터 상태에 따른 화면 관리
  const [rankData, setRankData] = useState<boolean>(false);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setRankData(true);
    } else {
      setRankData(false);
    }
  }, [data]);

  // 성별 조회
  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'female':
        return '여자';
      case 'male':
        return '남자';
      default:
        return '기타';
    }
  };
  const gender = data?.gender;
  const label = gender ? getGenderLabel(gender) : '기타';

  // 상위 퍼센트 계산
  let percentage = '';

  if (accountType === 'EXPENDITURE') {
    const expenditure = data?.expenditure || 0;
    const expenditureSum = data?.expenditure_sum || 1;
    percentage = `${(100 - (expenditure / expenditureSum) * 100).toFixed(0)}%`;
  } else if (accountType === 'INCOME') {
    const income = data?.income || 0;
    const incomeSum = data?.income_sum || 1;
    percentage = `${(100 - (income / incomeSum) * 100).toFixed(0)}%`;
  }

  console.log(percentage);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <div className="socialBg">
      <div className="socialContentsBox">
        <div className="title">
          {rankData && rankData ? (
            <>
              <p className="titleFirst">
                {data?.age_abb}대 {label} 중 내 &nbsp;
                {currentSelect?.name === '소비' ? '소비' : '수입'}
              </p>
              <p className="titleSecond">상위{percentage}</p>
            </>
          ) : (
            <p className="noneDatatitle">
              가계부를 작성하고 <br />내 소비습관 수준을 알아보세요!
            </p>
          )}
        </div>

        {rankData && rankData ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ChartSocialEx data={dataChange} />
            </div>
            <div className="socialController">
              {selected.map((item, index) => (
                <button
                  type="button"
                  key={item.name}
                  className={item.selected ? 'contr' : 'contrNone'}
                  onClick={() => selectedOnClick(index)}
                >
                  {item.name}
                </button>
              ))}
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
      </div>

      <div className="socialRankingBox">
        <h2>랭킹</h2>

        <div className="row">
          <div className="socialRanking">
            <div className="imgBox">
              <img src={bundle} alt="bundle" className="imgBundle" />
            </div>
            <p>절약 푸어</p>
            <button type="button" onClick={() => navigate('/social/reduction')}>
              랭킹 보기
            </button>
          </div>

          <div className="socialRanking">
            <div className="imgBox">
              <img src={flex} alt="flex" className="imgFlex" />
            </div>
            <p>플렉스 푸어</p>
            <button type="button" onClick={() => navigate('/social/flex')}>
              랭킹 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Social;
