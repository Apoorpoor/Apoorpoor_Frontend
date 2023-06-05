import instance from '../instance';

// 나의 소비성향 조회
// const today = new Date();
// const year = today.getFullYear();
// const month = today.getMonth() + 1;

const getMyConsumePropensity = async () => {
  try {
    const response = await instance.get(
      //   `user/mypage/status?date=${year - month}`
      `user/mypage/status?date=2022-05`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default getMyConsumePropensity;
