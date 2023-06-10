import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { QueryObserverResult } from 'react-query';
import '../../styles/components/_Calender.scss';
import CalendarModal from './CalendarModal';

interface CalendarProps {
  today: Moment;
  incomeType: (type: string) => string;
  expenditureType: (type: string) => string;
  getAccountRefetch: QueryObserverResult['refetch'];
  getTotalMonthDateRefetch: QueryObserverResult['refetch'];
}

function Calendar({
  today,
  incomeType,
  expenditureType,
  getAccountRefetch,
  getTotalMonthDateRefetch,
}: CalendarProps): JSX.Element {
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

          if (moment().format('YYYYMMDD') === days.format('YYYYMMDD')) {
            return (
              <button
                type="button"
                className="td"
                key={days.format('YYYY-MM-DD')}
                style={{ color: 'black' }}
                onClick={() => calendarModalOpen(days.format('YYYY-MM-DD'))}
              >
                <div className="todaySt">
                  <span>{days.format('D')}</span>
                </div>
              </button>
            );
          }

          if (days.format('MM') !== today.format('MM')) {
            return (
              <td
                className="td"
                key={days.format('YYYY-MM-DD')}
                style={{ color: '#f5f5f5' }}
              >
                <span>{days.format('D')}</span>
              </td>
            );
          }

          return (
            <button
              type="button"
              className="td"
              key={days.format('YYYY-MM-DD')}
              onClick={() => calendarModalOpen(days.format('YYYY-MM-DD'))}
            >
              <span>{days.format('D')}</span>
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
