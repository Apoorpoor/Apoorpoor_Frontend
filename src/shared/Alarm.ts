import { atom, RecoilState } from 'recoil';

const alarmMessageState: RecoilState<string> = atom<string>({
  key: 'alarmState',
  default: '알림 없음',
});

export default alarmMessageState;
