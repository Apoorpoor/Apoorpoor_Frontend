import React, { useRef } from 'react';
import { BsXLg } from 'react-icons/bs';
import moment from 'moment';
import Portal from '../../shared/Portal';
import '../../styles/components/_AccountModal.scss';

interface AccountMonthProps {
  setMonthModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMoment: React.Dispatch<React.SetStateAction<moment.Moment>>;
  setMonthAnimation: React.Dispatch<React.SetStateAction<string>>;
  monthAnimation: string;
}

function AccountMonth({
  setMonthModal,
  setMoment,
  setMonthAnimation,
  monthAnimation,
}: AccountMonthProps) {
  const monthModalRef = useRef<HTMLDivElement>(null);

  const monthModalClose = (): void => {
    setMonthModal(false);
    setMonthAnimation('');
  };

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === monthModalRef.current) {
      // 배경을 클릭한 경우에만 모달을 닫기
      monthModalClose();
    }
  };

  const getMonthList = (): JSX.Element[] => {
    const currentDate = new Date();
    const startYear = 2022;
    const startMonth = 1;
    const endYear = currentDate.getFullYear();
    const endMonth = currentDate.getMonth() + 1;

    const monthList: JSX.Element[] = [];

    for (let year = startYear; year <= endYear; year += 1) {
      const start = year === startYear ? startMonth : 1;
      const end = year === endYear ? endMonth : 12;

      for (let month = start; month <= end; month += 1) {
        const formattedMonth = `${year}년 ${
          month < 10 ? `0${month}` : month
        }월`;
        const selectedMonth = moment(
          `${year}-${month < 10 ? `0${month}` : month}`,
          'YYYY-MM'
        );
        monthList.push(
          <button
            type="button"
            className="selectMonth"
            onClick={() => {
              setMoment(selectedMonth);
              monthModalClose();
            }}
          >
            {formattedMonth}
          </button>
        );
      }
    }

    return monthList;
  };

  return (
    <Portal>
      <div
        className="accountModalBg"
        ref={monthModalRef}
        onClick={handleBackgroundClick}
        aria-hidden="true"
      >
        <div className={`accountModalBox ${monthAnimation}`}>
          <div className="titleRow">
            <h2 className="title">월 선택하기</h2>
            <button
              className="closeBtnBox"
              type="button"
              onClick={monthModalClose}
            >
              <BsXLg className="closeBtn" />
            </button>
          </div>

          <div className="selectMonthList">{getMonthList()}</div>
        </div>
      </div>
    </Portal>
  );
}

export default AccountMonth;
