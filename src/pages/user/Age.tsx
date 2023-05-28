/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-alert */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { FaChevronLeft } from "react-icons/fa";
import { useRecoilState } from 'recoil';
import { Button, Input } from '../../components/index';
import inputState from '../../shared/Atom';
import '../../styles/pages/_Age.scss';
import { useQuery, useMutation, useQueryClient } from "react-query";
import instance from '../../api/instance';
import { getNickNameDoubleCheck } from '../../api/members';
import { useNavigate } from 'react-router';

function Age() {
    const [inputValue, setInputValue] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [nextButton, setNextButton] = useState(false);
    const modalHandler = () => {
        setModalOpen(!modalOpen);
    }
    const { isLoading, isError, data } = useQuery(
        ["nickname", inputValue],
        () => getNickNameDoubleCheck(inputValue)
    );
    console.log("data = ", data)


    const nicknameChangeHandler = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputValue(e.target.value)
        setNextButton(!nextButton)
        if (e.target.value.length > 2) {
            alert("너무 많습니다")
            setInputValue("");
        }
    }
    // 
    const ageButtonHandler = (event: string) => {
        const value = (inputValue + event)
        setInputValue(value)
        if (inputValue.length > 1) {
            alert("너무 많습니다")
            setInputValue("");
        }
    }
    const ageRemoveButtonHandler = (event: string) => {
        const value = inputValue.slice(0, -1)
        setInputValue(value)
    }
    const navigate = useNavigate();
    return (
        <main className='AgePage'>
            <div className='between'>
                <button type='button' onClick={() => navigate("/nickname")}>
                    <FaChevronLeft className='ArrowBackground' />
                </button>
                <article>
                    <h1>나이를 알려주세요.</h1>
                    <div className='ageInfo'>나이, 성별 등 개인정보는 소셜 기능에 사용돼요.</div>
                    <div className='nicknameForm'>
                        <Input
                            value={inputValue}
                            id='nicknameInput'
                            placeholder='나이를 입력하세요'
                            className='nickname'
                            onChange={nicknameChangeHandler}
                        />
                        <label htmlFor='nicknameInput' className={`nicknameLabel ${inputValue.length > 0 ? 'active' : ''}`}>나이</label>
                        <label htmlFor='nicknameInput' className={`cursor ${inputValue.length > 0 ? 'active' : ''}`}> </label>
                        <label htmlFor='nicknameInput' className={`nicknameValidationAlert ${inputValue.length > 0 ? 'active' : ''}`}>
                            ※ 욕설 및 성희롱을 연상하게 하는 이름은 쓸 수 없어요.
                        </label>
                    </div>
                </article>
            </div>
            <div>
                {nextButton ? <button className='common' type='button' onClick={() => navigate("/gender")}>다음</button>
                    : <button className='common' type='button' onClick={() => alert("나이를 입력해주세요")}>다음</button>
                }

                {modalOpen ? <div className='ageNumberBox'>
                    <div className='ageNumberBoxs'>
                        <button className='ageNumber' type='button' onClick={() => ageButtonHandler("1")}>1</button>
                        <button className='ageNumber' type='button' onClick={() => ageButtonHandler("2")}>2</button>
                        <button className='ageNumber' type='button' onClick={() => ageButtonHandler("3")}>3</button>
                        <button className='ageNumber' type='button' onClick={() => ageButtonHandler("4")}>4</button>
                        <button className='ageNumber' type='button' onClick={() => ageButtonHandler("5")}>5</button>
                        <button className='ageNumber' type='button' onClick={() => ageButtonHandler("6")}>6</button>
                        <button className='ageNumber' type='button' onClick={() => ageButtonHandler("7")}>7</button>
                        <button className='ageNumber' type='button' onClick={() => ageButtonHandler("8")}>8</button>
                        <button className='ageNumber' type='button' onClick={() => ageButtonHandler("9")}>9</button>
                        <button className='ageNumber2' type='button' onClick={modalHandler}>.</button>
                        <button className='ageNumber' type='button' onClick={() => ageButtonHandler("0")}>0</button>
                        <button className='ageNumber2' type='button' onClick={() => ageRemoveButtonHandler("아무거나 넣었습니다")}>지우기</button>
                    </div>
                </div>
                    : <button className='ageNumber3' type='button' onClick={modalHandler}>.</button>
                }

            </div>
        </main>
    );
}

export default Age;
