import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/_Main.scss';
import { FaPlus } from 'react-icons/fa';
// import instance from '../../api/instance';
import { Controller } from '../../components';

function Main(): JSX.Element {
  const navigate = useNavigate();

  const [account, setAccount] = useState(false);

  const [accountNumber, setAccountNumber] = useState(0);

  const addAccountHandler = (): void => {
    setAccount(true);
    setAccountNumber(accountNumber + 1);
  };
  return (
    <>
      <Controller />
      <div className="background">
        <div className="title">
          <p>내 가계부</p>
          <h1>{!account ? '가계부를 만들어주세요' : '20,000원'}</h1>
        </div>

        {!account ? null : (
          <div className="accountList">
            <p>
              가계부 <span>{accountNumber}</span>
            </p>

            <div className="account">
              <div>
                <p className="accountName">가계부 이름</p>
                <p className="accountMoney">20,000원</p>
              </div>
              <button
                type="button"
                className="goAccountBtn"
                onClick={() => navigate('/account')}
              >
                자세히
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className="addAccountBtn"
          onClick={addAccountHandler}
        >
          가계부 추가
          <div className="addAccountPlusBtn">
            <FaPlus />
          </div>
        </button>
      </div>
    </>
  );
}

export default Main;
