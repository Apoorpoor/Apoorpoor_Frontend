import React, { useState } from 'react';
import '../../styles/components/_AccountModal.scss';
import { BsXLg, BsPlusLg, BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router';
import Portal from '../../shared/Portal';

interface CalendarModalProps {
  setCalendarModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function CalendarModal({ setCalendarModal }: CalendarModalProps) {
  const navigate = useNavigate();

  // 모달창 닫기
  const calendarModalClose = (): void => {
    setCalendarModal(false);
  };

  const [editDelBtn, setEditDelBtn] = useState<{ [key: string]: boolean }>({});

  const editDelBtnHandler = (item: string) => {
    setEditDelBtn((prevState) => {
      const updatedState = { ...prevState };
      updatedState[item] = !prevState[item];
      return updatedState;
    });
  };

  // 일일 가계부 데이터
  const data: {
    id: number;
    contents: string;
    price: number;
    category: string;
    incategory: string;
  }[] = [
    {
      id: 0,
      contents: '세븐일레븐',
      price: 3000,
      category: '지출',
      incategory: '식비',
    },
    {
      id: 1,
      contents: '삼성전자 배당금',
      price: 9000,
      category: '수입',
      incategory: '주식',
    },
  ];

  // 천단위 콤마
  const priceComma = (price: number): string =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

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

          {data?.map((item, index) => (
            <div key={item.id} className="accountBodyContents">
              <div className="accountLabel">
                <p>{item.contents}</p>
                <div>
                  <p
                    className={
                      item.category === '수입'
                        ? 'accountLabelIn'
                        : 'accountLabelEx'
                    }
                  >
                    {item.category === '수입' ? null : '-'}
                    {priceComma(item.price)}원
                  </p>
                  <BsThreeDotsVertical
                    className="editDelMenu"
                    onClick={() => editDelBtnHandler(String(index))}
                  />
                </div>
              </div>
              <div className="accountRow">
                <p className="accountCategory">
                  {item.category} {'>'} {item.incategory}
                </p>
                {editDelBtn[String(index)] ? (
                  <div>
                    <button type="button" className="editBtn">
                      삭제
                    </button>
                    <button type="button" className="delBtn">
                      수정
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {/* <div className="accountBodyContents">
            <div className="accountLabel">
              <p>삼성전자 배당금</p>
              <div>
                <p className="accountLabelIn">+9,000원</p>
                <BsThreeDotsVertical
                  className="editDelMenu"
                  // onClick={editDelBtnHandler}
                />
              </div>
            </div>
            <div className="accountRow">
              <p className="accountCategory">수입 {'>'} 주식</p>
              {editDelBtn ? (
                <div>
                  <button type="button" className="editBtn">
                    삭제
                  </button>
                  <button type="button" className="delBtn">
                    수정
                  </button>
                </div>
              ) : null}
            </div>
          </div> */}

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
