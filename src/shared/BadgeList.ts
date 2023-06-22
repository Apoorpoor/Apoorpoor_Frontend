import { atom, RecoilState } from 'recoil';

type Badge = {
  title: string;
  name: string;
  description: string;
  sub_description: string;
  n_description: string;
};

const badgeList: Array<Badge> = [
  {
    title: 'communication',
    name: '여보세요?',
    description: '알뜰 요금제 추천드려요!! 📞',
    sub_description: '통신비로 6만원 지출 하셨어요',
    n_description: `통신비 지출 6만원`,
  },
  {
    title: 'culture',
    name: '나는 문화인',
    description: '어벤져스 개봉했던데.. 🎬',
    sub_description: '문화로 10만원 지출 하셨어요',
    n_description: `문화로 10만원 지출`,
  },
  {
    title: 'deposit',
    name: '티끌 모아 태산',
    description: '목표 이자 100만원!! 💰',
    sub_description: '20만원 이상 저축 하셨어요',
    n_description: `20만원 이상 저축`,
  },
  {
    title: 'food',
    name: '맨밥의 청춘',
    description: '멋지다~! 우리 돼지 🍔',
    sub_description: '식비으로 30만원 지출 하셨어요',
    n_description: '식비를 30만원 이하로 지출',
  },
  {
    title: 'insurance',
    name: '이달의 보험왕',
    description: '운전자보험은 필수!! 📄',
    sub_description: '보험비로 3번 지출 하셨어요',
    n_description: `보험비 지출 3번`,
  },
  {
    title: 'leisure',
    name: '#여유 #휴식',
    description: 'OTT로 하루순삭 🍿',
    sub_description: '여가로 10만원 지출 하셨어요',
    n_description: `여가로 10만원 지출`,
  },
  {
    title: 'medical',
    name: '아프니까 청춘이다',
    description: '아끼면 병들어요 💉',
    sub_description: '건강으로 5만원 지출 하셨어요',
    n_description: `건강으로 5만원 지출`,
  },
  {
    title: 'shopping',
    name: 'Flex 했지 뭐얌',
    description: '틴트 대신 입술 깍 깨무세요 👊',
    sub_description: '쇼핑으로 4번 지출 하셨어요',
    n_description: `쇼핑 지출 4번`,
  },
  {
    title: 'transportation',
    name: '열차 들어옵니다.',
    description: '택시 말고 지하철은요? 🚊',
    sub_description: '교통비로 12만원 지출 하셨어요',
    n_description: `교통비 지출 12만원`,
  },
  {
    title: 'tribute',
    name: '축의금은 얼마?',
    description: '너 먼저 가는구나.. 👨‍👩‍👦',
    sub_description: '경조사비 지출 2번을 하셨어요',
    n_description: `경조사비 지출 2번`,
  },
];

const BadgeState: RecoilState<Array<Badge>> = atom<Array<Badge>>({
  key: 'BadgeState',
  default: badgeList,
});

export default BadgeState;
