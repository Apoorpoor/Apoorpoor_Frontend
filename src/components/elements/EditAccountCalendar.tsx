import React, { useRef, useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { BsChevronLeft, BsChevronRight, BsXLg } from 'react-icons/bs';
import { ko } from 'date-fns/esm/locale';
import '../../styles/pages/_AddAccount.scss';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/components/react-datePicker.css';
import { getYear, getMonth, getDate } from 'date-fns';

// AddAccount.tsx에서 전달받은 props
interface EditAccountCalendarProps {
  setOnDateChange: React.Dispatch<React.SetStateAction<string>>;
  beforeDate: string;
}

function EditAccountCalendar({
  setOnDateChange,
  beforeDate,
}: EditAccountCalendarProps) {
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

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 수정 전, 해당 날짜
  const beforeDateType = useMemo(() => {
    if (beforeDate) {
      return new Date(beforeDate);
    }
    return null;
  }, [beforeDate]);

  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    if (beforeDate) {
      setSelectedDate(beforeDateType);
      setCurrentDate(beforeDateType);
    }
    if (currentDate) {
      setSelectedDate(currentDate);
      setCurrentDate(currentDate);
    }
  }, [beforeDate, currentDate, beforeDateType]);

  // 캘린더 열고 닫는 상태 관리
  const calendar = useRef<DatePicker | null>(null);

  // 캘린더 내부 X 버튼
  const cancelDatePicker = () => {
    setSelectedDate(currentDate);
    calendar.current?.setOpen(false);
  };

  // 캘린더 input 클릭 시 열기
  const openDatePicker = () => {
    calendar.current?.setOpen(true);
  };

  // 날짜 선택 후, 캘린더 내부 완료 버튼
  const closeDatePicker = () => {
    setCurrentDate(selectedDate);
    calendar.current?.setOpen(false);
  };

  // "yyyy-mm-dd" 형식으로 변환
  useEffect(() => {
    if (currentDate === null || beforeDateType === null) {
      return;
    }

    if (currentDate === beforeDateType) {
      const formattedDate = `${getYear(beforeDateType)}-${(
        getMonth(beforeDateType) + 1
      )
        .toString()
        .padStart(2, '0')}-${getDate(beforeDateType)
        .toString()
        .padStart(2, '0')}`;
      setOnDateChange(formattedDate);
    }
    if (currentDate !== beforeDateType) {
      const formattedDate = `${getYear(currentDate)}-${(
        getMonth(currentDate) + 1
      )
        .toString()
        .padStart(2, '0')}-${getDate(currentDate).toString().padStart(2, '0')}`;
      setOnDateChange(formattedDate);
    }
  }, [currentDate, beforeDateType, setOnDateChange]);
  console.log('current:', currentDate, 'before:', beforeDate);

  return (
    <DatePicker
      withPortal
      locale={ko} // 언어설정 한국어
      ref={calendar}
      onInputClick={() => openDatePicker()}
      dateFormat="M월 d일" // 날짜 형식 설정
      className="datePickerInput" // 클래스 명 지정 css주기 위해
      shouldCloseOnSelect={false} // 날짜를 선택하면 datepicker가 자동으로 닫힘
      maxDate={new Date()} // 선택할 수 있는 최대 날짜값 지정
      placeholderText="날짜를 선택해주세요." // placeholder
      selected={selectedDate} // value
      onChange={(date) => setSelectedDate(date)} // 날짜를 선택하였을 때 실행될 함수
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
            onClick={cancelDatePicker}
          >
            <BsXLg className="calCancleBtn" />
          </button>
        </div>
      )}
    >
      <div className="calCloseBox">
        <button type="button" className="calCloseBtn" onClick={closeDatePicker}>
          완료
        </button>
      </div>
    </DatePicker>
  );
}

export default EditAccountCalendar;
