/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/button-has-type */
import React from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineLeft } from 'react-icons/ai';
import '../../styles/components/_UsersProfilePage.scss';
import '../../styles/pages/_PoorRoom.scss';
import '../../styles/components/_Slickslider.scss';
import { Button, SlickSlider } from '../../components';
import communication from '../../static/image/badge/badge_communication.svg';
import culture from '../../static/image/badge/badge_culture.svg';
import deposit from '../../static/image/badge/badge_deposit.svg';
import education from '../../static/image/badge/badge_education.svg';
import food from '../../static/image/badge/badge_food.svg';

interface AccountNameProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataUsersProfile: {
    accImage: null;
    age: number;
    beggarId: number;
    bottomImage: null;
    customImage: null;
    description: null;
    gender: string;
    level: number;
    nickname: string;
    point: number;
    shoesImage: null;
    topImage: null;
    userId: number;
  };
}
function UsersProfilePage({
  setModalOpen,
  dataUsersProfile,
}: AccountNameProps) {
  const navigate = useNavigate();
  // 모달 끄기
  const closeModal = () => {
    setModalOpen(false);
  };
  // console.log("dataUsersProfile = ", dataUsersProfile.nickname)
  const addMention = () => {
    navigate('/badgeList');
  };
  return (
    <div className="ModalOverlay">
      <div id="header">
        <button type="button" onClick={() => closeModal()}>
          <AiOutlineLeft />
        </button>
        <h1>프로필</h1>
      </div>
      <div className="ModalContent">
        <div className="OtherPeopleBeggarImage">Image</div>
        <div className="OtherPeopleBeggarMedal">Medal</div>
        <div className="OtherPeopleBeggarNickName">
          {dataUsersProfile.nickname}
        </div>
        <div className="OtherPeopleBeggarGenderAge">
          {dataUsersProfile.gender} / {dataUsersProfile.age}
        </div>
      </div>
      <div className="ModalContent">
        <div className="OtherPeopleBeggarbadges">소비뱃지</div>
        <SlickSlider
          id="badgeSlide"
          loop={false}
          slidesToShow={3}
          slidesToScroll={1}
          arrows={false}
        >
          <div
            className="item"
            onClick={() => addMention()}
            onKeyDown={addMention}
            role="button"
            tabIndex={0}
          >
            <img src={communication} alt="" />
            <p>여보세요?</p>
          </div>
          <div className="item">
            <img src={culture} alt="" />
            <p>#여유 #휴식</p>
          </div>
          <div className="item">
            <img src={deposit} alt="" />
            <p>티끌모아 태산</p>
          </div>
          <div className="item">
            <img src={education} alt="" />
            <p>공부의 신</p>
          </div>
          <div className="item">
            <img src={food} alt="" />
            <p>햄버억</p>
          </div>
        </SlickSlider>
        <Button className="whiteCommon" onClick={() => navigate('/badgeList')}>
          모든 뱃지 보기
        </Button>
      </div>
      <div className="ModalContent">123</div>
    </div>
  );
}
export default UsersProfilePage;
