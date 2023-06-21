import React, { useState, useRef } from 'react';
import '../../styles/components/_AccountModal.scss';
import { BsXLg, BsPlusLg, BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router';
import {
  QueryObserverResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from 'react-query';
import { useSetRecoilState } from 'recoil';
import Portal from '../../shared/Portal';
import accounts from '../../api/accounts';
import { mainDateState } from '../../shared/Atom';

// Calendar.tsx에서 받아오는 props
interface CalendarModalProps {
  setCalendarModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate: string;
  incomeType: (type: string) => string;
  expenditureType: (type: string) => string;
  getAccountRefetch: QueryObserverResult['refetch'];
  getTotalMonthDateRefetch: QueryObserverResult['refetch'];
  setModalAnimation: React.Dispatch<React.SetStateAction<string>>;
  modalAnimation: string;
}

// 데이터 get할 때의 객체 interface
interface Data {
  content: LedgerItem[];
  totalPages: number;
  last: boolean;
  number: number;
}

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
  getAccountRefetch,
  getTotalMonthDateRefetch,
  setModalAnimation,
  modalAnimation,
}: CalendarModalProps) {
  const navigate = useNavigate();

  // 현재 가계부의 id 조회
  const { id } = useParams<{ id?: string }>();

  // 일자별 거래내역 조회
  const { isLoading, error, data, refetch }: UseQueryResult<Data> = useQuery(
    ['getAccountsDate', id, selectedDate],
    () => accounts.getAccountsDate(id as string, selectedDate as string)
  );

  const mappedData = data?.content.flatMap((item) => ({
    accountType: item.accountType,
    date: item.date,
    expenditure: item.expenditure,
    expenditureType: item.expenditureType,
    id: item.id,
    income: item.income,
    incomeType: item.incomeType,
    paymentMethod: item.paymentMethod,
    title: item.title,
  }));

  // 가계부 캘린더 선택 날짜
  const setMainDate = useSetRecoilState(mainDateState);

  // 모달창 닫기
  const calendarModalClose = (): void => {
    setCalendarModal(false);
    getAccountRefetch();
    getTotalMonthDateRefetch();
    setModalAnimation('');
  };

  // 배경 누르면 모달 닫힘
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === modalRef.current) {
      // 배경을 클릭한 경우에만 모달을 닫기
      calendarModalClose();
      getAccountRefetch();
      getTotalMonthDateRefetch();
      setModalAnimation('');
    }
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

  // 거래내역 삭제
  const delAccountMutation = useMutation(
    (delId: number) => accounts.delAccount(delId),
    {
      onSuccess: () => {
        console.log('거래내역 삭제 성공!');
      },
      onError: (err) => {
        console.log('거래내역 삭제 실패:', err);
      },
    }
  );

  const handledelAccount = async (delId: number) => {
    try {
      await delAccountMutation.mutateAsync(delId);
      setEditDelBtn((prevState) => {
        const updatedState = { ...prevState };
        updatedState[delId] = false;
        return updatedState;
      });
      refetch();
    } catch (err) {
      console.log('가계부 삭제 실패:', err);
    }
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
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    const dayOfWeek = days[date.getDay()];

    return `${month}월 ${day}일 ${dayOfWeek}요일`;
  };

  return (
    <Portal>
      <div
        ref={modalRef}
        className="accountModalBg"
        onClick={handleBackgroundClick}
        aria-hidden="true"
      >
        <div className={`accountModalBox ${modalAnimation}`}>
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

          {mappedData?.map((item, index) => {
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
                      {item.accountType === 'INCOME' ? '+' : '-'}
                      {priceComma(
                        item.income === 0 || item.income === null
                          ? item.expenditure
                          : item.income
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
                      <button
                        type="button"
                        className="editBtn"
                        onClick={() => handledelAccount(item.id)}
                      >
                        삭제
                      </button>
                      <button
                        type="button"
                        className="delBtn"
                        onClick={() =>
                          navigate(`/editAccount/${item.id}`, {
                            state: { data },
                          })
                        }
                      >
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
            onClick={() => {
              navigate(`/addAccount/${id}`);
              setMainDate(selectedDate);
            }}
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
