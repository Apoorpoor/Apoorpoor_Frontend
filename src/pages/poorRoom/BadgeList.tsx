/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { MdLock } from 'react-icons/md';
import beggars from '../../api/beggars';
import { Button, Header } from '../../components';
import Portal from '../../shared/Portal';
import '../../styles/pages/_BadgeList.scss';
import '../../styles/pages/_PoorRoomModal.scss';
import Loading from '../status/Loading';
import Error from '../status/Error';
import BadgeState from '../../shared/BadgeList';

function BadgeList() {
  const navigate = useNavigate();

  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(-1);
  };

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [badgeModal, setBadgeModal] = useState(false);
  const BadgeListState = useRecoilValue(BadgeState);

  // 마이푸어룸 데이터 불러오기
  type BadgeList = {
    badgeImage: string;
    badgeNum: number;
    badgeTitle: string;
    createdAt: string;
    id: number;
    modifiedAt: string;
  };

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
    accImage: string;
    customImage: string;
    badgeList: BadgeList[];
  }

  const { isLoading, error, data }: UseQueryResult<MyData> = useQuery(
    'getMyPoorRoom',
    beggars.getMyPoorRoom
  );

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  type Badge = {
    title: string;
    name: string;
    description: string;
    sub_description: string;
    n_description: string;
  };

  const handleBadgeClick = (badge: Badge) => {
    setIsModalOpen(!isModalOpen);
    setSelectedBadge(badge);
    const className = data?.badgeList.some(
      (item) => item.badgeTitle === badge.name
    )
      ? 'have'
      : 'dontHave';
    setSelectedClassName(className);
    setBadgeModal(true);
  };

  // const currentDate = new Date();
  // const currentMonth = currentDate.getMonth();
  // const previousMonth = (currentMonth === 0 ? 11 : currentMonth - 1) + 1;

  return (
    <main id="BadgeList">
      <Header navigateToPreviousPage={navigateToPreviousPage}>소비뱃지</Header>
      <ul>
        {BadgeListState.map((item) => (
          <li
            key={item.name}
            className={
              data?.badgeList.some((badge) => badge.badgeTitle === item.name)
                ? 'have'
                : 'dontHave'
            }
            onClick={() => handleBadgeClick(item)}
            onKeyDown={() => handleBadgeClick(item)}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="button"
            tabIndex={0}
          >
            <div className="disabled">
              <p>
                <MdLock />
              </p>
            </div>
            <div>
              <img
                src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/badge/badge_${item.title}.svg`}
                alt={item.name}
              />
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
          <div
            className={`modal badge ${isModalOpen ? 'active' : ''} ${
              badgeModal === true ? 'show' : ''
            }`}
          >
            <div className="badge">
              <div>
                <img
                  src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/badge/badge_${selectedBadge?.title}.svg`}
                  alt={selectedBadge?.title}
                />
              </div>
              <p>{selectedBadge?.name}</p>
            </div>
            <p>
              {selectedBadge &&
                (selectedClassName === 'have' ? (
                  <>
                    {selectedBadge.description}<br />
                    <span>{selectedBadge.sub_description}</span>
                  </>
                ) : (
                  <>
                    &quot;{selectedBadge.name}&quot; 뱃지를 받으려면<br />
                    <span>{selectedBadge.n_description}</span>을 해보세요
                  </>
                ))}
            </p>

            {selectedClassName === 'have' ? (
              ''
            ) : (
              <Button className="common" onClick={() => navigate('/Account')}>
                가계부 작성하기
              </Button>
            )}
          </div>
        </div>
      </Portal>
    </main>
  );
}

export default BadgeList;
