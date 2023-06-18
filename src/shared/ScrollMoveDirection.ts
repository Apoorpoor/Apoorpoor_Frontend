import { atom, RecoilState } from 'recoil';

const scrollMoveDirection: RecoilState<string> = atom<string>({
  key: 'scrollMoveDirection',
  default: 'top',
});

export default scrollMoveDirection;
