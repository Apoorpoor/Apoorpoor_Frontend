import { atom, RecoilState } from 'recoil';

export const inputState: RecoilState<string> = atom<string>({
  key: 'inputState',
  default: '',
});

export const messageState: RecoilState<string> = atom<string>({
  key: 'messageState',
  default: '',
});

export const categoryState: RecoilState<string> = atom<string>({
  key: 'categoryState',
  default: '',
});

export default inputState;
