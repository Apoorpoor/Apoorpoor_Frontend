import React, { useState } from 'react';
import '../../styles/pages/_Main.scss';
import { FaPlus } from 'react-icons/fa';

function Main() {
  const [account, setAccount] = useState(false);
  console.log(setAccount);
  return (
    <div className="background">
      <div className="title">
        <p>내 가계부</p>
        <h1>{!account ? '가계부를 만들어주세요' : '60,000원'}</h1>
      </div>

      {!account ? null : (
        <div className="accountList">
          <p>
            가계부 <span>3</span>
          </p>

          <div className="account">
            <div>
              <p className="accountName">가계부 이름</p>
              <p className="accountMoney">20,000원</p>
            </div>
            <div className="goAccountBtn">자세히</div>
          </div>

          <div className="account">
            <div>
              <p className="accountName">가계부 이름</p>
              <p className="accountMoney">20,000원</p>
            </div>
            <div className="goAccountBtn">자세히</div>
          </div>

          <div className="account">
            <div>
              <p className="accountName">가계부 이름</p>
              <p className="accountMoney">20,000원</p>
            </div>
            <div className="goAccountBtn">자세히</div>
          </div>
        </div>
      )}

      <div className="addAccountBtn">
        가계부 추가
        <div className="addAccountPlusBtn">
          <FaPlus />
        </div>
      </div>
    </div>
  );
}

export default Main;
