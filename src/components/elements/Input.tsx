import React from 'react';
import { useRecoilState } from 'recoil';
import { IoIosCloseCircle } from 'react-icons/io';
import '../../styles/components/_Input.scss';
import inputState from '../../shared/Atom';

type InputType = {
  value: string;
  id: string;
  placeholder: string;
  className: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({ value, id, placeholder, className, onChange }: InputType) {
  const [inputValue, setInputValue] = useRecoilState(inputState);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    // 이 onChange는 부모로부터 받은 onChange함수이고 event객체를 부모의 onChangeHandler로 전달한다.
    onChange(event);
  };

  const clearInputValue = () => {
    setInputValue('');
    onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="inputArea">
      <input
        type="text"
        id={id}
        value={value}
        placeholder={placeholder}
        className={`${className} ${inputValue.length > 0 ? 'active' : ''}`}
        onChange={inputChangeHandler}
      />

      <label
        htmlFor={id}
        className={`clearInput ${inputValue.length > 0 ? 'active' : ''}`}
      >
        <button type="button" id={id} onClick={clearInputValue}>
          <IoIosCloseCircle />
        </button>
      </label>
    </div>
  );
}

export default Input;
