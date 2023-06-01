import React, { useState } from 'react';
import { BsChevronLeft } from 'react-icons/bs';
import '../../styles/pages/_AddAccount.scss';
import { useNavigate } from 'react-router';
import Select from 'react-select';
import { Input } from '../../components';
import AddAccountCalendar from '../../components/elements/AddAccountCalendar';

function AddAccount(): JSX.Element {
  const navigate = useNavigate();

  // 금액 입력
  const [accountPriceInput, setAccountPriceInput] = useState('');

  const accountPriceOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountPriceInput(event.target.value);
  };

  // 수입 지출 분류 선택
  const [radio, setRadio] = useState('radioEx');

  const handleRadio = (radioId: string): void => {
    setRadio(radioId);
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

  const [selectInValue, setSelectInValue] = useState('');
  console.log('선택:', selectInValue);

  const inSelectCustom = {
    control: (provided: any, state: any) => ({
      ...provided,
      'marginTop': '20px',
      'width': '320px',
      'height': '48px',
      'borderRadius': '12px',
      'border': `2px solid ${state.isFocused ? '#FFD12E' : '#e8e8e8'}`,
      'fontSize': '14px',
      'paddingLeft': '10px',
      'cursor': 'pointer',
      '&:hover': {
        border: `2px solid ${state.isFocused ? '#FFD12E' : '#e8e8e8'}`,
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
      width: '320px',
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

  const [selectExValue, setSelectExValue] = useState('');
  console.log('선택:', selectExValue);

  const exSelectCustom = {
    control: (provided: any, state: any) => ({
      ...provided,
      'marginTop': '20px',
      'width': '320px',
      'height': '48px',
      'borderRadius': '12px',
      'border': `2px solid ${state.isFocused ? '#FFD12E' : '#e8e8e8'}`,
      'fontSize': '14px',
      'paddingLeft': '10px',
      'cursor': 'pointer',
      '&:hover': {
        border: `2px solid ${state.isFocused ? '#FFD12E' : '#e8e8e8'}`,
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
      width: '320px',
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

  return (
    <div className="addAccountBg">
      <div className="header">
        <button
          type="button"
          className="headerPreBtn"
          onClick={() => navigate('/account')}
        >
          <BsChevronLeft />
        </button>
        <div className="headerTitle">
          <h2 className="headerTitleH2">소비 / 수입 등록</h2>
        </div>
      </div>

      <div className="addAccountBody">
        <div className="addAccountContents">
          <p className="addAccountContentsTitle">금액</p>
          <Input
            value={accountPriceInput}
            id="accountPriceInput"
            placeholder="얼마를 입력할까요?"
            className="accountPrice"
            onChange={accountPriceOnchange}
          />
        </div>

        <div className="addAccountContents">
          <p className="addAccountContentsTitle">분류</p>
          <div className="addAccountRadioBox">
            <div className="addAccountRadioBox">
              <input
                type="radio"
                id="radioEx"
                checked={radio === 'radioEx'}
                onClick={() => handleRadio('radioEx')}
                className="addAccountRadioBtn"
              />
              <label htmlFor="radioEx">지출</label>
            </div>

            <div className="addAccountRadioBox">
              <input
                type="radio"
                id="radioIn"
                checked={radio === 'radioIn'}
                onClick={() => handleRadio('radioIn')}
              />
              <label htmlFor="radioIn">수입</label>
            </div>
          </div>
        </div>

        <div className="addAccountContents">
          <p className="addAccountContentsTitle">날짜</p>
          <AddAccountCalendar />
        </div>

        <div className="addAccountContents">
          <p className="addAccountContentsTitle">결제수단</p>
          <span>사용자가 등록한 결제수단 목록</span>
        </div>

        <div className="addAccountContents">
          <p className="addAccountContentsTitle">카테고리</p>
          {radio === 'radioIn' ? (
            <Select
              placeholder="카테고리 선택"
              options={inOptions}
              onChange={(e: any) => setSelectInValue(e.value)}
              styles={inSelectCustom}
            />
          ) : (
            <Select
              placeholder="카테고리 선택"
              options={exOptions}
              onChange={(e: any) => setSelectExValue(e.value)}
              styles={exSelectCustom}
            />
          )}
        </div>
        <button className="addAccountDoneBtn" type="button">
          등록하기
        </button>
      </div>
    </div>
  );
}

export default AddAccount;
