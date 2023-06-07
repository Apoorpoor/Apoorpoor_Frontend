import instance from './instance';

// 푸어룸 조회
const getMyPoorRoom = async () => {
  try {
    const response = await instance.get('/beggar');
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 푸어 캐릭터 아이템
const getMyPoorItem = async () => {
  try {
    const response = await instance.get('/item?itemType=total');
    return response.data.itemList;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { getMyPoorRoom, getMyPoorItem };
