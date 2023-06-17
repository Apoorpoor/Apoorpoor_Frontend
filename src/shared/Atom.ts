import { atom, RecoilState } from 'recoil';

const inputState: RecoilState<string> = atom<string>({
  key: 'inputState',
  default: '',
});

// 거래내역 등록 후 랜덤 메세지 위한 카테고리
export const categoryState: RecoilState<string> = atom<string>({
  key: 'categoryState',
  default: '',
});

// 거래내역 등록 후 랜덤 메세지
export const messageState: RecoilState<string> = atom<string>({
  key: 'messageState',
  default: '',
});

// 거래내역 등록 후 획득 포인트
export const pointState: RecoilState<string> = atom<string>({
  key: 'pointState',
  default: '',
});

// 가계부 캘린더 선택 날짜
export const mainDateState: RecoilState<string> = atom<string>({
  key: 'mainDateState',
  default: '',
});

export const accountIdState: RecoilState<string> = atom<string>({
  key: 'accountIdState',
  default: '',
});

export const startDateState = atom<Date | null>({
  key: 'startDateState',
  default: null,
});

export const endDateState = atom<Date | null>({
  key: 'endDateState',
  default: null,
});

export default inputState;
