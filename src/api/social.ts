import instance from './instance';

// 나이대별 소비/저축 평균 (한달 기준)
const getAgeAvg = async (accountType: string) => {
  try {
    const response = await instance.get(
      `/social/percent?accountType=${accountType}`
    );
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// Top10 소비/저축 금액 (한달 기준)
const getINCOMEAvg = async () => {
  try {
    const response = await instance.get(
      `/social/rank?accountType=INCOME`
    );
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// Top10 소비/저축 금액 (한달 기준)
const geEXPENDITUREAvg = async () => {
  try {
    const response = await instance.get(
      `/social/rank?accountType=EXPENDITURE`
    );
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default {
  getAgeAvg, getINCOMEAvg, geEXPENDITUREAvg
};
