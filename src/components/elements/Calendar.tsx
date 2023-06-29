import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { QueryObserverResult, UseQueryResult, useQuery } from 'react-query';
import '../../styles/components/_Calender.scss';
import { useParams } from 'react-router';
import { isAfter, isSameDay } from 'date-fns';
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

  // 숫자 형식화 함수
  const formatNumber = (value: number) => {
    if (value >= 100000000) {
      const stringValue = value.toString();
      const remainingDigits = stringValue.substring(0, stringValue.length - 8);
      return `${remainingDigits}억원`;
    }
    if (value >= 100000) {
      const stringValue = value.toString();
      const firstTwoDigits = stringValue.substring(0, stringValue.length - 4);
      return `${firstTwoDigits}만원`;
    }
    if (value >= 10000 && value < 100000) {
      const stringValue = value.toString();
      const firstDigit = stringValue[0];
      const secondDigit = stringValue[1];
      return `${firstDigit}만${secondDigit}천원`;
    }
    if (value >= 1000 && value < 10000) {
      const firstDigit = Math.floor(value / 1000);
      return `${firstDigit}천원`;
    }
    return `${value.toLocaleString().split('.')[0]}원`;
  };

  // 날짜 클릭 시 상세 모달
  const [calendarModal, setCalendarModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  // 모달 오픈/클로즈 애니메이션
  const [modalAnimation, setModalAnimation] = useState('');

  const calendarModalOpen = (date: string): void => {
    if (isSameDay(new Date(date), new Date())) {
      setSelectedDate(date);
      setCalendarModal(true);
      setModalAnimation('modalAnimation');
    }
    if (!isAfter(new Date(date), new Date())) {
      setSelectedDate(date);
      setCalendarModal(true);
      setModalAnimation('modalAnimation');
    }
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
                      -{formatNumber(matchingData.expenditure_sum)}
                    </span>
                  ) : (
                    ''
                  )}
                  {matchingData?.income_sum ? (
                    <span className="accountPrice income">
                      +{formatNumber(matchingData.income_sum)}
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
                    -{formatNumber(matchingData.expenditure_sum)}
                  </span>
                ) : (
                  ''
                )}
                {matchingData?.income_sum ? (
                  <span className="accountPrice income">
                    +{formatNumber(matchingData.income_sum)}
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
          modalAnimation={modalAnimation}
          setModalAnimation={setModalAnimation}
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
