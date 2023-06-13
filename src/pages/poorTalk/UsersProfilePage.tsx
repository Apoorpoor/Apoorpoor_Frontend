/* eslint-disable react/no-array-index-key */
import React from 'react'
import { useNavigate } from 'react-router';
import { AiOutlineLeft } from 'react-icons/ai';
import "../../styles/components/_UsersProfilePage.scss"
import '../../styles/components/_Slickslider.scss';
import { useQuery, UseQueryResult } from 'react-query';
import {
  Button,
  SlickSlider,
  LevelMedal,
} from '../../components';
import { getUsersProfile } from '../../api/members';

interface AccountNameProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inMessageUserId: number
}

interface DataUsersProfile {
  accImage: ''
  age: number
  beggarId: number
  bottomImage: ''
  customImage: ''
  description: null | string
  gender: string
  level: number
  nickname: string
  point: number
  shoesImage: ''
  topImage: ''
  userId: number
  badgeList: string
}
interface BadgeListType {
  badgeImage: string
  badgeNum: number
  badgeTitle: string
  createdAt: Date
  id: number
  modifiedAt: Date
}

const poorCharacter: { [key: number]: number } = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 5,
  6: 6,
};

function UsersProfilePage({ setModalOpen, inMessageUserId }: AccountNameProps): JSX.Element {

  const navigate = useNavigate();
  // 모달 끄기 
  const closeModal = () => {
    setModalOpen(false);
  };
  // 유저 정보 받아오기
  const { data: dataUsersProfile }: UseQueryResult<DataUsersProfile> = useQuery("getUsersProfile", () => getUsersProfile(inMessageUserId));
  console.log("dataUsersProfile = ", dataUsersProfile)
  const badgeList = dataUsersProfile?.badgeList
  // console.log("badgeList = ", badgeList)

  return (
    <div className='ModalOverlay'>
      <div id="header">
        <button type="button" onClick={() => closeModal()}>
          <AiOutlineLeft />
        </button>
        <h1>프로필</h1>
      </div>
      <div className='ModalContent'>
        <div className='OtherPeopleBeggarImage'>
          <img
            src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/poor/poor_lv${poorCharacter[dataUsersProfile?.level as number]}.svg`}
            alt="나의 푸어 캐릭터"
            className='DataUsersImage'
          />
          <img src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/poor/${dataUsersProfile?.topImage}`} alt="" className="dataUsersItem" />
          <img src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/poor/${dataUsersProfile?.bottomImage}`} alt="" className="dataUsersItem" />
          <img src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/poor/${dataUsersProfile?.accImage}`} alt="" className="dataUsersItem" />
          <img src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/poor/${dataUsersProfile?.customImage}`} alt="" className="dataUsersItem" />
          <img src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/poor/${dataUsersProfile?.shoesImage}`} alt="" className="dataUsersItem" />
        </div>
        <div className='OtherPeopleBeggarMedal'>
          <LevelMedal level={dataUsersProfile?.level as number} />
        </div>
        <div className='OtherPeopleBeggarNickName'>{dataUsersProfile?.nickname}</div>
        <div className='OtherPeopleBeggarGenderAge'>{dataUsersProfile?.gender}/ {dataUsersProfile?.age}</div>
      </div>

      <div className='ModalContent'>
        <div className='OtherPeopleBeggarbadges'>소비뱃지</div>
        <SlickSlider
          id="badgeSlide"
          loop={false}
          slidesToShow={3}
          slidesToScroll={1}
          arrows={false}
        >
          {Array.isArray(badgeList) && badgeList?.map((badge: BadgeListType, index: any) => (
            <div key={index}
              className="item" role="button" tabIndex={0}>
              <img src={badge.badgeImage} alt="" />
              <p>{badge.badgeTitle}</p>
            </div>
          ))}
        </SlickSlider>
        <Button
          className="whiteCommon"
          onClick={() => navigate('/badgeList')
          }
        >
          모든 뱃지 보기
        </Button>
      </div>
    </div >
  )
}

export default UsersProfilePage
