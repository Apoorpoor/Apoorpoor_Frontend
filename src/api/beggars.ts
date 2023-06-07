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

// 푸어 캐릭터 아이템 조회
const getMyPoorItem = async () => {
  try {
    const response = await instance.get('/item?itemType=total');
    return response.data.itemList;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 푸어 캐릭터 아이템 착용 & 해제
interface MyData {
  itemListEnum: string;
  unWearEnum: string;
}
const patchPoorItem = async () => {
  try {
    const response = await instance.patch('/beggar/custom', data<MyData>);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { getMyPoorRoom, getMyPoorItem, patchPoorItem };
