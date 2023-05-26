import React from 'react';
import { useRecoilState } from 'recoil';
import { Button, Input } from '../../components/index';
import inputState from '../../shared/Atom';
import '../../styles/pages/_Nickname.scss';

function Nickname() {
  const [inputValue, setInputValue] = useRecoilState(inputState);
  const nicknameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }; 

  
  return (
    <main className='Nickname'>
      <article>
        <h1>가입을 축하드려요!<br />푸어의 이름을 지어주세요.</h1>
        <div className='nicknameForm'>
          <Input 
            value={inputValue}
            id='nicknameInput' 
            placeholder='닉네임을 입력하세요' 
            className='nickname'
            onChange={nicknameChangeHandler}
          />
          <label htmlFor='nicknameInput' className={`nicknameLabel ${inputValue.length > 0 ? 'active' : ''}`}>닉네임</label>
          <label htmlFor='nicknameInput' className={`cursor ${inputValue.length > 0? 'active' : ''}`}> </label>
          <label htmlFor='nicknameInput' className={`nicknameValidationAlert ${inputValue.length > 0? 'active' : ''}`}>
          ※ 욕설 및 성희롱을 연상하게 하는 이름은 쓸 수 없어요.
          </label>
        </div>
      </article>
      
      <Button className='common'>
        다음
      </Button>
    </main>
    );
}

export default Nickname;
