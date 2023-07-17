import { atom, RecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const alarmMessageState: RecoilState<string> = atom<string>({
  key: 'alarmState',
  default: '알림 없음',
});

export const isConnected = atom({
  key: 'isConnected',
  default: false,
  effects_UNSTABLE: [persistAtom]
})
