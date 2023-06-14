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

export default {
  getAgeAvg,
};
