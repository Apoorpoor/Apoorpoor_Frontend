import instance from './instance';

// 푸어룸 조회
const getMyPoorRoom = async () => {
  try {
    const response = await instance.get('/user/mypage');
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { getMyPoorRoom };
