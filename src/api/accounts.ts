import instance from './instance';

// (메인) 가계부 조회
const getAccountList = async () => {
  try {
    const response = await instance.get('/accounts');
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// (메인) 가계부 추가
export const addAccountList = async (title: string) => {
  try {
    const response = await instance.post('/account', { title });
    console.log('가계부 추가 성공:', response.data);
    return response.data;
  } catch (error) {
    console.log('가계부 추가 실패:', error);
    throw error;
  }
};

// (상세) 거래내역 조회
const getAccount = async (id: string) => {
  try {
    const response = await instance.get(`/accounts/${id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { getAccountList, addAccountList, getAccount };
