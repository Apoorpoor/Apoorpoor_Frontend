/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import '../../styles/pages/_IntroTalk.scss';
import { FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { UseQueryResult, useQuery } from 'react-query';
import PoorCharacter from '../poorRoom/PoorCharacter';
import { myPoorState } from '../../shared/MyPoor';
import beggars from '../../api/beggars';

function IntroTalk() {
  const navigate = useNavigate();
  const [myPoorInfo, setMyPoorInfo] = useRecoilState(myPoorState);
  const { isLoading, error, data }: UseQueryResult<MyData> = useQuery(
    'getMyPoorRoom',
    beggars.getMyPoorRoom
  );

  useEffect(() => {
    if (data !== undefined) {
      setMyPoorInfo(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setMyPoorInfo]);

  return (
    <div id="IntroTalkLayout">
      <section>
        <div className="PoorImage">
          <PoorCharacter avatarType='MyPoorImage' />
        </div>
        <div className="RuleBox">
          <div className="Rule">
            <h2>푸어TALK 이용규칙</h2>
            <br />
            <div className="RuleText">
              소비관련 이야기 외 다른 대화는 지양해주세요.
            </div>
            <div className="RuleText">
              상처보다는 응원 가득한 푸어러가 되어봅시다!
            </div>
          </div>
          <div className="TextAgree ">
            <FaExclamationCircle /> 개인정보 요구, 욕설 등은 이용에 제한이 있을
            수 있어요.
          </div>
        </div>
      </section>

      <section>

        <button
          className="StartChat2"
          type="button"
          onClick={() => navigate('/poorTalk')}
        >
          채팅 시작하기
        </button>

      </section>
    </div>
  );
}

export default IntroTalk;


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
  badgeList: Badge[];
}
type Badge = {
  badgeImage: string;
  badgeNum: number;
  badgeTitle: string;
  createdAt: string;
  id: number;
  modifiedAt: string;
};