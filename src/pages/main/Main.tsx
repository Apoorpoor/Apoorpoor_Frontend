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
  interface MyAccounts {
    id: string;
    title: string;
    user_id?: string;
    balance: number | null; // 잔액
  }

  const { isLoading, error, data, refetch }: UseQueryResult<MyAccounts[]> =
    useQuery('getAccount', accounts.getAccount);

  // 가계부 생성
  const addAccountMutation = useMutation(
    (title: string) => accounts.addAccount(title),
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
  const calculateTotalBalance = () =>
    data?.reduce((sum, item) => sum + (item.balance || 0), 0) || 0;

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
                  {item.balance === null ? '0' : item.balance}원
                </p>
              </div>
              <button
                type="button"
                className="goAccountBtn"
                onClick={() => navigate('/account')}
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
