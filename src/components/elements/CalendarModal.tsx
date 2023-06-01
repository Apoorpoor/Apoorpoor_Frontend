import React from 'react';
import '../../styles/components/_AccountModal.scss';
import { BsXLg, BsPlusLg } from 'react-icons/bs';
import { useNavigate } from 'react-router';
import Portal from '../../shared/Portal';

interface CalendarModalProps {
  setCalendarModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function CalendarModal({ setCalendarModal }: CalendarModalProps) {
  const navigate = useNavigate();
  const calendarModalClose = (): void => {
    setCalendarModal(false);
  };
  return (
    <Portal>
      <div className="accountModalBg">
        <div className="accountModalBox">
          <div className="titleRow">
            <h2 className="title">5월 3일 화요일</h2>
            <button
              className="closeBtnBox"
              type="button"
              onClick={calendarModalClose}
            >
              <BsXLg className="closeBtn" />
            </button>
          </div>

          <div className="accountBodyContents">
            <div className="accountLabel">
              <p>세븐일레븐</p>
              <p className="accountLabelEx">-3,000원</p>
            </div>
            <p className="accountCategory">지출 {'>'} 식비</p>
          </div>

          <div className="accountBodyContents">
            <div className="accountLabel">
              <p>삼성전자 배당금</p>
              <p className="accountLabelIn">+9,000원</p>
            </div>
            <p className="accountCategory">수입 {'>'} 주식</p>
          </div>

          <button
            type="button"
            className="accountAddBtn"
            onClick={() => navigate('/addAccount')}
          >
            <div className="accountAddBtnIcon">
              <BsPlusLg />
            </div>
            <span className="accountAddBtnSpan">내역 추가</span>
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default CalendarModal;
