import React, { useState } from 'react';
// import { useRecoilState } from 'recoil';
import { IoIosCloseCircle } from 'react-icons/io';
import '../../styles/components/_Input.scss';
// import inputState from '../../shared/Atom';

type InputType = {
  value: string;
  id: string;
  placeholder: string;
  className: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
};

function Input({
  value,
  id,
  placeholder,
  className,
  onChange,
  onClear = () => {},
}: InputType) {
  const [inputValue, setInputValue] = useState(value);
  // const [inputValue, setInputValue] = useRecoilState(inputState);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    // // 이 onChange는 부모로부터 받은 onChange함수이고 event객체를 부모의 onChangeHandler로 전달한다.
    onChange(event);
  };
  const clearInputValue = () => {
    onClear?.();
    setInputValue('');
    onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleClearButtonClick = () => {
    clearInputValue();
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

      {inputValue.length > 0 && (
        <label htmlFor={id} className="clearInput active">
          <button type="button" onClick={handleClearButtonClick}>
            <IoIosCloseCircle />
          </button>
        </label>
      )}
    </div>
  );
}

Input.defaultProps = {
  onClear: () => {},
};

export default Input;
