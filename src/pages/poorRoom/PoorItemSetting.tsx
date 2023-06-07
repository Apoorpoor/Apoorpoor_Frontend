/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { useRecoilValue } from 'recoil';
import beggars from '../../api/beggars';
import { Button, Header } from '../../components';
import myPoorState from '../../shared/MyPoor';
import '../../styles/pages/_PoorItemSetting.scss';

function PoorItemSetting() {
  const myPoorInfo = useRecoilValue(myPoorState);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  console.log('data', data);

  const tabMenuHandler = (category: string) => {
    setSelectedItem(category);
  };

  const changeItemStateHandler = () => {
    console.log('클릭!');
  };

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
          className={`nav ${selectedItem === 'costume' ? 'active' : ''}`}
          onClick={() => tabMenuHandler('costume')}
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
                  {item.itemState === null}
                  <Button
                    className={`itemButton ${
                      item.itemState === 'null'
                        ? 'null'
                        : item.itemState === 'equipped'
                        ? 'equipped'
                        : ''
                    }`}
                    onClick={changeItemStateHandler}
                  >
                    {item.itemState === 'EQUIPPED' ? '해제하기' : '착용하기'}
                  </Button>
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
                  {item.itemState === null}
                  {/* <Button className="itemButton" onClick={}>
                  {item.itemPrice}
                </Button> */}
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
                  {item.itemState === null}
                  {/* <Button className="itemButton" onClick={}>
                  {item.itemPrice}
                </Button> */}
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
                  {item.itemState === null}
                  {/* <Button className="itemButton" onClick={}>
                  {item.itemPrice}
                </Button> */}
                </li>
              ))}
          </ul>
        </section>
        <section className={selectedItem === 'costume' ? 'active' : ''}>
          <ul>
            {data
              ?.filter((item: MyData) => item.itemType === 'costume')
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
                  {item.itemState === null}
                  {/* <Button className="itemButton" onClick={}>
                  {item.itemPrice}
                </Button> */}
                </li>
              ))}
          </ul>
        </section>
      </article>
    </main>
  );
}

export default PoorItemSetting;
