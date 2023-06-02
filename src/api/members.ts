/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import instance from "./instance";

// 닉네임 중복체크 
const getNickNameDoubleCheck = async (nickname: string): Promise<React.MouseEvent<HTMLButtonElement>> => {
    try {
        const response = await instance.post(`/beggar`, { nickname });
        return response.data;
    } catch (err) {
        console.log(`닉네임 불러오는 API 오류 발생: ${err}`);
        throw err;
    }
};

const firstLogin = async () => {

    const navigate = useNavigate();
    console.log("로그인 api 실행")
    const url = new URL(window.location.href);
    const urlCode = url.searchParams.get('code');

    try {
        console.log("try 실행")
        await instance.post(`/kakao?code=${urlCode}`).then((response) => {
            const accessToken = response.headers.Authorization;
            // const aToken = accessToken.split(" ")[1];
            console.log("response = ", response);
            //     // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

            const refreshToken = response.headers['Authorization_refresh']
            // const rToken = refreshToken.split(" ")[1];
            localStorage.setItem('AToken', accessToken);
            Cookies.set('RToken', refreshToken, { expires: 7 });

            alert("로그인 성공");
            navigate(`/nickname`);

            return { response };

        })
    } catch (err) {
        console.log(`로그인 중 API 오류 발생: ${err}`);
        throw err;
    }
}
const getUser = async () => {
    // 토큰
    const token = localStorage.getItem("AToken");
    try {
        const response = await instance.get(`/beggar`,
            {
                headers: {
                    ACCESS_KEY: `Bearer ${token}`,
                },
            });
        return response.data;

    } catch (err) {
        console.log(`거지조회  API 오류 발생: ${err}`);
        throw err;
    }
}

export { getNickNameDoubleCheck, firstLogin, getUser };
