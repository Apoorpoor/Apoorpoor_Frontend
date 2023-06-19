import { atom, RecoilState } from 'recoil';

export const UserNickname: RecoilState<string> = atom<string>({
  key: 'UserNickname',
  default: '',
});

export const UserAge: RecoilState<number> = atom<number>({
  key: 'UserAge',
  default: 0,
});

export const UserGender: RecoilState<string> = atom<string>({
  key: 'UserGender',
  default: '',
});

export const dbNicknamecheck = atom({
  key: 'dbNicknamecheck',
  default: false,
});
