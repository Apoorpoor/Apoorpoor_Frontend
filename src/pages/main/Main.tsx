import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/_Main.scss';
import { UseQueryResult, useMutation, useQuery } from 'react-query';
import accounts from '../../api/accounts';
import NumberAnimation from '../../components/elements/NumberAnimation';
import Loading from '../status/Loading';
import Error from '../status/Error';
import poorImg from '../../static/image/main/mainPoor.png';
import mainIcon from '../../static/image/main/mainIcon.png';
import alarmIcon from '../../static/image/ui/alarm.png';
import accountIcon from '../../static/image/main/accountIcon.png';
import chalIcon from '../../static/image/main/chalIcon.png';
import Tutorial from '../../components/elements/Tutorial';

function Main(): JSX.Element {
  const navigate = useNavigate();

  // 가계부 목록 조회
  interface MyAccountsList {
    id: string;
    title: string;
    userId?: number;
    balance: MyBalance | null; // 잔액
    ledgerHistoryResponseDtoList: [];
  }

  interface MyBalance {
    id: number;
    incomeTotal: number;
    expenditureTotal: number;
  }

  const { isLoading, error, data, refetch }: UseQueryResult<MyAccountsList[]> =
    useQuery('getAccountList', accounts.getAccountList);

  // 가계부 생성
  const addAccountMutation = useMutation(
    (title: string) => accounts.addAccountList(title),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (err) => {
        console.log('가계부 추가 실패:', err);
      },
    }
  );

  const handleAddAccount = async () => {
    try {
      await addAccountMutation.mutateAsync('새로운 가계부');
      console.log('가계부 추가 성공!!');
    } catch (err) {
      console.log('가계부 추가 실패:', err);
    }
  };

  // 가계부 상세페이지 이동
  const handleGoToAccount = (accountId: string) => {
    navigate(`/account/${accountId}`);
  };

  // 내역 추가 버튼
  const goAddAccount = () => {
    if (Array.isArray(data)) {
      const account = data[0]; // 예시로 배열의 첫 번째 요소를 사용
      navigate(`addAccount/${account.id}`);
    }
  };

  // 사용 설명 모달
  const [tutorial, setTutorial] = useState(false);
  const [fir, setFir] = useState(false);
  const [sec, setSec] = useState(false);

  // (최초) 사용 설명 모달 오픈
  const firTutorialOpen = () => {
    setTutorial(true);
    setFir(true);
    handleAddAccount();
  };

  // 사용 설명 모달 오픈
  const tutorialOpen = () => {
    setTutorial(true);
    setFir(false);
    setSec(true);
  };

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <>
      {tutorial && (
        <Tutorial
          setTutorial={setTutorial}
          setFir={setFir}
          fir={fir}
          setSec={setSec}
          sec={sec}
        />
      )}

      <div className="background">
        <div className="header">
          {/* <p>내 가계부</p>
          <h1>
            <NumberAnimation targetNumber={calculateTotalBalance()} />원
          </h1> */}
          <button type="button" onClick={tutorialOpen}>
            <img src={mainIcon} alt="mainIcon" />
          </button>
          <button type="button" onClick={() => navigate('/alarmStation')}>
            <img src={alarmIcon} alt="alarmIcon" />
          </button>
        </div>

        {data?.length === 0 ? (
          <div className="noneAccountList">
            <button type="button" onClick={firTutorialOpen}>
              <div>
                <div className="title">
                  <p className="titleName">처음 오셨나요?</p>
                  <p>클릭해서 가계부를 생성해주세요</p>
                </div>
                <div className="makeAccount">가계부 생성하기</div>
              </div>
              <img src={accountIcon} alt="accountIcon" />
            </button>
          </div>
        ) : (
          ''
        )}
        {data?.map((item) => {
          if (!item) {
            return '';
          }

          // 수입 잔액 - 지출 잔액
          let balanceValue = 0;
          if (typeof item.balance === 'object' && item.balance !== null) {
            balanceValue =
              (item.balance.incomeTotal || 0) -
              (item.balance.expenditureTotal || 0);
          } else if (typeof item.balance === 'string') {
            balanceValue = item.balance;
          }
          return (
            <div className="accountList">
              <button
                type="button"
                onClick={() => handleGoToAccount(item.id)}
                key={item.id}
              >
                <div className="title">
                  <p className="titleName">가계부</p>
                  <p>쉽고 편한 가계부 작성</p>
                  {/* <p className="accountName">{item.title}</p> */}
                  <p className="priceText">
                    모은 금액 : <NumberAnimation targetNumber={balanceValue} />
                    원
                  </p>
                </div>
                <img src={accountIcon} alt="accountIcon" />
              </button>
            </div>
          );
        })}

        <div className="rowBox">
          <div className="goPoorRoomBox">
            <button type="button" onClick={() => navigate('/poorRoom')}>
              <div>
                <p className="titleName">푸어 키우기</p>
                <p>나만의 푸어 키우기</p>
              </div>
              <img src={poorImg} alt="poorImg" />
            </button>
          </div>

          <div className="goChalBox">
            <button type="button">
              <div>
                <p className="titleName">소비 챌린지</p>
                <p>아직 준비 중입니다! 조금만 기다려주세요</p>
              </div>
              <img src={chalIcon} alt="chalIcon" />
            </button>
          </div>
        </div>

        <div className="goAccountBox">
          {data?.length === 0 ? (
            ''
          ) : (
            <button type="button" onClick={goAddAccount}>
              빠른 가계부 작성
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Main;
