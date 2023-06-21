import React from 'react';
import { useRecoilValue } from 'recoil';
import { myPoorState } from '../../shared/MyPoor';
import '../../styles/components/_PoorCharacter.scss';

interface PoorCharacterProps {
  avatarType: string;
}

function PoorCharacter(props: PoorCharacterProps) {
  const { avatarType } = props;
  const myPoorInfo = useRecoilValue(myPoorState);

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

  return (
    <div id="myPoorCharacter" className={avatarType}>
      <img
        src={`https://apoorapoors3.s3.ap-northeast-2.amazonaws.com/poor/poor_lv${
          poorCharacter[myPoorInfo.level]
        }.svg`}
        alt="나의 푸어 캐릭터"
        className="avatar"
      />
      <img src={myPoorInfo.topImage} alt="" className="item" />
      <img src={myPoorInfo.bottomImage} alt="" className="item" />
      <img src={myPoorInfo.shoesImage} alt="" className="item" />
      <img src={myPoorInfo.accImage} alt="" className="item" />
      <img src={myPoorInfo.customImage} alt="" className="item" />
    </div>
  );
}

export default PoorCharacter;
