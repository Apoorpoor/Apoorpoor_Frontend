import React, { useRef } from 'react';
import DatePicker from 'react-datepicker';
import { BsChevronLeft, BsChevronRight, BsXLg } from 'react-icons/bs';
import { ko } from 'date-fns/esm/locale';
import '../../styles/pages/_AddAccount.scss';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/components/react-datePicker_range.css';
import { getYear, getMonth } from 'date-fns';
import { useRecoilState } from 'recoil';
import { startDateState, endDateState } from '../../shared/Atom';

function AccountRangeCal() {
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  const [startDate, setStartDate] = useRecoilState(startDateState);
  const [endDate, setEndDate] = useRecoilState(endDateState);

  // 캘린더 열고 닫는 상태 관리
  const calendar1 = useRef<DatePicker | null>(null);
  const calendar2 = useRef<DatePicker | null>(null);

  // 캘린더 내부 X 버튼
  const cancelDatePicker1 = () => {
    setStartDate(startDate);
    calendar1.current?.setOpen(false);
  };

  const cancelDatePicker2 = () => {
    setStartDate(startDate);
    calendar2.current?.setOpen(false);
  };

  // 캘린더 input 클릭 시 열기
  const openDatePicker1 = () => {
    calendar1.current?.setOpen(true);
  };

  const openDatePicker2 = () => {
    calendar2.current?.setOpen(true);
  };

  // 날짜 선택 후, 캘린더 내부 완료 버튼
  const closeDatePicker1 = () => {
    setStartDate(startDate);
    setEndDate(endDate);
    calendar1.current?.setOpen(false);
  };

  const closeDatePicker2 = () => {
    setStartDate(startDate);
    setEndDate(endDate);
    calendar2.current?.setOpen(false);
  };

  return (
    <div className="rangeDatePicker">
      <DatePicker
        withPortal
        selectsStart
        locale={ko} // 언어설정 한국어
        ref={calendar1}
        onInputClick={() => openDatePicker1()}
        dateFormat="M월 d일" // 날짜 형식 설정
        className="rangeDatePickerInput" // 클래스 명 지정 css주기 위해
        shouldCloseOnSelect={false} // 날짜를 선택하면 datepicker가 자동으로 닫힘
        maxDate={new Date()} // 선택할 수 있는 최대 날짜값 지정
        placeholderText="날짜를 선택해주세요." // placeholder
        selected={startDate} // value
        onChange={(date) => {
          if (date instanceof Date) {
            setStartDate(date);
          }
        }} // 날짜를 선택하였을 때 실행될 함수
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="datePickerHeaderBox">
            <div className="datePickerHeader">
              <button
                className="calControlBtn"
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
              >
                <BsChevronLeft />
              </button>
              <span className="calYear">{`${[getYear(date)]}년`}</span>

              <span className="calYear">{months[getMonth(date)]}</span>

              <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
              >
                <BsChevronRight />
              </button>
            </div>
            <button
              className="calCancleBox"
              type="button"
              onClick={cancelDatePicker1}
            >
              <BsXLg className="calCancleBtn" />
            </button>
          </div>
        )}
      >
        <div className="calCloseBox">
          <button
            type="button"
            className="calCloseBtn"
            onClick={closeDatePicker1}
          >
            완료
          </button>
        </div>
      </DatePicker>
      <h2>~</h2>
      <DatePicker
        withPortal
        selectsEnd
        locale={ko} // 언어설정 한국어
        ref={calendar2}
        onInputClick={() => openDatePicker2()}
        dateFormat="M월 d일" // 날짜 형식 설정
        className="rangeDatePickerInput" // 클래스 명 지정 css주기 위해
        shouldCloseOnSelect={false} // 날짜를 선택하면 datepicker가 자동으로 닫힘
        maxDate={new Date()} // 선택할 수 있는 최대 날짜값 지정
        placeholderText="날짜를 선택해주세요." // placeholder
        selected={endDate} // value
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        onChange={(date) => {
          if (date instanceof Date) {
            setEndDate(date);
          }
        }} // 날짜를 선택하였을 때 실행될 함수
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="datePickerHeaderBox">
            <div className="datePickerHeader">
              <button
                className="calControlBtn"
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
              >
                <BsChevronLeft />
              </button>
              <span className="calYear">{`${[getYear(date)]}년`}</span>

              <span className="calYear">{months[getMonth(date)]}</span>

              <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
              >
                <BsChevronRight />
              </button>
            </div>
            <button
              className="calCancleBox"
              type="button"
              onClick={cancelDatePicker2}
            >
              <BsXLg className="calCancleBtn" />
            </button>
          </div>
        )}
      >
        <div className="calCloseBox">
          <button
            type="button"
            className="calCloseBtn"
            onClick={closeDatePicker2}
          >
            완료
          </button>
        </div>
      </DatePicker>
    </div>
  );
}

export default AccountRangeCal;
