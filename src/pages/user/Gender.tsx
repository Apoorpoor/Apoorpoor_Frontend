import React from 'react';
import { FaChevronLeft, FaCheckSquare } from 'react-icons/fa';
import '../../styles/pages/_Gender.scss';
import { useNavigate } from 'react-router';
// import { useQuery, useMutation, useQueryClient } from "react-query";
import instance from '../../api/instance';
import male from '../../static/image/gender/male.svg';
import female from '../../static/image/gender/female.svg';

function Age() {
  const [inputValue, setInputValue] = React.useState('');
  const [malecheck, setMalecheck] = React.useState(false);
  const [femalecheck, setFemalecheck] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  const token = localStorage.getItem('AToken');

  const navigate = useNavigate();

  const malegenderHandler = () => {
    setMalecheck(!malecheck);
    setFemalecheck(false);
    setChecked(false);
    setInputValue('male');
  };
  const femalegenderHandler = () => {
    setFemalecheck(!femalecheck);
    setMalecheck(false);
    setChecked(false);
    setInputValue('female');
  };
  const CheckBoxHandler = () => {
    setChecked(!checked);
    setMalecheck(false);
    setFemalecheck(false);
    setInputValue('기타');
  };

  const onNextClickButton = async () => {
    try {
      const response = await instance.put(
        `/user/gender`,
        {
          gender: inputValue,
        },
        {
          headers: {
            ACCESS_KEY: `Bearer ${token}`,
          },
        }
      );
      navigate('/finished');
      return response.data;
    } catch (err) {
      console.log(`나이입력  API 오류 발생: ${err}`);
      throw err;
    }
  };

  return (
    <main className="genderPage">
      <div>
        <button type="button" onClick={() => navigate('/age')}>
          <FaChevronLeft className="ArrowBackground" />
        </button>
        <h1>성별은 어떻게 되시나요?</h1>
      </div>
      <article>
        <div>
          {malecheck ? (
            <button
              type="button"
              className="genderButton2"
              onClick={malegenderHandler}
            >
              <img src={male} alt="남자" />
            </button>
          ) : (
            <button
              type="button"
              className="genderButton1"
              onClick={malegenderHandler}
            >
              <img src={male} alt="남자" />
            </button>
          )}
          {femalecheck ? (
            <button
              type="button"
              className="genderButton2"
              onClick={femalegenderHandler}
            >
              <img src={female} alt="여자" />
            </button>
          ) : (
            <button
              type="button"
              className="genderButton1"
              onClick={femalegenderHandler}
            >
              <img src={female} alt="여자" />
            </button>
          )}
        </div>
        <div>
          {checked ? (
            <div className="CheckBox2">
              기타
              {/* eslint-disable-next-line react/jsx-no-bind */}
              <FaCheckSquare
                className="CheckBoxPoint2"
                onClick={CheckBoxHandler}
              />
            </div>
          ) : (
            <div className="CheckBox1">
              기타
              {/* eslint-disable-next-line react/jsx-no-bind */}
              <FaCheckSquare
                className="CheckBoxPoint1"
                onClick={CheckBoxHandler}
              />
            </div>
          )}
        </div>
      </article>

      <div>
        {checked || femalecheck || malecheck ? (
          <button className="common" type="button" onClick={onNextClickButton}>
            다음
          </button>
        ) : (
          <button
            className="common"
            type="button"
            onClick={() => alert('성별을 입력해주세요')}
          >
            다음
          </button>
        )}
      </div>
    </main>
  );
}

export default Age;
