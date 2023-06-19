/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { FaChevronLeft, FaCheckSquare } from 'react-icons/fa';
import '../../styles/pages/_Gender.scss';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import male from '../../static/image/gender/male.svg';
import female from '../../static/image/gender/female.svg';
import { UserAge, UserGender, UserNickname } from '../../shared/JoinUserInfo';
import { Button } from '../../components';
import { postNickname, putAge, putGender } from '../../api/members';

interface ErrorType extends Error {
  response: {
    data: {
      message: string;
      code: number;
    };
    status: number;
  };
}

function Age() {
  const [malecheck, setMalecheck] = React.useState(false);
  const [femalecheck, setFemalecheck] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [userNickname, setUserNickname] = useRecoilState(UserNickname);
  const [userAge, setUserAge] = useRecoilState(UserAge);
  const [userGender, setUserGender] = useRecoilState(UserGender);

  const navigate = useNavigate();

  const malegenderHandler = () => {
    setMalecheck(!malecheck);
    setFemalecheck(false);
    setChecked(false);
    setUserGender('male');
  };
  const femalegenderHandler = () => {
    setFemalecheck(!femalecheck);
    setMalecheck(false);
    setChecked(false);
    setUserGender('female');
  };
  const CheckBoxHandler = () => {
    setChecked(!checked);
    setMalecheck(false);
    setFemalecheck(false);
    setUserGender('기타');
  };

  const onNextClickButton = async () => {
    try {
      await postNickname(userNickname);
      await putAge(userAge);
      await putGender(userGender);
      navigate('/finished');
    } catch (error) {
      if (userNickname === '') {
        alert('닉네임이 입력되지 않았습니다.');
      } else if (userGender === '') {
        alert('성별이 입력되지 않았습니다.');
      }
      if ((error as ErrorType).response.status === 400) {
        alert(
          '이미 카카오톡 회원가입이 등록된 유저입니다. 로그인을 진행해주세요'
        );
      }
    }
  };

  console.log(
    'userNickname =',
    userNickname,
    'userAge =',
    userAge,
    'userGender =',
    userGender
  );

  return (
    <main className="genderPage">
      <article>
        <div>
          <button type="button" onClick={() => navigate('/age')}>
            <FaChevronLeft className="ArrowBackground" />
          </button>
          <h1>성별은 어떻게 되시나요?</h1>
        </div>
        <div className="GenderBox">
          {malecheck ? (
            <button
              type="button"
              className="genderButton2"
              onClick={malegenderHandler}
            >
              <img src={male} alt="남자" />
              남자
            </button>
          ) : (
            <button
              type="button"
              className="genderButton1"
              onClick={malegenderHandler}
            >
              <img src={male} alt="남자" />
              남자
            </button>
          )}
          {femalecheck ? (
            <button
              type="button"
              className="genderButton2"
              onClick={femalegenderHandler}
            >
              <img src={female} alt="여자" />
              여자
            </button>
          ) : (
            <button
              type="button"
              className="genderButton1"
              onClick={femalegenderHandler}
            >
              <img src={female} alt="여자" />
              여자
            </button>
          )}
        </div>
        <div className="genderFreeBox">
          {checked ? (
            <div className="CheckBox2">
              기타
              <FaCheckSquare
                className="CheckBoxPoint2"
                onClick={CheckBoxHandler}
              />
            </div>
          ) : (
            <div className="CheckBox1">
              기타
              <FaCheckSquare
                className="CheckBoxPoint1"
                onClick={CheckBoxHandler}
              />
            </div>
          )}
        </div>
      </article>

      <div>
        <Button
          className="common"
          disabled={
            checked === false && femalecheck === false && malecheck === false
          }
          onClick={() => {
            onNextClickButton();
          }}
        >
          다음
        </Button>
      </div>
    </main>
  );
}

export default Age;
