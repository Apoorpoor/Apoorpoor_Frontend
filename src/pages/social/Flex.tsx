/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import '../../styles/pages/_Flex.scss';
import { useNavigate } from 'react-router';
import { useQuery } from 'react-query';
import { AiOutlineLeft } from 'react-icons/ai';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import BasicBackGround from '../../static/image/social/Reduction/BasicBackGround.png';
import Crown from '../../static/image/social/Reduction/Crown.png';
import GoldMedal from '../../static/image/social/Reduction/GoldMedal.png';
import SilverMedal from '../../static/image/social/Reduction/SilverMedal.png';
import CopperMedal from '../../static/image/social/Reduction/CopperMedal.png';
import social from '../../api/social';
import Loading from '../status/Loading';
import Error from '../status/Error';

function Flex() {
  const navigate = useNavigate();
  // 데이터 저장
  const [topList, setTopList] = useState<ApiDataItem[] | undefined>([
    {
      acc_url: '',
      accountType: '',
      beggar_id: 0,
      date: '',
      level: 0,
      nickname: '',
      rank_num: 0,
      top_url: '',
      total: 0,
      custom_url: '',
    },
  ]);
  // 데이터 조회
  const { isLoading, error, data } = useQuery(
    'geEXPENDITUREAvg',
    social.geEXPENDITUREAvg
  );

  useEffect(() => {
    if (data) {
      setTopList(data);
    }
  }, [data]);

  const poorCharacter: { [key: number]: number } = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 5,
    6: 6,
    7: 6,
    8: 6,
    9: 6,
    10: 6,
  };

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    if (
      (error as AxiosError).response &&
      (error as AxiosError).response?.status === 403
    ) {
      localStorage.removeItem('AToken');
      localStorage.removeItem('userId');
      Cookies.remove('RToken');
      alert('로그인 시간이 만료 되었어요!');
      navigate('/login');
    }
    return <Error />;
  }

  // 숫자 형식화 함수
  const formatNumber = (value: number) => {
    if (value >= 1000000000000000) {
      const stringValue = value.toString();
      const remainingDigits = stringValue.substring(0, stringValue.length - 16);
      return `약 ${remainingDigits}경원`;
    }
    if (value >= 1000000000000) {
      const stringValue = value.toString();
      const remainingDigits = stringValue.substring(0, stringValue.length - 12);
      return `약 ${remainingDigits}조원`;
    }
    if (value >= 100000000) {
      const stringValue = value.toString();
      const remainingDigits = stringValue.substring(0, stringValue.length - 8);
      return `약 ${remainingDigits}억원`;
    }
    if (value >= 100000) {
      const stringValue = value.toString();
      const firstTwoDigits = stringValue.substring(0, stringValue.length - 4);
      return `${firstTwoDigits}만원`;
    }
    if (value >= 10000 && value < 100000) {
      const stringValue = value.toString();
      const firstDigit = stringValue[0];
      const secondDigit = stringValue[1];
      return `${firstDigit}만${secondDigit}천원`;
    }
    if (value >= 1000 && value < 10000) {
      const firstDigit = Math.floor(value / 1000);
      return `${firstDigit}천원`;
    }
    return `${value}원`;
  };
  return (
    <div className="socialBg2">
      <div id="socialHeader">
        <button type="button" onClick={() => navigate(-1)}>
          <AiOutlineLeft />
        </button>
        <h1>플렉스 푸어</h1>
      </div>
      <div>
        <div className="BasicBackGround">
          <img className="BasicBackGroundimage" src={BasicBackGround} alt="" />
          <div className="Top3Poor2">
            {topList && topList[1] && topList[1].level && (
              <img
                className="Top2Poor"
                src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/poor/poor_lv${
                  poorCharacter[topList[1].level]
                }.svg`}
                alt=""
              />
            )}
            {topList && topList[1] && topList[1].top_url && (
              <img className="Top2PoorItem" src={topList[1].top_url} alt="" />
            )}
            {topList && topList[1] && topList[1].acc_url && (
              <img className="Top2PoorItem" src={topList[1].acc_url} alt="" />
            )}
            {topList && topList[1] && topList[1].custom_url && (
              <img
                className="Top2PoorItem"
                src={topList[1].custom_url}
                alt=""
              />
            )}
          </div>
          <img className="SilverMedal" src={SilverMedal} alt="" />
          <div className="Top3Poor3">
            {topList && topList[2] && topList[2].level && (
              <img
                className="Top3Poor"
                src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/poor/poor_lv${
                  poorCharacter[topList[2].level]
                }.svg`}
                alt=""
              />
            )}
            {topList && topList[2] && topList[2].top_url && (
              <img className="Top3PoorItem" src={topList[2].top_url} alt="" />
            )}
            {topList && topList[2] && topList[2].acc_url && (
              <img className="Top3PoorItem" src={topList[2].acc_url} alt="" />
            )}
            {topList && topList[2] && topList[2].custom_url && (
              <img
                className="Top3PoorItem"
                src={topList[2].custom_url}
                alt=""
              />
            )}
          </div>
          <img className="CopperMedal" src={CopperMedal} alt="" />
          <img className="Top1Crown" src={Crown} alt="" />
          <div className="Top3Poor1">
            {topList && topList[0] && topList[0].level && (
              <img
                className="Top1Poor"
                src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/poor/poor_lv${
                  poorCharacter[topList[0].level]
                }.svg`}
                alt=""
              />
            )}
            {topList && topList[0] && topList[0].top_url && (
              <img className="Top1PoorItem" src={topList[0].top_url} alt="" />
            )}
            {topList && topList[0] && topList[0].acc_url && (
              <img className="Top1PoorItem" src={topList[0].acc_url} alt="" />
            )}
            {topList && topList[0] && topList[0].custom_url && (
              <img
                className="Top1PoorItem"
                src={topList[0].custom_url}
                alt=""
              />
            )}
          </div>
          <img className="GoldMedal" src={GoldMedal} alt="" />
        </div>
      </div>
      <div className="Top1Number">1</div>
      <div className="Top2Number">2</div>
      <div className="Top3Number">3</div>
      <div className="Top1Nickname">
        {topList && topList[0]?.nickname}
        <div className="Top1Price">
          {topList && formatNumber(topList[0].total)}
        </div>
      </div>
      <div className="Top2Nickname2">
        {topList && topList[1]?.nickname}
        <div className="Top2Price">
          {topList && formatNumber(topList[1]?.total)}
        </div>
      </div>
      <div className="Top3Nickname2">
        {topList && topList[2]?.nickname}
        <div className="Top3Price">
          {topList && formatNumber(topList[2]?.total)}
        </div>
      </div>
      <div className="socialRankingBox2">
        <div className="Top10ListHeader">
          <p>닉네임</p> <p>금액</p>
        </div>
        {topList?.map((poor, index) => {
          if (poor.beggar_id !== 1) {
            return (
              <div key={index} className="Top10List">
                <p>{poor.rank_num}</p>
                <div className="Top10Poors">
                  <div className="ProfileNickname">
                    <div className="Top10PoorsImage">
                      <img
                        className="Top10Image"
                        src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/poor/poor_lv${
                          poorCharacter[poor.level]
                        }.svg`}
                        alt="푸어 이미지"
                      />
                      <img
                        className="Top10ImageItem"
                        src={poor.top_url}
                        alt="푸어 상의"
                      />
                      <img
                        className="Top10ImageItem"
                        src={poor.acc_url}
                        alt="푸어 악세서리"
                      />
                      <img
                        className="Top10ImageItem"
                        src={poor.custom_url}
                        alt="푸어 커스텀"
                      />
                    </div>
                    {poor.nickname}
                  </div>
                  <div className="Top10PoorsPrice">
                    {formatNumber(poor.total)}
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default Flex;

interface ApiDataItem {
  acc_url: string;
  accountType: string;
  beggar_id: number;
  date: string;
  level: number;
  nickname: string | number;
  rank_num: number;
  top_url: string;
  total: number;
  custom_url: string;
}
