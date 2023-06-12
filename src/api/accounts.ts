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

// (상세) 월별 수입/지출 금액, 일별 수입/지출 금액
const getTotalMonthDate = async (id: string, currentMonth: string) => {
  try {
    const response = await instance.get(
      `/accounts/${id}/totalStatus?date=${currentMonth}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// (상세) 이번달 상세 지출 내역 파이그래프
const getMonthPieChart = async (id: string, currentMonth: string) => {
  try {
    const response = await instance.get(
      `/accounts/${id}/statistics?date=${currentMonth}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// (상세) 지난달, 작년 동월, 작년 동분기 비교 막대그래프
const getDifference = async (
  id: string,
  currentMonth: string,
  dateType: string
) => {
  try {
    const response = await instance.get(
      `/accounts/${id}/difference?date=${currentMonth}${dateType}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// (상세) 월별, 기간별, 카테고리별 거래내역 조회
const getAccountType = async (id: string, dateType: string, params: string) => {
  try {
    const response = await instance.get(
      `/accounts/${id}/status?${dateType}${params}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
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
  incomeType: string | null;
  expenditureType: string | null;
  paymentMethod: string | null;
  income: string | null;
  expenditure: string | null;
  date: string;
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

// (상세 -> 일자별) 거래내역 삭제
export const delAccount = async (id: number) => {
  try {
    const response = await instance.delete(`/ledgerhistory/${id}`);
    console.log('거래내역 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.log('거래내역 삭제 실패:', error);
    throw error;
  }
};

// (상세 -> 일자별) 거래내역 수정
export const editAccount = async (
  id: string,
  requestData: {
    accountId: string;
    title: string;
    accountType: string;
    incomeType: string | null;
    expenditureType: string | null;
    paymentMethod: string | null;
    income: string | null;
    expenditure: string | null;
    date: string;
  }
) => {
  try {
    const response = await instance.put(`/ledgerhistory/${id}`, requestData);
    console.log('거래내역 수정 성공:', response.data);
    return response.data;
  } catch (error) {
    console.log('거래내역 수정 실패:', error);
    throw error;
  }
};

export default {
  getAccountList,
  addAccountList,
  delAccountList,
  getAccount,
  editAccountName,
  getMonthPieChart,
  getTotalMonthDate,
  getDifference,
  getAccountType,
  getAccountsDate,
  addAccount,
  delAccount,
  editAccount,
};
