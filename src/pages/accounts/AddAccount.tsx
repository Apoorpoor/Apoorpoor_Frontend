import React, { useEffect, useRef, useState } from 'react';
import { RiErrorWarningFill } from 'react-icons/ri';
import '../../styles/pages/_AddAccount.scss';
import { useNavigate, useParams } from 'react-router';
import { useSetRecoilState } from 'recoil';
import Select from 'react-select';
import { useMutation } from 'react-query';
import { Header, Input } from '../../components';
import { messageState, categoryState, pointState } from '../../shared/Atom';
import AddAccountCalendar from '../../components/elements/AddAccountCalendar';
import accounts from '../../api/accounts';

function AddAccount(): JSX.Element {
  const navigate = useNavigate();

  // 현재 가계부의 id 조회
  const { id } = useParams<{ id: string | undefined }>();

  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(`/account/${id}`);
  };

  const priceRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (priceRef.current) {
      priceRef.current.focus();
    }
  }, []);

  // 금액 입력
  const [accountPriceInput, setAccountPriceInput] = useState('');

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
    const str = value.replaceAll(',', '');
    setAccountPriceInput(str);
  };

  // 엑스 버튼 누르면 금액 삭제
  const handleAccountPriceInputClear = () => {
    setTimeout(() => {
      setAccountPriceInput('');
    }, 0);
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
  const [title, setTitle] = useState('');

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
  const [accountType, setAccountType] = useState('EXPENDITURE');

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

  const [incomeType, setIncomeType] = useState<string | null>(null);

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

  const [expenditureType, setExpenditureType] = useState<string | null>(null);

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

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

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

  const [expenditure, setExpenditure] = useState<string | null>(null);
  const [income, setIncome] = useState<string | null>(null);

  // 지출, 수입 둘 중 하나가 null이면 inputValue를 해당 카테고리에 할당
  useEffect(() => {
    if (expenditureType === null) {
      setExpenditure(null);
      if (incomeType !== null && accountPriceInput !== '') {
        setIncome(accountPriceInput);
      }
    } else if (incomeType === null) {
      if (expenditureType !== null && accountPriceInput !== '') {
        setExpenditure(accountPriceInput);
      }
    }
  }, [expenditureType, incomeType, accountPriceInput]);

  // 거래내역 추가 후, 카테고리별 랜덤
  const setCategory = useSetRecoilState(categoryState);
  // 거래내역 추가 후, 랜덤 메시지 완료 페이지로 전달
  const setMessage = useSetRecoilState(messageState);
  // 거래내역 추가 후, 획득 포인트 완료 페이지로 전달
  const setPoint = useSetRecoilState(pointState);

  // 거래내역 추가
  const addAccountMutation = useMutation(
    (requestData: {
      accountId: string;
      title: string;
      accountType: string;
      incomeType: string | null;
      expenditureType: string | null;
      paymentMethod: string | null;
      income: string | null;
      expenditure: string | null;
      date: string;
    }) => accounts.addAccount(requestData),
    {
      onSuccess: (response) => {
        console.log('거래내역 추가 성공:', response);
        if (accountType === 'INCOME') {
          setCategory('INCOME');
        }
        if (accountType === 'EXPENDITURE') {
          if (expenditureType === 'SAVINGS') {
            setCategory('SAVINGS');
          } else {
            setCategory('ELSE');
          }
        }
        setMessage(response.meassage);
        setPoint(response.point);
      },
      onError: (error) => {
        console.log('거래내역 추가 실패:', error);
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
    if (accountType === 'EXPENDITURE') {
      if (paymentMethod === '' || paymentMethod === null) {
        setPayError(true);
      } else {
        setPayError(false);
      }
    }
    if (accountType === 'INCOME') {
      setPayError(false);
    }
  }, [accountType, paymentMethod]);

  useEffect(() => {
    if (incomeType === null && expenditureType === null) {
      setCategoryError(true);
    } else {
      setCategoryError(false);
    }
  }, [incomeType, expenditureType]);

  console.log(
    '에러:::',
    '금액:',
    priceError,
    '내용:',
    titleError,
    '날짜:',
    dateError,
    '결제수단:',
    payError,
    '카테고리:',
    categoryError
  );
  console.log('날짜!!!!', date);

  const handleRegister = async () => {
    try {
      const requestData = {
        accountId: id || '',
        title: title || '',
        accountType: accountType || '',
        incomeType: incomeType || null,
        expenditureType: expenditureType || null,
        paymentMethod: paymentMethod || null,
        income: incomeType === '' ? null : income,
        expenditure: expenditureType === '' ? null : expenditure,
        date: date || '',
      };

      if (priceError || titleError || dateError || payError || categoryError) {
        return;
      }

      await addAccountMutation.mutateAsync(requestData);
      console.log('거래내역 추가 요청 완료');
      setAccountPriceInput('');
      setTitle('');
      navigate(`/addAccountDone/${id}`);
    } catch (error) {
      console.log('거래내역 추가 실패:', error);
    }
  };

  return (
    <>
      <Header navigateToPreviousPage={navigateToPreviousPage}>
        소비 / 수입 등록
      </Header>
      <div className="addAccountBg">
        <div className="addAccountBody">
          <div className="addAccountContents">
            <p ref={priceRef} className="addAccountContentsTitle">
              금액
            </p>
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
            {showWarning || priceError ? (
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
              />
            ) : (
              <Select
                placeholder="카테고리 선택"
                options={exOptions}
                onChange={(e: any) => setExpenditureType(e.value)}
                styles={exSelectCustom}
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
            onClick={handleRegister}
          >
            등록하기
          </button>
        </div>
      </div>
    </>
  );
}

export default AddAccount;
