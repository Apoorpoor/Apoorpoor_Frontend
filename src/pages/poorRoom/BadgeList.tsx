/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Header } from '../../components';
import '../../styles/pages/_BadgeList.scss';
import communication from '../../static/image/badge/badge_communication.svg';
import culture from '../../static/image/badge/badge_culture.svg';
import deposit from '../../static/image/badge/badge_deposit.svg';
import education from '../../static/image/badge/badge_education.svg';
import food from '../../static/image/badge/badge_food.svg';
import health from '../../static/image/badge/badge_health.svg';
import home from '../../static/image/badge/badge_home.svg';
import insurance from '../../static/image/badge/badge_insurance.svg';
import leisure from '../../static/image/badge/badge_leisure.svg';
import medical from '../../static/image/badge/badge_medical.svg';
import shopping from '../../static/image/badge/badge_shopping.svg';
import transportation from '../../static/image/badge/badge_transportation.svg';
import tribute from '../../static/image/badge/badge_tribute.svg';

function BadgeList() {
  type Badge = {
    title: string;
    description: string;
  };
  const badgeList: Array<Badge> = [
    {
      title: communication,
      description: '여보세요?',
    },
    {
      title: culture,
      description: '나는 문화인',
    },
    {
      title: deposit,
      description: '티끌 모아 태산',
    },
    {
      title: education,
      description: '공부의 신',
    },
    {
      title: food,
      description: '햄버억',
    },
    {
      title: health,
      description: '3대 500',
    },
    {
      title: home,
      description: '집주인님 이번만요',
    },
    {
      title: insurance,
      description: '이달의 보험왕',
    },
    {
      title: leisure,
      description: '#여유 #휴식',
    },
    {
      title: medical,
      description: '아프면 손드세요',
    },
    {
      title: shopping,
      description: 'Flex했지 뭐얌',
    },
    {
      title: transportation,
      description: '열차 들어옵니다',
    },
    {
      title: tribute,
      description: '축의금은 얼마?',
    },
  ];
  return (
    <main id='BadgeList'>
      <Header>소비뱃지</Header>
      <ul>
        {badgeList.map((item) => (
          <li key={item.title}>
            <div>
              <img src={item.title} alt={item.title} />
            </div>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default BadgeList;
