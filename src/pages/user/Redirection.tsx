/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/function-component-definition */
/* eslint-disable import/no-extraneous-dependencies */

import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Redirection: React.FC = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const getAccessToken = async (urlCode: string): Promise<void> => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login?code=${urlCode}`
                    // , {urlCode}
                );
                const { accessToken } = response.headers.Authorization.split(" ")[1];
                const refreshToken = response.headers['Authorization-Refresh'].split(" ")[1];
                localStorage.setItem('ACC_Token', accessToken);
                Cookies.set('REF_Token', refreshToken, { expires: 7 });
                alert("로그인 성공");
                navigate(`/nickname`);
            } catch (error) {
                // 에러 처리
                console.log(error);
            }
        };


        const url = new URL(window.location.href);
        const urlCode = url.searchParams.get('code');
        if (urlCode) {
            getAccessToken(urlCode);
        }
    }, [navigate]);

    return (
        <div>
            <h1>로그인 중입니다</h1>
        </div>
    );
};

export default Redirection;

// =================================
// /* eslint-disable no-console */
// /* eslint-disable no-alert */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react/react-in-jsx-scope */
// /* eslint-disable no-restricted-globals */
// /* eslint-disable react/function-component-definition */
// import { useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";

// const Redirection: React.FC = () => {

//     const navigate = useNavigate();
//     const code = new URL(window.location.href).searchParams.get("code");
//     useEffect(() => {
//         console.log(process.env.REACT_APP_SERVER_URL);
//         axios.post(`${process.env.REACT_APP_SERVER_URL}/login?code=${code}`, {
//             headers: {
//               "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
//             },
//           })
//             .then(response => {
//                 const { accessToken } = response.data;
//                 const { refreshtoken } = response.data;

//                 // 모든 API 호출에 accessToken을 요청 헤더에 설정합니다
//                 axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//                 axios.defaults.headers.common.AuthorizationRefresh = `Bearer ${refreshtoken}`;

//                 // localStorage, 쿠키 등에 accessToken을 저장하지 않습니다.

//             }).catch(error => {
//                 // ... 에러 처리
//                 console.log(error);
//             });

//         alert("로그인 성공");
//         navigate("/nickname")
//     }, [history]);

//     return (
//         <div>
//             <h1>리다이렉션 페이지</h1>
//             {/* 리다이렉션 로직을 여기에 추가하세요 */}
//         </div>
//     );
// };

// export default Redirection;
