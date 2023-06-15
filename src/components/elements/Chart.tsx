import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { VscCircleFilled } from 'react-icons/vsc';
import '../../styles/components/_Chart.scss';
import { useInfiniteQuery } from 'react-query';
// eslint-disable-next-line
import { Fade } from 'react-awesome-reveal';
import accounts from '../../api/accounts';
import Loading from '../../pages/status/Loading';
import pieChart from '../../static/image/account/pieChart.png';
import pieChartDots from '../../static/image/account/pieChartDots.png';

// Account.tsx에서 받아온 props
interface ChartProps {
  id: string | undefined;
  currentMonth: string;
}

// Pie data
interface Data {
  content: PieChartData[];
  totalPages: number;
  pageable: PageNation;
  last: boolean;
  number: number;
}

interface PageNation {
  pageNumber: number;
}

interface PieChartData {
  month: string;
  expenditureType: string;
  month_sum: number;
}

function Chart({ id, currentMonth }: ChartProps): JSX.Element {
  // 파이그래프 데이터
  const { isLoading, error, data, fetchNextPage, hasNextPage } =
    useInfiniteQuery<Data, Error>(
      ['getMonthPieChart', id, currentMonth],
      ({ pageParam = 0 }) =>
        accounts.getMonthPieChart(id as string, currentMonth, pageParam),
      {
        getNextPageParam: (lastPage) => {
          console.log(lastPage);
          if (lastPage.number + 1 < lastPage.totalPages) {
            return lastPage.number + 1;
          }
          return undefined;
        },
      }
    );

  console.log('파이데이터::', data);

  // 페이지네이션 버튼
  const handleLoadMore = () => {
    fetchNextPage();
  };

  // 지출 카테고리별 차트 색상
  const getChartColor = (expenditureType: string): string => {
    switch (expenditureType) {
      case 'UTILITY_BILL': // 월세/관리비/공과금
        return '#4194F1';
      case 'CONDOLENCE_EXPENSE': // 경조사비
        return '#FFD12E';
      case 'TRANSPORTATION': // 교통비
        return '#8A2EFF';
      case 'COMMUNICATION_EXPENSES': // 통신비
        return '#FB44FF';
      case 'INSURANCE': // 보험
        return '#FFBF44';
      case 'EDUCATION': // 교육
        return '#69FF44';
      case 'SAVINGS': // 저축
        return '#595959';
      case 'CULTURE': // 문화
        return '#2ED9FF';
      case 'HEALTH': // 건강
        return '#00FFD1';
      case 'FOOD_EXPENSES': // 식비
        return '#FF006B';
      case 'SHOPPING': // 쇼핑
        return '#CCC2F2';
      case 'LEISURE_ACTIVITIES': // 여가활동
        return '#E0F252';
      case 'OTHER': // 기타
        return '#F5F5F5';
      default:
        return '#F5F5F5';
    }
  };

  // 지출 카테고리 한글 반환
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

  // data를 차트 포맷에 맞춤
  const pieData = data?.pages.flatMap((page) =>
    page.content.map((item) => ({
      id: item.expenditureType,
      label: item.month_sum,
      value: item.month_sum,
      color: getChartColor(item.expenditureType),
    }))
  );

  // 지출 금액 순 정렬
  const sortedData = pieData?.sort((a, b) => b.value - a.value);

  // 지출 제일 큰 카테고리 (한글)
  const getMaxCategory = (): string => {
    if (sortedData && sortedData.length > 0) {
      const maxCategory: string = sortedData[0].id;
      return newIndex(maxCategory);
    }
    return '';
  };

  // 전체 지출 합계
  const totalExpense = sortedData?.reduce((acc, curr) => acc + curr.value, 0);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <div>잠시 후 다시 시도해주세요!</div>;
  }

  return (
    <div className="chartBackground">
      <div className="chartHeader">
        <h2>이번달 상세 지출내역</h2>
        <p>
          {getMaxCategory()
            ? `${getMaxCategory()}에 가장 많이 사용하셨어요.`
            : '가계부를 작성하고 상세 지출을 확인해보세요!'}
        </p>
      </div>
      <Fade>
        <div className="pieChart">
          {!sortedData || sortedData.length === 0 ? (
            <img
              src={pieChart}
              alt="pieChart"
              style={{ width: '242px', marginTop: '60px' }}
            />
          ) : (
            <ResponsivePie
              colors={sortedData.map((item) => getChartColor(item.id))}
              data={sortedData}
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
          )}
        </div>
      </Fade>

      {!sortedData || sortedData.length === 0 ? (
        <>
          <div className="chartData">
            <div className="chartDataContents">
              <VscCircleFilled style={{ color: '#B7B7B7' }} />
              <p className="chartTitle noData">
                식비
                <span className="chartPer noData">0%</span>
              </p>
            </div>
            <p className="chartPrice noData">0원</p>
          </div>
          <div className="chartData">
            <div className="chartDataContents">
              <VscCircleFilled style={{ color: '#B7B7B7' }} />
              <p className="chartTitle noData">
                쇼핑
                <span className="chartPer noData">0%</span>
              </p>
            </div>
            <p className="chartPrice noData">0원</p>
          </div>
          <div className="chartData">
            <div className="chartDataContents">
              <VscCircleFilled style={{ color: '#B7B7B7' }} />
              <p className="chartTitle noData">
                문화
                <span className="chartPer noData">0%</span>
              </p>
            </div>
            <p className="chartPrice noData">0원</p>
          </div>
          <div className="chartData">
            <div className="chartDataContents">
              <VscCircleFilled style={{ color: '#B7B7B7' }} />
              <p className="chartTitle noData">
                건강
                <span className="chartPer noData">0%</span>
              </p>
            </div>
            <p className="chartPrice noData">0원</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img
              src={pieChartDots}
              alt="pieChartDots"
              style={{ width: '8px' }}
            />
          </div>
        </>
      ) : (
        sortedData.map((item) => {
          const percentage = totalExpense
            ? Math.floor((item.value / totalExpense) * 100)
            : 0;
          return (
            <div className="chartData" key={item.id}>
              <div className="chartDataContents">
                <VscCircleFilled style={{ color: getChartColor(item.id) }} />
                <p className="chartTitle">
                  {newIndex(item.id)}{' '}
                  <span className="chartPer">{percentage}%</span>
                </p>
              </div>
              <p className="chartPrice">{item.value.toLocaleString()}원</p>
            </div>
          );
        })
      )}
      <div className="pagination">
        {hasNextPage && (
          <button
            type="button"
            onClick={handleLoadMore} // 데이터 추가를 처리하는 핸들러 호출
          >
            더보기
          </button>
        )}
      </div>
    </div>
  );
}

export default Chart;
