import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/pages/_Account.scss';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import { BsFillPenFill } from 'react-icons/bs';
import moment, { Moment } from 'moment';
import Select from 'react-select';
import { UseQueryResult, useQuery } from 'react-query';
import { format, subMonths, subWeeks } from 'date-fns';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import accounts from '../../api/accounts';
import { Calendar, Chart, Header } from '../../components';
import ChartLastMonth from '../../components/elements/ChartLastMonth';
import AccountName from '../../components/elements/AccountName';
import AccountMonth from '../../components/elements/AccountMonth';
import NumberAnimation from '../../components/elements/NumberAnimation';
import AccountRangeCal from '../../components/elements/AccountRangeCal';
import {
  accountIdState,
  startDateState,
  endDateState,
} from '../../shared/Atom';
import Loading from '../status/Loading';
import Error from '../status/Error';

// 거래내역 조회
interface Data {
  content: LedgerHistoryResponseDto[];
}

interface LedgerHistoryResponseDto {
  accountType: string;
  date: string;
  expenditure: number | null;
  expenditureType: string | null;
  id: number | null;
  income: number | null;
  incomeType: string;
  paymentMethod: string | null;
  title: string;
}

interface MyAccounts {
  id: number;
  title: string;
  userId?: number;
  ledgerHistoryResponseDtoList?: LedgerHistoryResponseDto[];
  balance: number | null; // 잔액
}

// 월별, 일별 수입/지출 총 금액 조회
interface TotalStatus {
  expenditure_sum: number | null;
  income_sum: number | null;
}

function Account(): JSX.Element {
  // const navigate = useNavigate();

  // 현재 가계부의 id 조회
  const { id } = useParams<{ id?: string }>();

  // 현재 가게부의 id 전역 상태 관리
  const setAccountId = useSetRecoilState(accountIdState);
  useEffect(() => {
    if (id) {
      setAccountId(id);
    }
  }, [id, setAccountId]);

  // 캘린더 날짜 받는 라이브러리
  const [getMoment, setMoment] = useState(moment());
  const today: Moment = getMoment;

  // 현재 조회하고 있는 달
  const currentMonth = today.format('YYYY-MM');

  // 상세내역 조회
  const {
    isLoading,
    error,
    data: getAccount,
    refetch: getAccountRefetch,
  }: UseQueryResult<MyAccounts> = useQuery(['getAccount', id], () =>
    accounts.getAccount(id as string)
  );
  // console.log('data 호출:', getAccount);

  // 월별, 일별 수입/지출 총 금액 조회
  const {
    isLoading: getTotalMonthDateIsLoading,
    error: getTotalMonthDateError,
    data: getTotalMonthDate,
    refetch: getTotalMonthDateRefetch,
  }: UseQueryResult<TotalStatus> = useQuery(
    ['getTotalMonthDate', id, currentMonth],
    () => accounts.getTotalMonthDate(id as string, currentMonth)
  );
  // console.log('총 금액 호출:', getTotalMonthDate);

  // 백에서 받는 수입, 지출, 저축 카테고리 출력
  // 카테고리가 수입일 경우
  const incomeType = (type: string): string => {
    if (type === null) {
      return '';
    }
    switch (type) {
      case 'EMPLOYMENT_INCOME':
        return '근로소득';
      case 'BUSINESS':
        return '사업';
      case 'STOCKS':
        return '주식';
      case 'INVESTMENT':
        return '투자';
      case 'ALLOWANCE':
        return '용돈';
      case 'FIXED_DEPOSIT_MATURITY':
        return '적금 만기';
      default:
        return '기타';
    }
  };

  // 카테고리가 지출일 경우
  const expenditureType = (type: string): string => {
    if (type === null) {
      return '';
    }
    switch (type) {
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
      default:
        return '기타';
    }
  };

  // 하단 사용내역 카테고리 필터링 버튼
  type Term = {
    name: string;
    selected: boolean;
  };

  const [term, setTerm] = useState<Term[]>([
    { name: '1주일', selected: false },
    { name: '1개월', selected: false },
    { name: '3개월', selected: false },
    { name: '기간 선택', selected: false },
  ]);

  const categoryOnclick = (idx: number): void => {
    const updatedTerm = term.map((el, index) => {
      if (index === idx) {
        return { ...el, selected: !el.selected };
      }
      return { ...el, selected: false };
    });
    setTerm(updatedTerm);
  };

  const [currentTerm] = term.filter((e) => e.selected === true);
  console.log('현재선택:', currentTerm?.name);

  // 하단 사용내역 카테고리 셀렉트 박스
  const [selectedInExFilter, setSelectedInExFilter] = useState('전체');

  const handleInExFilter = (filter: string) => {
    setSelectedInExFilter(filter);
  };

  // 수입 셀렉트 박스
  const inOptions: { value: string; label: string }[] = [
    { value: 'EMPLOYMENT_INCOME', label: '근로소득' },
    { value: 'BUSINESS', label: '사업' },
    { value: 'STOCKS', label: '주식' },
    { value: 'INVESTMENT', label: '투자' },
    { value: 'ALLOWANCE', label: '용돈' },
    { value: 'FIXED_DEPOSIT_MATURITY', label: '적금 만기' },
    { value: 'OTHER', label: '기타' },
  ];

  const [selectInValue, setSelectInValue] = useState('');
  // console.log('선택:', selectInValue);

  const inSelectCustom = {
    control: (provided: any) => ({
      ...provided,
      'width': '180px',
      'height': '32px',
      'border': 'none',
      'fontSize': '14px',
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
      'paddingRight': '16px',
      '&:hover': { backgroundColor: '#F5F5F5' },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '10px',
      width: '180px',
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

  // 지출 셀렉트 박스
  const exOptions: { value: string; label: string }[] = [
    { value: 'UTILITY_BILL', label: '월세/관리비/공과금' },
    { value: 'CONDOLENCE_EXPENSE', label: '경조사비' },
    { value: 'TRANSPORTATION', label: '교통비' },
    { value: 'COMMUNICATION_EXPENSES', label: '통신비' },
    { value: 'INSURANCE', label: '보험' },
    { value: 'EDUCATION', label: '교육' },
    { value: 'SAVINGS', label: '저축' },
    { value: 'CULTURE', label: '문화' },
    { value: 'HEALTH', label: '건강' },
    { value: 'FOOD_EXPENSES', label: '식비' },
    { value: 'SHOPPING', label: '쇼핑' },
    { value: 'LEISURE_ACTIVITIES', label: '여가활동' },
    { value: 'OTHER', label: '기타' },
  ];

  const [selectExValue, setSelectExValue] = useState('');
  // console.log('선택:', selectExValue);

  const exSelectCustom = {
    control: (provided: any) => ({
      ...provided,
      'width': '180px',
      'height': '32px',
      'border': 'none',
      'fontSize': '14px',
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
      'paddingRight': '16px',
      '&:hover': { backgroundColor: '#F5F5F5' },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '10px',
      width: '180px',
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

  // 천단위 콤마
  const priceComma = (price: number | null | undefined): string =>
    price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';

  // 년, 월, 일, 요일 변환 함수
  const dateWithDay = (dateString: string): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    const dayOfWeek = days[date.getDay()];

    return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
  };

  // 기간 표시
  const currentDate = new Date();
  const formattedCurrentDate = format(currentDate, 'MM-dd');
  // 1주일
  const oneWeekAgo = subWeeks(new Date(), 1);
  const oneWeek = format(oneWeekAgo, 'yyyy-MM-dd');
  // 1개월
  const oneMonthAgo = subMonths(new Date(), 1);
  const oneMonth = format(oneMonthAgo, 'yyyy-MM-dd');
  // 3개월
  const threeMonthAgo = subMonths(new Date(), 3);
  const threeMonth = format(threeMonthAgo, 'yyyy-MM-dd');

  // 기간조회 시작/끝 날짜
  const startDate = useRecoilValue(startDateState);
  const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : '';
  const endDate = useRecoilValue(endDateState);
  const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : '';
  const dateRange =
    term.find((item) => item.selected && item.name === '기간 선택') &&
    startDate &&
    endDate
      ? `&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      : '';

  // 기간조회 쿼리스트링
  const currentString = `date=${currentMonth}`;

  const getCurrentDateType = () => {
    const allFalse = term.every((item) => !item.selected);

    if (allFalse) {
      return currentString;
    }

    const selectedTerm = term.find((item) => item.selected);

    switch (selectedTerm?.name) {
      case '1주일':
        return '&dateType=week';
      case '1개월':
        return '&dateType=month';
      case '3개월':
        return '&dateType=3month';
      case '기간 선택':
        return dateRange;
      default:
        return '';
    }
  };

  const dateType = getCurrentDateType();

  // 카테고리별 쿼리스트링
  let params = '';

  if (selectedInExFilter === '수입') {
    params += '&accountType=INCOME';

    switch (selectInValue) {
      case 'EMPLOYMENT_INCOME':
        params += '&incomeType=EMPLOYMENT_INCOME';
        break;
      case 'BUSINESS':
        params += '&incomeType=BUSINESS';
        break;
      case 'STOCKS':
        params += '&incomeType=STOCKS';
        break;
      case 'INVESTMENT':
        params += '&incomeType=INVESTMENT';
        break;
      case 'ALLOWANCE':
        params += '&incomeType=ALLOWANCE';
        break;
      case 'FIXED_DEPOSIT_MATURITY':
        params += '&incomeType=FIXED_DEPOSIT_MATURITY';
        break;
      case 'OTHER':
        params += '&incomeType=OTHER';
        break;
      default:
        break;
    }
  } else if (selectedInExFilter === '지출') {
    params += '&accountType=EXPENDITURE';

    switch (selectExValue) {
      case 'UTILITY_BILL':
        params += '&expenditureType=UTILITY_BILL';
        break;
      case 'CONDOLENCE_EXPENSE':
        params += '&expenditureType=CONDOLENCE_EXPENSE';
        break;
      case 'TRANSPORTATION':
        params += '&expenditureType=TRANSPORTATION';
        break;
      case 'COMMUNICATION_EXPENSES':
        params += '&expenditureType=COMMUNICATION_EXPENSES';
        break;
      case 'INSURANCE':
        params += '&expenditureType=INSURANCE';
        break;
      case 'EDUCATION':
        params += '&expenditureType=EDUCATION';
        break;
      case 'SAVINGS':
        params += '&expenditureType=SAVINGS';
        break;
      case 'CULTURE':
        params += '&expenditureType=CULTURE';
        break;
      case 'HEALTH':
        params += '&expenditureType=HEALTH';
        break;
      case 'FOOD_EXPENSES':
        params += '&expenditureType=FOOD_EXPENSES';
        break;
      case 'SHOPPING':
        params += '&expenditureType=SHOPPING';
        break;
      case 'LEISURE_ACTIVITIES':
        params += '&expenditureType=LEISURE_ACTIVITIES';
        break;
      case 'OTHER':
        params += '&expenditureType=OTHER';
        break;
      default:
        break;
    }
  }

  // 필터링별 데이터 조회
  const {
    isLoading: getAccountTypeLoading,
    error: getAccountTypeError,
    data: getAccountType,
    refetch: getAccountTypeRefetch,
  }: UseQueryResult<Data> = useQuery(
    ['getAccountType', id, dateType, params],
    () => accounts.getAccountType(id as string, dateType, params)
  );
  console.log('data 호출:', getAccountType?.content);

  // 일별로 데이터를 그룹화하는 함수
  const groupDataByDate = (
    data: LedgerHistoryResponseDto[]
  ): Record<string, LedgerHistoryResponseDto[]> => {
    const sortedData = [...data].sort((a, b) => {
      // 날짜를 비교하여 오름차순으로 정렬
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    });

    const groupedData: Record<string, LedgerHistoryResponseDto[]> = {};

    sortedData.forEach((item) => {
      const date = item.date.slice(0, 10); // 'YYYY-MM-DD' 형식의 날짜 추출

      if (groupedData[date]) {
        groupedData[date].push(item);
      } else {
        groupedData[date] = [item];
      }
    });

    return groupedData;
  };

  // 데이터를 날짜별로 정렬하고 그룹화
  const groupedData = Array.isArray(getAccountType?.content)
    ? groupDataByDate(getAccountType!.content)
    : {};
  // console.log('groupedData:', groupedData);

  // 가계부 이름 수정 모달창
  const [nameModal, setNameModal] = useState<boolean>(false);

  const nameModalOpen = (): void => {
    setNameModal(true);
  };

  // 모달창 닫으면서 refetch로 데이터 재렌더링
  const nameModalClose = (): void => {
    setNameModal(false);
    getAccountRefetch();
    getAccountTypeRefetch();
  };

  // 월별 조회 모달창
  const [monthModal, setMonthModal] = useState<boolean>(false);

  const monthModalOpen = (): void => {
    setMonthModal(true);
    getTotalMonthDateRefetch();
    getAccountTypeRefetch();
  };

  if (isLoading || getTotalMonthDateIsLoading || getAccountTypeLoading) {
    return <Loading />;
  }
  if (error || getTotalMonthDateError || getAccountTypeError) {
    return <Error />;
  }

  return (
    <>
      {nameModal && (
        <AccountName
          nameModalClose={nameModalClose}
          data={
            getAccount
              ? { title: getAccount.title, id: getAccount.id.toString() }
              : undefined
          }
        />
      )}
      {monthModal && (
        <AccountMonth setMoment={setMoment} setMonthModal={setMonthModal} />
      )}
      <Header>
        <div className="month">
          <button
            className="sideBtn"
            type="button"
            onClick={() => {
              setMoment(getMoment.clone().subtract(1, 'month'));
              getTotalMonthDateRefetch();
              getAccountTypeRefetch();
            }}
          >
            <AiFillCaretLeft />
          </button>

          <button type="button" onClick={monthModalOpen}>
            <h1>{today.format('M')}월</h1>
          </button>

          <button
            type="button"
            className="sideBtn"
            onClick={() => {
              setMoment(getMoment.clone().add(1, 'month'));
              getTotalMonthDateRefetch();
              getAccountTypeRefetch();
            }}
          >
            <AiFillCaretRight />
          </button>
        </div>
      </Header>

      <div className="_AccountBackground">
        <button type="button" className="_AccountName" onClick={nameModalOpen}>
          <span>{getAccount?.title}</span>
          <BsFillPenFill />
        </button>

        <div className="total">
          <p>이번달 모은 금액</p>
          <p className="totalMoney">
            <NumberAnimation
              targetNumber={
                (getTotalMonthDate?.income_sum ?? 0) -
                (getTotalMonthDate?.expenditure_sum ?? 0)
              }
            />
            원
          </p>
        </div>

        <div className="incmExpnd">
          <p>
            수입{' '}
            <span className="incm">
              <NumberAnimation
                targetNumber={getTotalMonthDate?.income_sum ?? 0}
              />
              원
            </span>
          </p>
          <p>
            지출{' '}
            <span className="expnd">
              <NumberAnimation
                targetNumber={getTotalMonthDate?.expenditure_sum ?? 0}
              />
              원
            </span>
          </p>
        </div>
      </div>

      <div className="line"> </div>
      <Calendar
        today={today}
        incomeType={incomeType}
        expenditureType={expenditureType}
        getAccountRefetch={getAccountRefetch}
      />
      <div className="line"> </div>
      <Chart id={id} currentMonth={currentMonth} />
      <div className="line"> </div>
      <ChartLastMonth currentMonth={currentMonth} />
      <div className="line"> </div>

      <div className="_AccountBackground">
        <div className="accountRangeBtn">
          {term.map((el, i) => (
            <div
              key={el.name}
              role="button"
              onClick={() => categoryOnclick(i)}
              onKeyDown={() => categoryOnclick(i)}
              tabIndex={0}
              className={
                el.selected ? 'accountFocusFilterBtn' : 'accountFilterBtn'
              }
            >
              {el.name}
            </div>
          ))}
        </div>
        {term[0].selected && (
          <p className="accountRangeText">
            {oneWeek} ~ {formattedCurrentDate}
          </p>
        )}
        {term[1].selected && (
          <p className="accountRangeText">
            {oneMonth} ~ {formattedCurrentDate}
          </p>
        )}
        {term[2].selected && (
          <p className="accountRangeText">
            {threeMonth} ~ {formattedCurrentDate}
          </p>
        )}
        {term[3].selected && <AccountRangeCal />}
        <ul className="InExFilter">
          <div className="accountFilterSelect">
            {selectedInExFilter === '수입' ? (
              <Select
                placeholder="수입 카테고리"
                options={inOptions}
                onChange={(e: any) => {
                  if (e && e.value) {
                    setSelectInValue(e.value);
                  }
                  setSelectExValue('');
                }}
                styles={inSelectCustom}
              />
            ) : null}
            {selectedInExFilter === '지출' ? (
              <Select
                placeholder="지출 카테고리"
                options={exOptions}
                onChange={(e: any) => {
                  if (e && e.value) {
                    setSelectExValue(e.value);
                  }
                  setSelectInValue('');
                }}
                styles={exSelectCustom}
              />
            ) : null}
          </div>

          <button
            type="button"
            className={`detailOfInExFilterItem ${
              selectedInExFilter === '전체' ? 'checked' : ''
            }`}
            onClick={() => {
              handleInExFilter('전체');
              setSelectInValue('');
              setSelectExValue('');
            }}
          >
            전체
          </button>
          <button
            type="button"
            className={`detailOfInExFilterItem ${
              selectedInExFilter === '수입' ? 'checked' : ''
            }`}
            onClick={() => {
              handleInExFilter('수입');
              setSelectExValue('');
            }}
          >
            수입
          </button>
          <button
            type="button"
            className={`detailOfInExFilterItem ${
              selectedInExFilter === '지출' ? 'checked' : ''
            }`}
            onClick={() => {
              handleInExFilter('지출');
              setSelectInValue('');
            }}
          >
            지출
          </button>
        </ul>
        {getAccountType?.content.length === 0 ? (
          <div className="emptyData">
            <p className="title">텅 비었네요</p>
            <p className="content">
              가계부를 작성하고
              <br />
              포인트를 받아보세요!
            </p>
          </div>
        ) : (
          Object.entries(groupedData).map(([date, items]) => {
            const month = moment(date).format('yyyy-M');
            const shouldShowAllMonths = dateType !== 'currentString';

            if (shouldShowAllMonths || month === today.format('yyyy-M')) {
              return (
                <div className="accountBody" key={date}>
                  <p className="accountDate">{dateWithDay(date)}</p>
                  <div className="accountBodyLine" />

                  {items.map((item) => {
                    // 수입, 지출, 저축에 따른 금액 className
                    let className = '';
                    if (item.accountType === 'INCOME') {
                      className = 'accountLabelIn';
                    } else if (
                      item.accountType === 'EXPENDITURE' &&
                      item.expenditureType === 'SAVINGS'
                    ) {
                      className = 'accountLabelSave';
                    } else {
                      className = 'accountLabelEx';
                    }

                    // 수입, 지출 각 카테고리 반환
                    let result;

                    if (item.accountType === 'EXPENDITURE') {
                      if (item.expenditureType !== null) {
                        result = expenditureType(item.expenditureType);
                      } else {
                        result = '';
                      }
                    } else {
                      result = incomeType(item.incomeType);
                    }

                    return (
                      <div className="accountBodyContents" key={item.id}>
                        <div className="accountLabel">
                          <p>{item.title}</p>
                          <p className={className}>
                            {item.income ? '+' : '-'}
                            {priceComma(
                              item.income ? item.income : item.expenditure
                            )}
                            원
                          </p>
                        </div>
                        <p className="accountCategory">
                          {item.accountType === 'EXPENDITURE' ? '지출' : '수입'}{' '}
                          {'>'} {result}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            }

            return null;
          })
        )}
        {/* {Object.entries(groupedData).map(([date, items]) => {
          const month = moment(date).format('yyyy-M');
          const shouldShowAllMonths = dateType !== 'currentString';

          if (shouldShowAllMonths || month === today.format('yyyy-M')) {
            return (
              <div className="accountBody" key={date}>
                <p className="accountDate">{dateWithDay(date)}</p>
                <div className="accountBodyLine" />

                {items.map((item) => {
                  // 수입, 지출, 저축에 따른 금액 className
                  let className = '';
                  if (item.accountType === 'INCOME') {
                    className = 'accountLabelIn';
                  } else if (
                    item.accountType === 'EXPENDITURE' &&
                    item.expenditureType === 'SAVINGS'
                  ) {
                    className = 'accountLabelSave';
                  } else {
                    className = 'accountLabelEx';
                  }

                  // 수입, 지출 각 카테고리 반환
                  let result;

                  if (item.accountType === 'EXPENDITURE') {
                    if (item.expenditureType !== null) {
                      result = expenditureType(item.expenditureType);
                    } else {
                      result = '';
                    }
                  } else {
                    result = incomeType(item.incomeType);
                  }

                  return (
                    <div className="accountBodyContents" key={item.id}>
                      <div className="accountLabel">
                        <p>{item.title}</p>
                        <p className={className}>
                          {item.income ? '+' : '-'}
                          {priceComma(
                            item.income ? item.income : item.expenditure
                          )}
                          원
                        </p>
                      </div>
                      <p className="accountCategory">
                        {item.accountType === 'EXPENDITURE' ? '지출' : '수입'}{' '}
                        {'>'} {result}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          }

          return null;
        })} */}
      </div>
    </>
  );
}

export default Account;
