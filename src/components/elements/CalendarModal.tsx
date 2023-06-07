import React, { useState } from 'react';
import '../../styles/components/_AccountModal.scss';
import { BsXLg, BsPlusLg, BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router';
import { UseQueryResult, useQuery } from 'react-query';
import Portal from '../../shared/Portal';
import accounts from '../../api/accounts';

// Calendar.tsx에서 받아오는 props
interface CalendarModalProps {
  setCalendarModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate: string;
  incomeType: (type: string) => string;
  expenditureType: (type: string) => string;
}

// 데이터 get할 때의 객체 interface
interface LedgerItem {
  id: number;
  title: string;
  accountType: string;
  incomeType: string | null;
  expenditureType: string | null;
  paymentMethod: string | null;
  income: number | null;
  expenditure: number | null;
  date: string;
}

function CalendarModal({
  setCalendarModal,
  selectedDate,
  incomeType,
  expenditureType,
}: CalendarModalProps) {
  const navigate = useNavigate();

  // 현재 가계부의 id 조회
  const { id } = useParams<{ id?: string }>();

  // 일자별 거래내역 조회
  const { isLoading, error, data }: UseQueryResult<LedgerItem[]> = useQuery(
    ['getAccountsDate', id, selectedDate],
    () => accounts.getAccountsDate(id as string, selectedDate as string)
  );
  console.log('일자별 거래내역 호출:', data);

  // 모달창 닫기
  const calendarModalClose = (): void => {
    setCalendarModal(false);
  };

  // 거래내역 수정 삭제 버튼 보이기
  const [editDelBtn, setEditDelBtn] = useState<{ [key: string]: boolean }>({});

  const editDelBtnHandler = (item: string) => {
    setEditDelBtn((prevState) => {
      const updatedState = { ...prevState };
      updatedState[item] = !prevState[item];
      return updatedState;
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  // 천단위 콤마
  const priceComma = (price: number | null): string => {
    if (price === null) {
      return '';
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 년, 월, 일, 요일 변환 함수
  const dateWithDay = (dateString: string): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    const dayOfWeek = days[date.getDay()];

    return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
  };

  return (
    <Portal>
      <div className="accountModalBg">
        <div className="accountModalBox">
          <div className="titleRow">
            <h2 className="title">{dateWithDay(selectedDate)}</h2>
            <button
              className="closeBtnBox"
              type="button"
              onClick={calendarModalClose}
            >
              <BsXLg className="closeBtn" />
            </button>
          </div>

          {data?.map((item, index) => {
            // 수입, 지출, 저축에 따른 금액 className
            let className = '';
            if (item.accountType === 'INCOME') {
              className = 'accountLabelIn';
            } else if (
              item.accountType === 'EXPENDITURE' &&
              item.expenditureType === 'SAVINGS'
            ) {
              className = 'accountLabelSave';
            } else {
              className = 'accountLabelEx';
            }

            // 수입, 지출 각 카테고리 반환
            let result;

            if (item.accountType === 'EXPENDITURE') {
              if (item.expenditureType !== null) {
                result = expenditureType(item.expenditureType);
              } else {
                result = '';
              }
            } else {
              result = item.incomeType ? incomeType(item.incomeType) : '';
            }

            return (
              <div key={item.id} className="accountBodyContents">
                <div className="accountLabel">
                  <p>{item.title}</p>
                  <div>
                    <p className={className}>
                      {item.accountType === 'INCOME' ? null : '-'}
                      {priceComma(
                        item.income === null ? item.expenditure : item.income
                      )}
                      원
                    </p>
                    <BsThreeDotsVertical
                      className="editDelMenu"
                      onClick={() => editDelBtnHandler(String(index))}
                    />
                  </div>
                </div>
                <div className="accountRow">
                  <p className="accountCategory">
                    {item.accountType === 'EXPENDITURE' ? '지출' : '수입'} {'>'}{' '}
                    {result}
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
            );
          })}

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
