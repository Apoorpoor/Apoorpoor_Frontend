import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/_Account.scss';
import {
  AiOutlineLeft,
  AiFillCaretLeft,
  AiFillCaretRight,
} from 'react-icons/ai';
import { BsFillPenFill } from 'react-icons/bs';
import { Controller } from '../../components';

function Account() {
  const navigate = useNavigate();

  return (
    <>
      <Controller />

      <div className="_AccountBackground">
        <div className="header">
          <button
            type="button"
            className="preBtn"
            onClick={() => navigate('/')}
          >
            <AiOutlineLeft />
          </button>

          <div className="month">
            <button type="button">
              <AiFillCaretLeft />
            </button>

            <h1>5월</h1>

            <button type="button">
              <AiFillCaretRight />
            </button>
          </div>
        </div>

        <button type="button" className="_AccountName">
          <span>가계부 이름</span> <BsFillPenFill />
        </button>

        <div className="total">
          <p>이번달 모은 금액</p>
          <p className="totalMoney">20,000원</p>
        </div>

        <div className="incmExpnd">
          <p>
            수입 <span className="incm">80,000원</span>
          </p>
          <p>
            지출 <span className="expnd">60,000원</span>
          </p>
        </div>
      </div>

      <div className="line"> </div>
    </>
  );
}

export default Account;
