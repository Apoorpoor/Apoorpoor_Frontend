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

// (메인) 가계부 삭제
export const delAccountList = async (id: string) => {
  try {
    const response = await instance.delete(`/accounts/${id}`);
    console.log('가계부 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.log('가계부 삭제 실패:', error);
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

// (상세) 가계부 이름 수정
export const editAccountName = async (id: string, title: string) => {
  try {
    const response = await instance.patch(`/accounts/${id}`, { title });
    console.log('가계부 이름 수정 성공:', response.data);
    return response.data;
  } catch (error) {
    console.log('가계부 이름 수정 실패:', error);
    throw error;
  }
};

// (상세 -> 일자별) 거래내역 조회
const getAccountsDate = async (id: string, selectedDate: string) => {
  try {
    const response = await instance.get(
      `/accounts/${id}/status?date=${selectedDate}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// (상세 -> 일자별) 거래내역 추가
export const addAccount = async (requestData: {
  accountId: string;
  title: string;
  accountType: string;
  incomeType: string;
  expenditureType: string;
  paymentMethod: string;
  income: number;
  expenditure: number;
  dateTime: string;
}) => {
  try {
    const response = await instance.post('/ledgerhistory', requestData);
    console.log('거래내역 추가 성공:', response.data);
    return response.data;
  } catch (error) {
    console.log('거래내역 추가 실패:', error);
    throw error;
  }
};

export default {
  getAccountList,
  addAccountList,
  delAccountList,
  getAccount,
  editAccountName,
  getAccountsDate,
  // addAccount,
};
