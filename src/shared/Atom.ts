import { atom, RecoilState } from 'recoil';

const inputState: RecoilState<string> = atom<string>({
  key: 'inputState',
  default: '',
});

export default inputState;
