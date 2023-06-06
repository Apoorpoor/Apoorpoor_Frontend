import instance from '../instance';

// 나의 소비성향 조회
// const today = new Date();
// const year = today.getFullYear();
// const month = today.getMonth() + 1;

// interface MyData {
//   month: string;
//   expenditureType: string;
//   month_sum: number;
// }

const getMyConsumePropensity = async () => {
  try {
    const response = await instance.get(
      //   `user/mypage/status?date=${year - month}`
      '/user/mypage/status?date=2022-11'
    );

    const sortedData = [...response.data]?.sort(
      (a, b) => b.month_sum - a.month_sum
    );
    const topSix = sortedData.slice(0, 6);

    return topSix;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default getMyConsumePropensity;