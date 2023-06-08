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

function PoorItemSetting() {
  const myPoorInfo = useRecoilValue(myPoorState);
  const queryClient = useQueryClient();

  interface MyData {
    itemNum: number;
    itemName: string;
    itemPrice: number;
    itemState: string;
    itemType: string;
    levelLimit: number;
    itemImage: string;
  }
  const { isLoading, error, data }: UseQueryResult<MyData[]> = useQuery(
    'getMyPoorItem',
    beggars.getMyPoorItem
  );

  const [selectedItem, setSelectedItem] = useState<string | null>('top');

  const poorItemMutation = useMutation(beggars.patchPoorItem, {
    onSuccess: (response) => {
      queryClient.invalidateQueries('getMyPoorItem');
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  // console.log(data);

  const tabMenuHandler = (category: string) => {
    setSelectedItem(category);
  };

  const changeItemStateHandler = ({
    itemType,
    itemImage,
  }: {
    itemType: string;
    itemImage: string;
  }) => {
    const regex = /\/([^/]+)\.svg$/;
    const match = itemImage.match(regex);
    const extractedValue = match ? match[1] : '';

    const itemChangeInfo = {
      itemListEnum: extractedValue,
      unWearEnum: `UN_WEAR_${itemType}`,
    };
    poorItemMutation.mutate(itemChangeInfo);
  };

  const disabled = true;

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
                    item.levelLimit > myPoorInfo.level ? 'closed' : 'open'
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
                      item.levelLimit > myPoorInfo.level ? disabled : false
                    }
                    onClick={() =>
                      changeItemStateHandler({
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
                    item.levelLimit > myPoorInfo.level ? 'closed' : 'open'
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
                      item.levelLimit > myPoorInfo.level ? disabled : false
                    }
                    onClick={() =>
                      changeItemStateHandler({
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
                    item.levelLimit > myPoorInfo.level ? 'closed' : 'open'
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
                      item.levelLimit > myPoorInfo.level ? disabled : false
                    }
                    onClick={() =>
                      changeItemStateHandler({
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
                    item.levelLimit > myPoorInfo.level ? 'closed' : 'open'
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
                      item.levelLimit > myPoorInfo.level ? disabled : false
                    }
                    onClick={() =>
                      changeItemStateHandler({
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
                    item.levelLimit > myPoorInfo.level ? 'closed' : 'open'
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
                      item.levelLimit > myPoorInfo.level ? disabled : false
                    }
                    onClick={() =>
                      changeItemStateHandler({
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
