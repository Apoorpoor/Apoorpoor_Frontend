import { atom } from 'recoil';

const containerPositionState = atom<number>({
  key: 'containerPositionState',
  default: 0,
});

export default containerPositionState;
