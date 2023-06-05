import instance from './instance';

// 가계부 조회
const getAccount = async () => {
  try {
    const response = await instance.get('/accounts');
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 가계부 추가
export const addAccount = async (title: string) => {
  try {
    const response = await instance.post('/account', { title });
    console.log('가계부 추가 성공:', response);
    return response.data;
  } catch (error) {
    console.log('가계부 추가 실패:', error);
    throw error;
  }
};

export default { getAccount, addAccount };
