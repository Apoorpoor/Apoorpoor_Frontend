import instance from '../instance';

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
