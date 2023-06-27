import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/pages/_Social.scss';
import { useNavigate } from 'react-router';
import { UseQueryResult, useQuery } from 'react-query';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import ChartSocialEx from '../../components/elements/ChartSocialEx';
import bundle from '../../static/image/social/ranking1.png';
import flex from '../../static/image/social/ranking2.png';
import noneData from '../../static/image/social/noneData.png';
import social from '../../api/social';
import Loading from '../status/Loading';
import Error from '../status/Error';
import { Tooltip } from '../../components';

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
    }
    if (accountType === 'EXPENDITURE') {
      if (data?.expenditure === 0) setRankData(false);
    }
    if (accountType === 'INCOME') {
      if (data?.income === 0) setRankData(false);
    }
  }, [data, accountType]);

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
    if (data && data?.percent <= 50) {
      percentage = `상위${100 - data.percent}%`;
    }
    if (data && data?.percent > 50) {
      percentage = `하위${100 - data.percent}%`;
    }
  } else if (accountType === 'INCOME') {
    if (data && data?.percent <= 50) {
      percentage = `상위${100 - data.percent}%`;
    }
    if (data && data?.percent > 50) {
      percentage = `하위${100 - data.percent}%`;
    }
  }

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    if (
      (error as AxiosError).response &&
      (error as AxiosError).response?.status === 403
    ) {
      localStorage.removeItem('AToken');
      localStorage.removeItem('userId');
      Cookies.remove('RToken');
      alert('로그인 시간이 만료 되었어요!');
      navigate('/login');
    }
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
              <p className="titleSecond">{percentage}</p>
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
            <div className="imgWarning">
              <Tooltip>
                <h3>절약 푸어란?</h3>
                <ul>
                  <p>
                    지난 달 가장 많이 절약을 한 푸어를 1위 ~ 10위 까지 보여줘요.
                  </p>
                </ul>
              </Tooltip>
            </div>
            <div className="imgBox">
              <img src={bundle} alt="bundle" className="imgBundle" />
            </div>
            <p>절약 푸어</p>
            <button
              className="imgButton"
              type="button"
              onClick={() => navigate('/social/reduction')}
            >
              랭킹 보기
            </button>
          </div>

          <div className="socialRanking">
            <div className="imgWarning">
              <Tooltip>
                <h3>플렉스 푸어란?</h3>
                <ul>
                  <p>
                    지난 달 가장 많은 소비를 한 푸어를 1위 ~ 10위 까지 보여줘요.
                  </p>
                </ul>
              </Tooltip>
            </div>
            <div className="imgBox">
              <img src={flex} alt="flex" className="imgFlex" />
            </div>
            <p>플렉스 푸어</p>
            <button
              className="imgButton"
              type="button"
              onClick={() => navigate('/social/flex')}
            >
              랭킹 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Social;
