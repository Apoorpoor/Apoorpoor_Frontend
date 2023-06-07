import { atom, RecoilState } from 'recoil';

interface MyData {
  beggarId: string;
  userId: string;
  nickname: string;
  point: number;
  level: number;
  description: string;
  age: number;
  gender: string;
}
const myPoorState: RecoilState<MyData> = atom<MyData>({
  key: 'myPoorState',
  default: {
    beggarId: '',
    userId: '',
    nickname: '',
    point: 0,
    level: 1,
    description: '',
    age: 0,
    gender: '',
  },
});

export default myPoorState;
