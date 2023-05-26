import React from 'react';
import moment, { Moment } from 'moment';
import '../../styles/components/_Calender.scss';

interface CalendarProps {
  today: Moment;
}

function Calendar({ today }: CalendarProps): JSX.Element {
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
              <td
                className="td"
                key={days.format('D')}
                style={{ color: 'black' }}
              >
                <div className="todaySt">
                  <span>{days.format('D')}</span>
                </div>
              </td>
            );
          }

          if (days.format('MM') !== today.format('MM')) {
            return (
              <td
                className="td"
                key={days.format('D')}
                style={{ color: 'white' }}
              >
                <span>{days.format('D')}</span>
              </td>
            );
          }

          return (
            <td className="td" key={days.format('YYYY-MM-DD')}>
              <span>{days.format('D')}</span>
            </td>
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
