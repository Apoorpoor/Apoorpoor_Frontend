/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { AiOutlineLeft } from 'react-icons/ai';
import "../../styles/components/_UsersProfilePage.scss"
import '../../styles/pages/_PoorRoom.scss';
import '../../styles/components/_Slickslider.scss';
import { useQuery, UseQueryResult } from 'react-query';
import {
    Button,
    SlickSlider,
    LevelMedal,
} from '../../components';
import communication from '../../static/image/badge/badge_communication.svg';
import culture from '../../static/image/badge/badge_culture.svg';
import deposit from '../../static/image/badge/badge_deposit.svg';
import education from '../../static/image/badge/badge_education.svg';
import food from '../../static/image/badge/badge_food.svg';
import { getUsersProfile } from '../../api/members';
import instance from '../../api/instance';

interface AccountNameProps {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onMessageUserId: number
}

interface dataUsersProfile {
    accImage: null | string
    age: number
    beggarId: number
    bottomImage: null | string
    customImage: null | string
    description: null | string
    gender: string
    level: number
    nickname: string
    point: number
    shoesImage: null | string
    topImage: null | string
    userId: number
}

function UsersProfilePage({ setModalOpen, onMessageUserId }: AccountNameProps): JSX.Element {

    // 처음에 받아오는 내 푸어 정보
    // const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    // 모달 끄기 
    const closeModal = () => {
        setModalOpen(false);
    };

    const addMention = () => {
        navigate('/badgeList')
    }
    // 유저 정보 받아오기
    const { data: dataUsersProfile }: UseQueryResult<dataUsersProfile> = useQuery("getUsersProfile", () => getUsersProfile(onMessageUserId));
    // console.log("dataUsersProfile = ", dataUsersProfile)
    // console.log("onMessageUserId = ", onMessageUserId)

    // useEffect(() => {
    //     if (dataUsersProfile) {
    //         // setUser(dataUsersProfile)
    //     }
    // }, [dataUsersProfile])
    return (
        <div className='ModalOverlay'>
            <div id="header">
                <button type="button" onClick={() => closeModal()}>
                    <AiOutlineLeft />
                </button>
                <h1>프로필</h1>
            </div>
            <div className='ModalContent'>
                <div className='OtherPeopleBeggarImage'>Image</div>
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
                    <div className="item" onClick={() => addMention()} onKeyDown={addMention} role="button" tabIndex={0}>
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
                <Button
                    className="whiteCommon"
                    onClick={() => navigate('/badgeList')}
                >
                    모든 뱃지 보기
                </Button>
            </div>

            <div className='ModalContent'>
                123
            </div>
        </div>
    )
}

export default UsersProfilePage