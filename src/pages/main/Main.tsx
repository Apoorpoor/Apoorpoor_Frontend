import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/_Main.scss';
import { FaPlus } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { UseQueryResult, useMutation, useQuery } from 'react-query';
import accounts from '../../api/accounts';
import MainDelModal from '../../components/elements/MainDelModal';
import NumberAnimation from '../../components/elements/NumberAnimation';
import { Button } from '../../components';
import Loading from '../status/Loading';
import Error from '../status/Error';
import poorImg from '../../static/image/main/mainPoor.png';

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

  // 가계부들 잔액의 합
  const calculateTotalBalance = () => {
    if (Array.isArray(data)) {
      return data.reduce((sum, item) => {
        let balance = 0;
        if (typeof item.balance === 'object' && item.balance !== null) {
          balance =
            (item.balance.incomeTotal || 0) -
            (item.balance.expenditureTotal || 0);
        } else if (typeof item.balance === 'number') {
          balance = item.balance;
        }
        return sum + balance;
      }, 0);
    }
    return 0;
  };

  // 가계부 상세페이지 이동
  const handleGoToAccount = (accountId: string) => {
    navigate(`/account/${accountId}`);
  };

  // 가계부 삭제 모달창 상태 관리
  const [delModal, setDelModal] = useState<string | null>(null);
  // 모달 오픈/클로즈 애니메이션
  const [modalAnimation, setModalAnimation] = useState('');

  const delModalOpen = (accountId: string): void => {
    setDelModal(accountId);
    setModalAnimation('modalAnimation');
  };

  const delModalClose = (): void => {
    setDelModal(null);
    refetch();
    setModalAnimation('');
  };

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <>
      {delModal && (
        <MainDelModal
          id={delModal}
          delModalClose={delModalClose}
          modalAnimation={modalAnimation}
        />
      )}

      <div className="background">
        <div className="title">
          <p>내 가계부</p>
          <h1>
            <NumberAnimation targetNumber={calculateTotalBalance()} />원
          </h1>
        </div>

        <div className="goPoorRoomBox">
          <button type="button" onClick={() => navigate('/poorRoom')}>
            <p>푸어 키우기</p>
            <img src={poorImg} alt="poorImg" />
          </button>
        </div>

        <div className="accountList">
          <p>
            가계부 <span>{data?.length}</span>
          </p>
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
              <div key={item.id} className="account">
                <div>
                  <p className="accountName">{item.title}</p>
                  <p className="accountMoney">
                    <NumberAnimation targetNumber={balanceValue} />원
                  </p>
                </div>
                <div className="moreNdelBtn">
                  <button
                    type="button"
                    className="goAccountBtn"
                    onClick={() => handleGoToAccount(item.id)}
                  >
                    자세히
                  </button>
                  <BsThreeDotsVertical
                    className="mainDelBtn"
                    onClick={() => delModalOpen(item.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Button className="addAccountBtn" onClick={handleAddAccount}>
          가계부 추가
          <div className="addAccountPlusBtn">
            <FaPlus />
          </div>
        </Button>
      </div>
    </>
  );
}

export default Main;
