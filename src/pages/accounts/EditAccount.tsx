import React, { useEffect, useState } from 'react';
import { RiErrorWarningFill } from 'react-icons/ri';
// import { BsChevronLeft } from 'react-icons/bs';
import '../../styles/pages/_AddAccount.scss';
import { useLocation, useNavigate, useParams } from 'react-router';
import Select from 'react-select';
import { useMutation } from 'react-query';
import { useRecoilValue } from 'recoil';
import { Header, Input } from '../../components';
import AddAccountCalendar from '../../components/elements/AddAccountCalendar';
import accounts from '../../api/accounts';
import { accountIdState } from '../../shared/Atom';
import EditAccountDone from './EditAccountDone';

// 불러온 data의 타입
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

function EditAccount(): JSX.Element {
  const navigate = useNavigate();

  // 현재 가계부의 id 조회
  const { id = '' } = useParams<{ id: string | undefined }>();

  const accountId = useRecoilValue(accountIdState);

  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(`/account/${id}`);
  };

  // 이전 컴포넌트에서 불러온 수정 전 data
  const location = useLocation();
  const data: LedgerItem[] = location.state?.data.content;
  const editData = data.filter((item: LedgerItem) => item.id === Number(id));
  console.log('전달받은 data::', editData);

  // 금액 수정 전 input
  const returnPrice = (): number => {
    if (editData[0]?.accountType === 'EXPENDITURE') {
      return editData[0]?.expenditure ?? 0;
    }
    if (editData[0]?.accountType === 'INCOME') {
      return editData[0]?.income ?? 0;
    }
    return 0;
  };

  // 금액 입력
  const [accountPriceInput, setAccountPriceInput] = useState(
    () => returnPrice().toString() || ''
  );

  // 천단위 콤마
  const comma = (price: string) => {
    const inputPrice = price.replace(/[^0-9]/g, '');
    const addComma = inputPrice
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return addComma;
  };

  // 금액 onChange -> 숫자만 입력 가능
  const accountPriceOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    const str = value.replace(/,/g, ''); // 천 단위 콤마 제거
    setAccountPriceInput(str);
  };

  // 엑스 버튼 누르면 금액 삭제
  const handleAccountPriceInputClear = () => {
    setAccountPriceInput('');
  };

  // 100원 미만일 경우 경고 메세지
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (accountPriceInput && parseInt(accountPriceInput, 10) <= 99) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [accountPriceInput]);

  // 내용 입력
  const [title, setTitle] = useState(editData[0]?.title);

  // 내용 onChange
  const handleTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(event.target.value);
  };

  // 엑스 버튼 누르면 내용 삭제
  const handleTitleInputClear = () => {
    setTitle('');
  };

  // 수입 지출 분류 선택
  const [accountType, setAccountType] = useState(editData[0]?.accountType);

  const handleAccountType = (radioId: string): void => {
    setAccountType(radioId);
  };

  // 수입 셀렉트 박스
  const inOptions: { value: string; label: string }[] = [
    { value: 'EMPLOYMENT_INCOME', label: '근로소득' },
    { value: 'BUSINESS', label: '사업' },
    { value: 'STOCKS', label: '주식' },
    { value: 'INVESTMENT', label: '투자' },
    { value: 'ALLOWANCE', label: '용돈' },
    { value: 'FIXED_DEPOSIT_MATURITY', label: '적금 만기' },
    { value: 'OTHER', label: '기타' },
  ];

  const editInOptions = inOptions.filter(
    (options) => options.value === editData[0]?.incomeType
  );

  const [incomeType, setIncomeType] = useState<string | null>(
    editInOptions[0]?.value || ''
  );

  const inSelectCustom = {
    control: (provided: any, state: any) => ({
      ...provided,
      'marginTop': '20px',
      'width': '100%',
      'height': '48px',
      'borderRadius': '12px',
      'border': `2px solid ${state.isFocused ? '#FFD12E' : '#dfdfdf'}`,
      'fontSize': '14px',
      'paddingLeft': '10px',
      'cursor': 'pointer',
      '&:hover': {
        border: `2px solid ${state.isFocused ? '#FFD12E' : '#dfdfdf'}`,
      },
      'boxShadow': 'none',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      'backgroundColor': state.isSelected ? '#FFF3C7' : 'ffffff',
      'borderRadius': '5px',
      'color': state.isSelected ? 'black' : 'black',
      'fontSize': '14px',
      'paddingLeft': '14px',
      '&:hover': { backgroundColor: '#F5F5F5' },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '12px',
      width: '100%',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      '& svg': {
        width: '20px',
        height: '20px',
      },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  // 지출 셀렉트 박스
  const exOptions: { value: string; label: string }[] = [
    { value: 'UTILITY_BILL', label: '월세/관리비/공과금' },
    { value: 'CONDOLENCE_EXPENSE', label: '경조사비' },
    { value: 'TRANSPORTATION', label: '교통비' },
    { value: 'COMMUNICATION_EXPENSES', label: '통신비' },
    { value: 'INSURANCE', label: '보험' },
    { value: 'EDUCATION', label: '교육' },
    { value: 'SAVINGS', label: '저축' },
    { value: 'CULTURE', label: '문화' },
    { value: 'HEALTH', label: '건강' },
    { value: 'FOOD_EXPENSES', label: '식비' },
    { value: 'SHOPPING', label: '쇼핑' },
    { value: 'LEISURE_ACTIVITIES', label: '여가활동' },
    { value: 'OTHER', label: '기타' },
  ];

  const editExOptions = exOptions.filter(
    (options) => options.value === editData[0]?.expenditureType
  );

  const [expenditureType, setExpenditureType] = useState<string | null>(
    editExOptions[0]?.value || ''
  );

  const exSelectCustom = {
    control: (provided: any, state: any) => ({
      ...provided,
      'marginTop': '20px',
      'width': '100%',
      'height': '48px',
      'borderRadius': '12px',
      'border': `2px solid ${state.isFocused ? '#FFD12E' : '#dfdfdf'}`,
      'fontSize': '14px',
      'paddingLeft': '10px',
      'cursor': 'pointer',
      '&:hover': {
        border: `2px solid ${state.isFocused ? '#FFD12E' : '#dfdfdf'}`,
      },
      'boxShadow': 'none',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      'backgroundColor': state.isSelected ? '#FFF3C7' : 'ffffff',
      'borderRadius': '5px',
      'color': state.isSelected ? 'black' : 'black',
      'fontSize': '14px',
      'paddingLeft': '14px',
      '&:hover': { backgroundColor: '#F5F5F5' },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '10px',
      width: '100%',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      '& svg': {
        width: '20px',
        height: '20px',
      },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  // 결제수단 셀렉트 박스
  const payment: { value: string; label: string }[] = [
    { value: 'CASH', label: '현금' },
    { value: 'BANK_TRANSFER', label: '계좌이체' },
    { value: 'DEBIT_CARD', label: '체크카드' },
    { value: 'CREDIT_CARD', label: '신용카드' },
    { value: 'NAVER_PAY', label: '네이버페이' },
    { value: 'OTHER', label: '기타' },
  ];

  const editPaymentMethod = payment.filter(
    (options) => options.value === editData[0]?.paymentMethod
  );

  const [paymentMethod, setPaymentMethod] = useState<string | null>(
    editPaymentMethod[0]?.value || null
  );

  // 지출이면 수입 결제수단 null로 전송
  useEffect(() => {
    if (accountType === 'INCOME') {
      setPaymentMethod(null);
    }
    return setPaymentMethod(paymentMethod);
  }, [accountType, paymentMethod]);

  const paySelectCustom = {
    control: (provided: any, state: any) => ({
      ...provided,
      'marginTop': '20px',
      'width': '100%',
      'height': '48px',
      'borderRadius': '12px',
      'border': `2px solid ${state.isFocused ? '#FFD12E' : '#dfdfdf'}`,
      'fontSize': '14px',
      'paddingLeft': '10px',
      'cursor': 'pointer',
      '&:hover': {
        border: `2px solid ${state.isFocused ? '#FFD12E' : '#dfdfdf'}`,
      },
      'boxShadow': 'none',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      'backgroundColor': state.isSelected ? '#FFF3C7' : 'ffffff',
      'borderRadius': '5px',
      'color': state.isSelected ? 'black' : 'black',
      'fontSize': '14px',
      'paddingLeft': '14px',
      '&:hover': { backgroundColor: '#F5F5F5' },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '10px',
      width: '100%',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      '& svg': {
        width: '20px',
        height: '20px',
      },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  // AddAccountCalendar.tsx에서 받아온 날짜
  const [date, setOnDateChange] = useState('');

  const [expenditure, setExpenditure] = useState<string | null>(
    accountPriceInput || null
  );
  const [income, setIncome] = useState<string | null>(
    accountPriceInput || null
  );
  console.log(expenditure, income);

  // 지출, 수입 둘 중 하나가 null이면 inputValue를 해당 카테고리에 할당
  useEffect(() => {
    if (expenditureType === null) {
      setExpenditure(null);
      if (incomeType !== null && accountPriceInput !== '') {
        Number(setIncome(accountPriceInput));
      }
    } else if (incomeType === null) {
      if (expenditureType !== null && accountPriceInput !== '') {
        Number(setExpenditure(accountPriceInput));
      }
    }
  }, [expenditureType, incomeType, accountPriceInput]);

  // 거래내역 수정 완료 모달창 상태
  const [editDoneModal, setEditDoneModal] = useState(false);

  // 거래내역 수정
  const editAccountMutation = useMutation(
    async (requestData: {
      accountId: string;
      title: string;
      accountType: string;
      incomeType: string | null;
      expenditureType: string | null;
      paymentMethod: string | null;
      income: string | null;
      expenditure: string | null;
      date: string;
    }) => accounts.editAccount(id, requestData),
    {
      onSuccess: () => {
        console.log('거래내역 수정 성공');
      },
      onError: (error) => {
        console.log('거래내역 수정 실패:', error);
      },
    }
  );

  // 유효성 검사 에러 메세지
  const [priceError, setPriceError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [payError, setPayError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  useEffect(() => {
    if (accountPriceInput === '' || accountPriceInput === '0') {
      setPriceError(true);
    } else {
      setPriceError(false);
    }
  }, [accountPriceInput]);

  useEffect(() => {
    if (title === '' || title === null) {
      setTitleError(true);
    } else {
      setTitleError(false);
    }
  }, [title]);

  useEffect(() => {
    if (date === '') {
      setDateError(true);
    } else {
      setDateError(false);
    }
  }, [date]);

  useEffect(() => {
    if (paymentMethod === '' || paymentMethod === null) {
      setPayError(true);
    } else {
      setPayError(false);
    }
  }, [paymentMethod]);

  useEffect(() => {
    if (incomeType === null && expenditureType === null) {
      setCategoryError(true);
    } else {
      setCategoryError(false);
    }
  }, [incomeType, expenditureType]);

  const handleEdit = async () => {
    try {
      const requestData = {
        accountId: accountId || '', // 가계부 id 리코일 받기
        title: title || '',
        accountType: accountType || '',
        incomeType: incomeType || null,
        expenditureType: expenditureType || null,
        paymentMethod: paymentMethod || null,
        income: incomeType === '' ? null : accountPriceInput,
        expenditure: expenditureType === '' ? null : accountPriceInput,
        date: date || '',
      };

      if (priceError || titleError || dateError || payError || categoryError) {
        return;
      }

      await editAccountMutation.mutateAsync(requestData);
      console.log('거래내역 수정 요청 완료');
      setEditDoneModal(true);
    } catch (error) {
      console.log('거래내역 수정 실패:', error);
    }
  };

  return (
    <>
      {editDoneModal && <EditAccountDone />}
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        소비 / 수입 수정
      </Header>
      <div className="addAccountBg">
        <div className="addAccountBody">
          <div className="addAccountContents">
            <p className="addAccountContentsTitle">금액</p>
            <Input
              value={comma(accountPriceInput)}
              id="accountPriceInput"
              placeholder="얼마를 입력할까요?"
              className={showWarning ? 'accountPriceValid' : 'accountPrice'}
              onChange={accountPriceOnchange}
              onClear={handleAccountPriceInputClear}
            />
            <label
              htmlFor="nicknameInput"
              className={`cursor ${showWarning ? 'warning' : 'active'}`}
            >
              {' '}
            </label>
            {showWarning ? (
              <div className="warningBox">
                <RiErrorWarningFill className="warningIcon" />
                <p className="warningMsg">100원 이상 등록해주세요</p>
              </div>
            ) : null}
          </div>

          <div className="addAccountContents">
            <p className="addAccountContentsTitle">내용</p>
            <Input
              value={title}
              id="titleInput"
              placeholder="내용을 입력해주세요"
              className={showWarning ? 'accountPriceValid' : 'accountPrice'}
              onChange={handleTitleInputChange}
              onClear={handleTitleInputClear}
            />
            <label
              htmlFor="nicknameInput"
              className={`cursor ${showWarning ? 'warning' : 'active'}`}
            >
              {' '}
            </label>
            {titleError && (
              <div className="warningBox">
                <RiErrorWarningFill className="warningIcon" />
                <p className="warningMsg">내용을 확인해주세요</p>
              </div>
            )}
          </div>

          <div className="addAccountContents">
            <p className="addAccountContentsTitle">분류</p>
            <div className="addAccountRadioBoxes">
              <input
                type="radio"
                id="EXPENDITURE"
                checked={accountType === 'EXPENDITURE'}
                onClick={() => handleAccountType('EXPENDITURE')}
                className="addAccountRadioBtn"
              />
              <label htmlFor="EXPENDITURE">지출</label>

              <input
                type="radio"
                id="INCOME"
                checked={accountType === 'INCOME'}
                onClick={() => handleAccountType('INCOME')}
              />
              <label htmlFor="INCOME">수입</label>
            </div>
          </div>

          <div className="addAccountContents">
            <p className="addAccountContentsTitle">날짜</p>
            <AddAccountCalendar setOnDateChange={setOnDateChange} />
            {dateError && (
              <div className="warningBox">
                <RiErrorWarningFill className="warningIcon" />
                <p className="warningMsg">날짜를 확인해주세요</p>
              </div>
            )}
          </div>

          {accountType === 'INCOME' ? (
            ''
          ) : (
            <div className="addAccountContents">
              <p className="addAccountContentsTitle">결제수단</p>
              <Select
                placeholder="카테고리 선택"
                options={payment}
                onChange={(e: any) => setPaymentMethod(e.value)}
                styles={paySelectCustom}
                defaultValue={editPaymentMethod}
              />
              {payError && (
                <div className="warningBox">
                  <RiErrorWarningFill className="warningIcon" />
                  <p className="warningMsg">결제수단을 확인해주세요</p>
                </div>
              )}
            </div>
          )}

          <div className="addAccountContents">
            <p className="addAccountContentsTitle">카테고리</p>
            {accountType === 'INCOME' ? (
              <Select
                placeholder="카테고리 선택"
                options={inOptions}
                onChange={(e: any) => setIncomeType(e.value)}
                styles={inSelectCustom}
                defaultValue={editInOptions}
              />
            ) : (
              <Select
                placeholder="카테고리 선택"
                options={exOptions}
                onChange={(e: any) => setExpenditureType(e.value)}
                styles={exSelectCustom}
                defaultValue={editExOptions}
              />
            )}
            {categoryError && (
              <div className="warningBox">
                <RiErrorWarningFill className="warningIcon" />
                <p className="warningMsg">카테고리를 확인해주세요</p>
              </div>
            )}
          </div>

          {priceError ||
          titleError ||
          dateError ||
          payError ||
          categoryError ? (
            <div className="errorMessage">작성 내용을 다시 확인해주세요!</div>
          ) : (
            ''
          )}

          <button
            className="addAccountDoneBtn"
            type="button"
            onClick={handleEdit}
          >
            등록하기
          </button>
        </div>
      </div>
    </>
  );
}

export default EditAccount;
