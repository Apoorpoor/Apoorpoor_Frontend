import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { QueryObserverResult, UseQueryResult, useQuery } from 'react-query';
import '../../styles/components/_Calender.scss';
import { useParams } from 'react-router';
import CalendarModal from './CalendarModal';
import accounts from '../../api/accounts';

interface CalendarProps {
  today: Moment;
  incomeType: (type: string) => string;
  expenditureType: (type: string) => string;
  getAccountRefetch: QueryObserverResult['refetch'];
}

// 월별, 일별 수입/지출 총 금액 조회
interface TotalStatus {
  day: string;
  expenditure_sum: number;
  income_sum: number;
}

interface AccountTotalResponseDto {
  accountTotalResponseDtoList: TotalStatus[];
  expenditure_sum: number;
  income_sum: number;
}

function Calendar({
  today,
  incomeType,
  expenditureType,
  getAccountRefetch,
}: CalendarProps): JSX.Element {
  // 현재 가계부의 id 조회
  const { id } = useParams<{ id?: string }>();

  // 현재 조회하고 있는 달
  const currentMonth = today.format('YYYY-MM');

  // 월별, 일별 수입/지출 총 금액 조회
  const {
    data: getTotalMonthDate,
    refetch: getTotalMonthDateRefetch,
  }: UseQueryResult<AccountTotalResponseDto> = useQuery(
    ['getTotalMonthDate', id, currentMonth],
    () => accounts.getTotalMonthDate(id as string, currentMonth)
  );

  const monthTotal = getTotalMonthDate?.accountTotalResponseDtoList;
  // console.log('총 금액 호출:', monthTotal);

  // 날짜 클릭 시 상세 모달
  const [calendarModal, setCalendarModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const calendarModalOpen = (date: string): void => {
    setSelectedDate(date);
    setCalendarModal(true);
  };

  const firstWeek = today.clone().startOf('month').week();
  const lastWeek =
    today.clone().endOf('month').week() === 1
      ? 53
      : today.clone().endOf('month').week();

  const calendarArr = () => {
    let result: JSX.Element[] = [];
    let currentweek = firstWeek;

    const generateTableCells = (week: number): JSX.Element[] =>
      Array(7)
        .fill(0)
        .map((_, index) => {
          const days = today
            .clone()
            .startOf('year')
            .week(week)
            .startOf('week')
            .add(index, 'day');

          const matchingData = monthTotal?.find(
            (item) => item.day === days.format('YYYY-MM-DD')
          );

          if (moment().format('YYYYMMDD') === days.format('YYYYMMDD')) {
            return (
              <button
                type="button"
                className="td"
                key={days.format('YYYY-MM-DD')}
                style={{ color: 'black' }}
                onClick={() => calendarModalOpen(days.format('YYYY-MM-DD'))}
              >
                <span className="today" data-text={days.format('D')}>
                  {days.format('D')}
                </span>
                <div className="accountPriceHeight">
                  {matchingData?.expenditure_sum ? (
                    <span className="accountPrice expenditure">
                      -{matchingData.expenditure_sum.toLocaleString()}
                    </span>
                  ) : (
                    ''
                  )}
                  {matchingData?.income_sum ? (
                    <span className="accountPrice income">
                      +{matchingData.income_sum.toLocaleString()}
                    </span>
                  ) : (
                    ''
                  )}
                </div>
              </button>
            );
          }

          if (days.format('MM') !== today.format('MM')) {
            return (
              <button
                type="button"
                className="notThisMonthBox"
                key={days.format('YYYY-MM-DD')}
              >
                <span>{days.format('D')}</span>
              </button>
            );
          }

          return (
            <button
              type="button"
              className="td"
              key={days.format('YYYY-MM-DD')}
              onClick={() => calendarModalOpen(days.format('YYYY-MM-DD'))}
            >
              <span className="eachDate">{days.format('D')}</span>
              <div className="accountPriceHeight">
                {matchingData?.expenditure_sum ? (
                  <span className="accountPrice expenditure">
                    -{matchingData.expenditure_sum.toLocaleString()}
                  </span>
                ) : (
                  ''
                )}
                {matchingData?.income_sum ? (
                  <span className="accountPrice income">
                    +{matchingData.income_sum.toLocaleString()}
                  </span>
                ) : (
                  ''
                )}
              </div>
            </button>
          );
        });

    for (currentweek; currentweek <= lastWeek; currentweek += 1) {
      result = result.concat(
        <tr className="tr" key={currentweek}>
          {generateTableCells(currentweek)}
        </tr>
      );
    }

    return result;
  };
  return (
    <div className="calBackground">
      {calendarModal && (
        <CalendarModal
          setCalendarModal={setCalendarModal}
          selectedDate={selectedDate}
          incomeType={incomeType}
          expenditureType={expenditureType}
          getAccountRefetch={getAccountRefetch}
          getTotalMonthDateRefetch={getTotalMonthDateRefetch}
        />
      )}
      <div className="days">
        <p className="sun">일</p>
        <p>월</p>
        <p>화</p>
        <p>수</p>
        <p>목</p>
        <p>금</p>
        <p className="sat">토</p>
      </div>
      <table className="dates">
        <tbody className="date">{calendarArr()}</tbody>
      </table>
    </div>
  );
}

export default Calendar;
