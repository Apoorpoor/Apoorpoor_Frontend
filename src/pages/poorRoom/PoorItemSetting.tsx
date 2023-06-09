/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { useRecoilValue } from 'recoil';
import beggars from '../../api/beggars';
import { Button, Header } from '../../components';
import myPoorState from '../../shared/MyPoor';
import '../../styles/pages/_PoorItemSetting.scss';
import Error from '../status/Error';
import Loading from '../status/Loading';

function PoorItemSetting() {
  const queryClient = useQueryClient();
  interface MyPoorData {
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
    accImage: string;
    customImage: string;
  }

  interface MyData {
    itemNum: number;
    itemName: string;
    itemPrice: number;
    itemState: string;
    itemType: string;
    levelLimit: number;
    itemImage: string;
  }

  const {
    isLoading: myPoorInfoLoading,
    error: myPoorInfoError,
    data: myPoorInfoData,
  }: UseQueryResult<MyPoorData> = useQuery(
    'getMyPoorRoom',
    beggars.getMyPoorRoom
  );

  const { isLoading, error, data }: UseQueryResult<MyData[]> = useQuery(
    'getMyPoorItem',
    beggars.getMyPoorItem
  );

  const [selectedItem, setSelectedItem] = useState<string | null>('top');

  // 옷 입고 벗기 mutation
  const poorItemMutation = useMutation(beggars.patchPoorItem, {
    onSuccess: (response) => {
      queryClient.invalidateQueries('getMyPoorItem');
    },
  });
  // 옷 구매하기 mutation
  const buyPoorItemMutation = useMutation(beggars.patchBuyPoorItem, {
    onSuccess: (response) => {
      queryClient.invalidateQueries('getMyPoorItem');
    },
  });

  if (isLoading && myPoorInfoLoading) {
    return <Loading />;
  }
  if (error && myPoorInfoError) {
    return <Error />;
  }
  console.log(data);

  const tabMenuHandler = (category: string) => {
    setSelectedItem(category);
  };

  const changeItemStateHandler = ({
    itemState,
    itemType,
    itemImage,
  }: {
    itemState: string | null;
    itemType: string | null;
    itemImage: string;
  }) => {
    const regex = /\/([^/]+)\.svg$/;
    const match = itemImage.match(regex);
    const extractedValue = match ? match[1] : '';

    // state가 null일 경우엔 구매요청보내기
    if (itemState === null) {
      buyPoorItemMutation.mutate({ itemListEnum: extractedValue });
      // state가 DONE일 경우엔 옷 입기
    } else if (itemState === 'DONE') {
      poorItemMutation.mutate({
        itemListEnum: extractedValue,
        unWearEnum: null,
      });
      // state가 EQUIPPED일 경우엔 옷 벗기
    } else {
      poorItemMutation.mutate({
        itemListEnum: extractedValue,
        unWearEnum: itemType,
      });
    }
  };

  const disabled = true;

  if (myPoorInfoData === undefined) {
    return <Error />;
  }

  return (
    <main id="poorItemSetting">
      <Header>아이템</Header>
      <nav>
        <Button
          className={`nav ${selectedItem === 'top' ? 'active' : ''}`}
          onClick={() => tabMenuHandler('top')}
        >
          상의
        </Button>
        <Button
          className={`nav ${selectedItem === 'bottom' ? 'active' : ''}`}
          onClick={() => tabMenuHandler('bottom')}
        >
          하의
        </Button>
        <Button
          className={`nav ${selectedItem === 'shoes' ? 'active' : ''}`}
          onClick={() => tabMenuHandler('shoes')}
        >
          신발
        </Button>
        <Button
          className={`nav ${selectedItem === 'acc' ? 'active' : ''}`}
          onClick={() => tabMenuHandler('acc')}
        >
          악세사리
        </Button>
        <Button
          className={`nav ${selectedItem === 'custum' ? 'active' : ''}`}
          onClick={() => tabMenuHandler('custum')}
        >
          코스튬
        </Button>
      </nav>
      <article>
        <section className={selectedItem === 'top' ? 'active' : ''}>
          <ul>
            {data
              ?.filter((item: MyData) => item.itemType === 'top')
              .map((item: MyData) => (
                <li
                  key={item.itemNum}
                  className={
                    item.levelLimit > myPoorInfoData.level ? 'closed' : 'open'
                  }
                >
                  <div className="itemBox">
                    <div className="disabled">
                      <p>
                        Lv.{item.levelLimit}
                        <br />
                        개방
                      </p>
                    </div>
                    <div
                      className="itemImg"
                      style={{ backgroundImage: `url(${item.itemImage})` }}
                    />
                    <p>{item.itemName}</p>
                  </div>
                  <button
                    type="button"
                    className={`itemButton ${
                      item.itemState === null
                        ? 'null'
                        : item.itemState === 'EQUIPPED'
                        ? 'equipped'
                        : 'Done'
                    }`}
                    disabled={
                      item.levelLimit > myPoorInfoData.level ? disabled : false
                    }
                    onClick={() =>
                      changeItemStateHandler({
                        itemState: item.itemState,
                        itemType: item.itemType,
                        itemImage: item.itemImage,
                      })
                    }
                  >
                    {item.itemState === null
                      ? `${item.itemPrice} P`
                      : item.itemState === 'EQUIPPED'
                      ? '해제하기'
                      : '착용하기'}
                  </button>
                </li>
              ))}
          </ul>
        </section>
        <section className={selectedItem === 'bottom' ? 'active' : ''}>
          <ul>
            {data
              ?.filter((item: MyData) => item.itemType === 'bottom')
              .map((item: MyData) => (
                <li
                  key={item.itemNum}
                  className={
                    item.levelLimit > myPoorInfoData.level ? 'closed' : 'open'
                  }
                >
                  <div className="itemBox">
                    <div className="disabled">
                      <p>
                        Lv.{item.levelLimit}
                        <br />
                        개방
                      </p>
                    </div>
                    <div
                      className="itemImg"
                      style={{ backgroundImage: `url(${item.itemImage})` }}
                    />
                    <p>{item.itemName}</p>
                  </div>
                  <button
                    type="button"
                    className={`itemButton ${
                      item.itemState === null
                        ? 'null'
                        : item.itemState === 'EQUIPPED'
                        ? 'equipped'
                        : 'Done'
                    }`}
                    disabled={
                      item.levelLimit > myPoorInfoData.level ? disabled : false
                    }
                    onClick={() =>
                      changeItemStateHandler({
                        itemState: item.itemState,
                        itemType: item.itemType,
                        itemImage: item.itemImage,
                      })
                    }
                  >
                    {item.itemState === null
                      ? `${item.itemPrice} P`
                      : item.itemState === 'EQUIPPED'
                      ? '해제하기'
                      : '착용하기'}
                  </button>
                </li>
              ))}
          </ul>
        </section>
        <section className={selectedItem === 'shoes' ? 'active' : ''}>
          <ul>
            {data
              ?.filter((item: MyData) => item.itemType === 'shoes')
              .map((item: MyData) => (
                <li
                  key={item.itemNum}
                  className={
                    item.levelLimit > myPoorInfoData.level ? 'closed' : 'open'
                  }
                >
                  <div className="itemBox">
                    <div className="disabled">
                      <p>
                        Lv.{item.levelLimit}
                        <br />
                        개방
                      </p>
                    </div>
                    <div
                      className="itemImg"
                      style={{ backgroundImage: `url(${item.itemImage})` }}
                    />
                    <p>{item.itemName}</p>
                  </div>
                  <button
                    type="button"
                    className={`itemButton ${
                      item.itemState === null
                        ? 'null'
                        : item.itemState === 'EQUIPPED'
                        ? 'equipped'
                        : 'Done'
                    }`}
                    disabled={
                      item.levelLimit > myPoorInfoData.level ? disabled : false
                    }
                    onClick={() =>
                      changeItemStateHandler({
                        itemState: item.itemState,
                        itemType: item.itemType,
                        itemImage: item.itemImage,
                      })
                    }
                  >
                    {item.itemState === null
                      ? `${item.itemPrice} P`
                      : item.itemState === 'EQUIPPED'
                      ? '해제하기'
                      : '착용하기'}
                  </button>
                </li>
              ))}
          </ul>
        </section>
        <section className={selectedItem === 'acc' ? 'active' : ''}>
          <ul>
            {data
              ?.filter((item: MyData) => item.itemType === 'acc')
              .map((item: MyData) => (
                <li
                  key={item.itemNum}
                  className={
                    item.levelLimit > myPoorInfoData.level ? 'closed' : 'open'
                  }
                >
                  <div className="itemBox">
                    <div className="disabled">
                      <p>
                        Lv.{item.levelLimit}
                        <br />
                        개방
                      </p>
                    </div>
                    <div
                      className="itemImg"
                      style={{ backgroundImage: `url(${item.itemImage})` }}
                    />
                    <p>{item.itemName}</p>
                  </div>
                  <button
                    type="button"
                    className={`itemButton ${
                      item.itemState === null
                        ? 'null'
                        : item.itemState === 'EQUIPPED'
                        ? 'equipped'
                        : 'Done'
                    }`}
                    disabled={
                      item.levelLimit > myPoorInfoData.level ? disabled : false
                    }
                    onClick={() =>
                      changeItemStateHandler({
                        itemState: item.itemState,
                        itemType: item.itemType,
                        itemImage: item.itemImage,
                      })
                    }
                  >
                    {item.itemState === null
                      ? `${item.itemPrice} P`
                      : item.itemState === 'EQUIPPED'
                      ? '해제하기'
                      : '착용하기'}
                  </button>
                </li>
              ))}
          </ul>
        </section>
        <section className={selectedItem === 'custom' ? 'active' : ''}>
          <ul>
            {data
              ?.filter((item: MyData) => item.itemType === 'custom')
              .map((item: MyData) => (
                <li
                  key={item.itemNum}
                  className={
                    item.levelLimit > myPoorInfoData.level ? 'closed' : 'open'
                  }
                >
                  <div className="itemBox">
                    <div className="disabled">
                      <p>
                        Lv.{item.levelLimit}
                        <br />
                        개방
                      </p>
                    </div>
                    <div
                      className="itemImg"
                      style={{ backgroundImage: `url(${item.itemImage})` }}
                    />
                    <p>{item.itemName}</p>
                  </div>
                  <button
                    type="button"
                    className={`itemButton ${
                      item.itemState === null
                        ? 'null'
                        : item.itemState === 'EQUIPPED'
                        ? 'equipped'
                        : 'Done'
                    }`}
                    disabled={
                      item.levelLimit > myPoorInfoData.level ? disabled : false
                    }
                    onClick={() =>
                      changeItemStateHandler({
                        itemState: item.itemState,
                        itemType: item.itemType,
                        itemImage: item.itemImage,
                      })
                    }
                  >
                    {item.itemState === null
                      ? `${item.itemPrice} P`
                      : item.itemState === 'EQUIPPED'
                      ? '해제하기'
                      : '착용하기'}
                  </button>
                </li>
              ))}
          </ul>
        </section>
      </article>
    </main>
  );
}

export default PoorItemSetting;
