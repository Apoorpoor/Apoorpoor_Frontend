import React from 'react';
import { BsXLg } from 'react-icons/bs';
import Portal from '../../shared/Portal';

interface AccountMonthProps {
  setMonthModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function AccountMonth({ setMonthModal }: AccountMonthProps) {
  const monthModalClose = (): void => {
    setMonthModal(false);
  };

  return (
    <Portal>
      <div className="accountModalBg">
        <div className="accountModalBox">
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

          <div className="selectMonthList">
            <p className="selectMonth">2023년 05월</p>
            <p className="selectMonth">2023년 04월</p>
            <p className="selectMonth">2023년 03월</p>
            <p className="selectMonth">2023년 02월</p>
            <p className="selectMonth">2023년 01월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
            <p className="selectMonth">2022년 12월</p>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default AccountMonth;
