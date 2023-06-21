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
    n_description: `“여보세요?” 뱃지를 받으려면
    통신비 지출 6만원을 해보세요`,
  },
  {
    title: 'culture',
    name: '나는 문화인',
    description: '동안 영화나 연극 등 문화생활에 10만원 이하로 지출하셨어요',
    n_description: `“나는 문화인” 뱃지를 받으려면
      문화로 10만원 지출을 해보세요`,
  },
  {
    title: 'deposit',
    name: '티끌 모아 태산',
    description: '동안 저축을 20만원 이상 하셨어요',
    n_description: `“티끌 모아 태산” 뱃지를 받으려면
    20만원 이상 저축을 해보세요`,
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
    n_description: `“이달의 보험왕” 뱃지를 받으려면
    보험비 지출 3번을 해보세요`,
  },
  {
    title: 'leisure',
    name: '#여유 #휴식',
    description: '동안 여유로운 생활을 위해 10만원 이하로 지출하셨어요',
    n_description: `“#여유 #휴식” 뱃지를 받으려면
    여가로 10만원 지출을 해보세요`,
  },
  {
    title: 'medical',
    name: '아프면 손드세요',
    description: '동안 병원비로 5만원 이하 지출하셨어요',
    n_description: `“아프니까 청춘이다” 뱃지를 받으려면
    건강으로 5만원 지출을 해보세요`,
  },
  {
    title: 'shopping',
    name: 'Flex 했지 뭐얌',
    description: '동안 이번달 쇼핑을 4번 이상 하셨어요',
    n_description: `“Flex 했지 뭐얌” 뱃지를 받으려면
    쇼핑 지출 4번을 해보세요`,
  },
  {
    title: 'transportation',
    name: '열차 들어옵니다.',
    description: '동안 교통비 12만원 이하로 지출하셨어요',
    n_description: `“열차 들어옵니다” 뱃지를 받으려면
    교통비 지출 12만원을 해보세요`,
  },
  {
    title: 'tribute',
    name: '축의금은 얼마?',
    description: '동안 경조사비를 2번 이상 지출하셨어요',
    n_description: `“축의금은 얼마?” 뱃지를 받으려면
    경조사비 지출 2번을 해보세요`,
  },
];

const BadgeState: RecoilState<Array<Badge>> = atom<Array<Badge>>({
  key: 'BadgeState',
  default: badgeList,
});

export default BadgeState;
