/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import instance from "./instance";

// 닉네임 중복체크 
const getNickNameDoubleCheck = async (nickname: string): Promise<React.MouseEvent<HTMLButtonElement>> => {
    try {
        const response = await instance.get(`/users`, {
            params: {
                userid: nickname,
            },
        });
        return response.data;
    } catch (err) {
        console.log(`닉네임 불러오는 API 오류 발생: ${err}`);
        throw err;
    }
};

export { getNickNameDoubleCheck };
