import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/_Main.scss';
import { FaPlus } from 'react-icons/fa';
import { UseQueryResult, useMutation, useQuery } from 'react-query';
import accounts from '../../api/accounts';
import { Controller } from '../../components';

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
      return data.reduce(
        (sum, item) =>
          sum +
          (typeof item.balance === 'number'
            ? item.balance
            : item.balance?.expenditureTotal || 0),
        0
      );
    }
    return 0;
  };

  // 가계부 상세페이지 이동
  const handleGoToAccount = (accountId: string) => {
    navigate(`/account/${accountId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  return (
    <>
      <Controller />
      <div className="background">
        <div className="title">
          <p>내 가계부</p>
          <h1>{calculateTotalBalance()}원</h1>
        </div>

        <div className="accountList">
          <p>
            가계부 <span>{data?.length}</span>
          </p>
          {data?.map((item) => (
            <div key={item.id} className="account">
              <div>
                <p className="accountName">{item.title}</p>
                <p className="accountMoney">
                  {typeof item.balance === 'string'
                    ? item.balance
                    : item.balance?.expenditureTotal || 0}
                  원
                </p>
              </div>
              <button
                type="button"
                className="goAccountBtn"
                onClick={() => handleGoToAccount(item.id)}
              >
                자세히
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="addAccountBtn"
          onClick={handleAddAccount}
        >
          가계부 추가
          <div className="addAccountPlusBtn">
            <FaPlus />
          </div>
        </button>
      </div>
    </>
  );
}

export default Main;
