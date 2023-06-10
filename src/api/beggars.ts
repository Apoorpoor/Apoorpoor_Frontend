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

// 푸어 캐릭터 아이템 구매
interface BuyItem {
  itemListEnum: string;
}
const patchBuyPoorItem = async (data: BuyItem) => {
  try {
    const response = await instance.patch('/pay', data);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 푸어 캐릭터 아이템 착용 & 해제
interface PutItem {
  itemListEnum: string;
  unWearEnum: null | string;
}
const patchPoorItem = async (data: PutItem) => {
  try {
    const response = await instance.patch('/beggar/custom', data);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 나의 포인트 내역 조회
const getMyPointInquiry = async ({
  dateType,
  kind,
  page,
}: {
  dateType: string;
  kind: string | null;
  page: number;
}) => {
  try {
    const response = await instance.get(`/point?dateType=${dateType}&kind=${kind}&page=${page}&size=10`);
    return response.data.content;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  getMyPoorRoom,
  getMyPoorItem,
  patchPoorItem,
  patchBuyPoorItem,
  getMyPointInquiry,
};
