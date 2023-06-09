import instance from '../instance';

// 나의 소비성향 조회

const getMyConsumePropensity = async () => {
  try {
    const response = await instance.get('/user/mypage/status');

    const sortedData = [...response.data]?.sort(
      (a, b) => b.total_sum - a.total_sum
    );
    const topSix = sortedData.slice(0, 6);

    return topSix;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default getMyConsumePropensity;
