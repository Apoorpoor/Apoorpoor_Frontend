import instance from '../instance';

// 최근 6개월 소비 경향
const getRecentMyConsume = async () => {
  try {
    const response = await instance.get('/user/mypage/recentStatus');
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default getRecentMyConsume;
