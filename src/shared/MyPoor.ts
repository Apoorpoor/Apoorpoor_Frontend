import { atom, RecoilState } from 'recoil';

interface MyData {
  beggarId: string;
  userId: string;
  nickname: string;
  exp: number;
  point: number;
  level: number;
  description: string;
  age: number;
  gender: string;
  topImage: string;
  bottomImage: string;
  shoesImage: string;
  accImage: string;
  customImage: string;
}
const myPoorState: RecoilState<MyData> = atom<MyData>({
  key: 'myPoorState',
  default: {
    beggarId: '',
    userId: '',
    nickname: '',
    exp: 0,
    point: 0,
    level: 1,
    description: '',
    age: 0,
    gender: '',
    topImage: '',
    bottomImage: '',
    shoesImage: '',
    accImage: '',
    customImage: '',
  },
});

export default myPoorState;
