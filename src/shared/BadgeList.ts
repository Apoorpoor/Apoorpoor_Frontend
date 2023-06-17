import { atom, RecoilState } from 'recoil';

type Badge = {
  title: string;
  name: string;
  description: string;
  n_description: string;
};

const badgeList: Array<Badge> = [
  {
    title: 'communication',
    name: '여보세요?',
    description: '동안 통신비를 6만원 이하로 지출하셨어요',
    n_description: '한 달 동안 통신비를 6만원 이하로 지출해 보세요',
  },
  {
    title: 'culture',
    name: '나는 문화인',
    description: '동안 영화나 연극 등 문화생활에 10만원 이하로 지출하셨어요',
    n_description:
      '한 달 동안 영화나 연극 등 문화생활에 10만원 이하로 지출해 보세요',
  },
  {
    title: 'deposit',
    name: '티끌 모아 태산',
    description: '동안 저축을 20만원 이상 하셨어요',
    n_description: '한 달 동안 저축을 20만원 이상 해 보세요',
  },
  {
    title: 'education',
    name: '공부의 신',
    description: '동안 교육비 15만원 이상 지출하셨어요',
    n_description: '한 달 동안 교육비 15만원 이상 지출해 보세요',
  },
  {
    title: 'food',
    name: '햄 버억',
    description: '동안 식비를 30만원 이하로 지출하셨어요',
    n_description: '한 달 동안 식비를 30만원 이하로 지출해 보세요',
  },
  {
    title: 'health',
    name: '3대 500',
    description: '동안 운동 등 건강을 위해 5만원 이하로 지출하셨어요',
    n_description: '한 달 동안 건강을 위해 5만원 이하로 지출해 보세요',
  },
  {
    title: 'home',
    name: '집주인님 이번만요',
    description: '동안 월세/관리비/공과금을 1번 이상 지출하셨어요',
    n_description: '한 달 동안 월세/관리비/공과금을 1번 이상 지출해 보세요',
  },
  {
    title: 'insurance',
    name: '이달의 보험왕',
    description: '동안 보험으로 3번 이상 지출하셨어요',
    n_description: '한 달 동안 보험으로 3번 이상 지출해 보세요',
  },
  {
    title: 'leisure',
    name: '#여유 #휴식',
    description: '동안 여유로운 생활을 위해 10만원 이하로 지출하셨어요',
    n_description: '한 달 동안 휴식을 위해 10만원 이하로 지출해 보세요',
  },
  {
    title: 'medical',
    name: '아프면 손드세요',
    description: '동안 병원비로 5만원 이하 지출하셨어요',
    n_description: '한 달 동안 병원비로 5만원 이하로 지출해 보세요',
  },
  {
    title: 'shopping',
    name: 'Flex 했지 뭐얌',
    description: '동안 이번달 쇼핑을 4번 이상 하셨어요',
    n_description: '한 달 동안 쇼핑을 4번 이상 지출해 보세요',
  },
  {
    title: 'transportation',
    name: '열차 들어옵니다.',
    description: '동안 교통비 12만원 이하로 지출하셨어요',
    n_description: '한 달 동안 교통비 12만원 이하로 지출해 보세요',
  },
  {
    title: 'tribute',
    name: '축의금은 얼마?',
    description: '동안 경조사비를 2번 이상 지출하셨어요',
    n_description: '한 달 동안 경조사비를 2번 이상 지출해 보세요',
  },
];

const BadgeState: RecoilState<Array<Badge>> = atom<Array<Badge>>({
  key: 'BadgeState',
  default: badgeList,
});

export default BadgeState;
