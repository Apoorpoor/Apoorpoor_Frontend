import React, { useState } from 'react';
import { BsChevronLeft } from 'react-icons/bs';
import '../../styles/pages/_AddAccount.scss';
import { useNavigate } from 'react-router';
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
  console.log('라디오버튼:', radio);

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
          <div className="addAccountRadio">
            <input
              type="radio"
              id="radioEx"
              checked={radio === 'radioEx'}
              onClick={() => handleRadio('radioEx')}
            />
            <label htmlFor="radioEx">지출</label>
            <input
              type="radio"
              id="radioIn"
              checked={radio === 'radioIn'}
              onClick={() => handleRadio('radioIn')}
            />
            <label htmlFor="radioIn">수입</label>
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
          <span>지출 수입에 따른 카테고리</span>
        </div>
      </div>
    </div>
  );
}

export default AddAccount;
