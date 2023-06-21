import instance from './instance';

interface ErrorType extends Error {
  response: {
    data: {
      message: string;
      code: number;
    };
    status: number;
  };
}
// 챌린지 등록하기
export const postChallenge = async (challengeType: string) => {
  try {
    const response = await instance.post(`/challenge`, {
      challengeType,
    });
    return response.data;
  } catch (err) {
    return err as ErrorType;
  }
};

// 챌린지 조회하기
export const getMyChallenge = async () => {
  try {
    const response = await instance.get(`/challenge`);
    return response.data;
  } catch (err) {
    return err as ErrorType;
  }
};

// 챌린지 스탬프 조회하기
export const getStampBoard = async () => {
  try {
    const response = await instance.get(`/challenge/stamp`);
    return response.data;
  } catch (err) {
    return err as ErrorType;
  }
};

// 챌린지 지출내역 조회
export const getChallengeAccountHistory = async () => {
  try {
    const response = await instance.get(`/challenge/ledger`);
    return response.data;
  } catch (err) {
    return err as ErrorType;
  }
};
