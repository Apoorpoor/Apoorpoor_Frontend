import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Header } from '../../components';
import Portal from '../../shared/Portal';
import '../../styles/pages/_BadgeList.scss';
import '../../styles/pages/_PoorRoomModal.scss';
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
    name: string;
    description: string;
  };
  const badgeList: Array<Badge> = [
    {
      title: communication,
      name: '여보세요?',
      description: '통신비를 6만원 이하로 지출하셨어요',
    },
    {
      title: culture,
      name: '나는 문화인',
      description: '영화나 연극 등 문화생활에 10만원 이하로 지출하셨어요',
    },
    {
      title: deposit,
      name: '티끌 모아 태산',
      description: '저축을 20만원 이상 하셨어요',
    },
    {
      title: education,
      name: '공부의 신',
      description: '교육비 15만원 이상 지출하셨어요',
    },
    {
      title: food,
      name: '햄버억',
      description: '식비를 30만원 이하로 지출하셨어요',
    },
    {
      title: health,
      name: '3대 500',
      description: '운동 등 건강을 위해 5만원 이하로 지출하셨어요',
    },
    {
      title: home,
      name: '집주인님 이번만요',
      description: '월세/관리비/공과금을 1번 이상 지출하셨어요',
    },
    {
      title: insurance,
      name: '이달의 보험왕',
      description: '보험으로 3번 이상 지출하셨어요',
    },
    {
      title: leisure,
      name: '#여유 #휴식',
      description: '여유로운 생활을 위해 10만원 이하로 지출하셨어요',
    },
    {
      title: medical,
      name: '아프면 손드세요',
      description: '병원비로 5만원 이하 지출하셨어요',
    },
    {
      title: shopping,
      name: 'Flex했지 뭐얌',
      description: '이번달 쇼핑을 4번 이상 하셨어요',
    },
    {
      title: transportation,
      name: '열차 들어옵니다',
      description: '교통비 12만원 이하로 지출하셨어요',
    },
    {
      title: tribute,
      name: '축의금은 얼마?',
      description: '경조사비를 2번 이상 지출하셨어요',
    },
  ];

  const navigate = useNavigate();

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBadgeClick = (badge: Badge) => {
    setIsModalOpen(!isModalOpen);
    setSelectedBadge(badge);
  };

  return (
    <main id="BadgeList">
      <Header>소비뱃지</Header>
      <ul>
        {badgeList.map((item) => (
          <li
            key={item.title}
            onClick={() => handleBadgeClick(item)}
            onKeyDown={() => handleBadgeClick(item)}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="button"
            tabIndex={0}
          >
            <div>
              <img src={item.title} alt={item.title} />
            </div>
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
      <Portal>
        <div
          className={`modalbg ${isModalOpen ? 'active' : ''}`}
          onClick={() => setIsModalOpen(!isModalOpen)}
          onKeyDown={() => setIsModalOpen(!isModalOpen)}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          role="button"
          tabIndex={0}
        >
          <div className={`modal ${isModalOpen ? 'active' : ''}`}>
            <div className="badge">
              <div>
                <img src={selectedBadge?.title} alt={selectedBadge?.title} />
              </div>
              <p>{selectedBadge?.name}</p>
            </div>
            <p>
              <span>ex.</span>
              {selectedBadge?.description}
            </p>
            <Button className="common" onClick={() => navigate('/Account')}>
              가계부 작성하기
            </Button>
          </div>
        </div>
      </Portal>
    </main>
  );
}

export default BadgeList;
