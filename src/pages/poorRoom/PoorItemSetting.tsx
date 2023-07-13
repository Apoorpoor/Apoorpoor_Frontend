/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router';
import beggars from '../../api/beggars';
import { Button, Header } from '../../components';
import { myPoorState } from '../../shared/MyPoor';
import Portal from '../../shared/Portal';
import '../../styles/pages/_PoorItemSetting.scss';
import Error from '../status/Error';
import Loading from '../status/Loading';
import { MyPoorData, PoorItem } from '../../types/poorRoomTypes';

function PoorItemSetting() {
  const navigate = useNavigate();

  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate('/poorRoom');
  };

  const queryClient = useQueryClient();
  const myPoorInfo = useRecoilValue(myPoorState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [wearItem, setWearItem] = useState('');
  const [purchaseItem, setPurchaseItem] = useState({
    itemName: '',
    itemImage: '',
    itemType: '',
  });
  // disabled item 초기값
  const disabled = true;

  

  const {
    isLoading: myPoorInfoLoading,
    error: myPoorInfoError,
    data: myPoorInfoData,
  }: UseQueryResult<MyPoorData> = useQuery(
    'getMyPoorRoom',
    beggars.getMyPoorRoom
  );

  const { isLoading, error, data }: UseQueryResult<PoorItem[]> = useQuery(
    'getMyPoorItem',
    beggars.getMyPoorItem
  );

  const [selectedItem, setSelectedItem] = useState<string | null>('top');
  const [point, setPoint] = useState(myPoorInfo.point);

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
  // console.log(data);

  const tabMenuHandler = (category: string) => {
    setSelectedItem(category);
  };

  const changeItemStateHandler = ({
    itemState,
    itemType,
    itemImage,
    itemName,
    itemPrice,
  }: {
    itemState: string | null;
    itemType: string | null;
    itemImage: string;
    itemName: string;
    itemPrice: number;
  }) => {
    const regex = /\/([^/]+)\.svg$/;
    const match = itemImage.match(regex);
    const extractedValue = match ? match[1] : '';

    // state가 null일 경우엔 구매요청보내기
    if (itemState === null) {
      buyPoorItemMutation.mutate({ itemListEnum: extractedValue });
      // 구매하고 모달 띄우기
      setIsModalOpen(true);
      setPurchaseItem({
        itemName,
        itemImage,
        itemType: itemType !== null ? itemType : 'top',
      });
      setPoint(point - itemPrice);
      // state가 DONE일 경우엔 옷 입기
    } else if (itemState === 'DONE') {
      poorItemMutation.mutate({
        itemListEnum: extractedValue,
        unWearEnum: null,
      });
      setWearItem(itemName);
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 1500);
      // state가 EQUIPPED일 경우엔 옷 벗기
    } else {
      poorItemMutation.mutate({
        itemListEnum: extractedValue,
        unWearEnum: itemType,
      });
    }
  };

  if (myPoorInfoData === undefined) {
    return <Error />;
  }

  return (
    <main id="poorItemSetting">
      <div className={`snackbar ${showSnackbar === false ? '' : 'show'}`}>
        <IoAlertCircleOutline />
        &#39;{wearItem}&#39;&nbsp;아이템을 착용하였습니다!
      </div>
      <Header navigateToPreviousPage={navigateToPreviousPage}>아이템</Header>
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
          className={`nav ${selectedItem === 'custom' ? 'active' : ''}`}
          onClick={() => tabMenuHandler('custom')}
        >
          코스튬
        </Button>
      </nav>
      <article>
        <section className={selectedItem === 'top' ? 'active' : ''}>
          <ul>
            {data
              ?.filter((item: PoorItem) => item.itemType === 'top')
              .map((item: PoorItem) => (
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
                        itemName: item.itemName,
                        itemPrice: item.itemPrice,
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
        <section
          className={`bottom ${selectedItem === 'bottom' ? 'active' : ''}`}
        >
          <ul>
            {data
              ?.filter((item: PoorItem) => item.itemType === 'bottom')
              .map((item: PoorItem) => (
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
                        itemName: item.itemName,
                        itemPrice: item.itemPrice,
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
        <section
          className={`shoes ${selectedItem === 'shoes' ? 'active' : ''}`}
        >
          <ul>
            {data
              ?.filter((item: PoorItem) => item.itemType === 'shoes')
              .map((item: PoorItem) => (
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
                        itemName: item.itemName,
                        itemPrice: item.itemPrice,
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
        <section className={`acc ${selectedItem === 'acc' ? 'active' : ''}`}>
          <ul>
            {data
              ?.filter((item: PoorItem) => item.itemType === 'acc')
              .map((item: PoorItem) => (
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
                        itemName: item.itemName,
                        itemPrice: item.itemPrice,
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
        <section
          className={`custom ${selectedItem === 'custom' ? 'active' : ''}`}
        >
          <ul>
            {data
              ?.filter((item: PoorItem) => item.itemType === 'custom')
              .map((item: PoorItem) => (
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
                        itemName: item.itemName,
                        itemPrice: item.itemPrice,
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

      <Portal>
        <div
          className={`modalbg ${isModalOpen ? 'active' : ''}`}
          onClick={() => setIsModalOpen(!isModalOpen)}
          onKeyDown={() => setIsModalOpen(!isModalOpen)}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          role="button"
          tabIndex={0}
        >
          <div className={`modal item ${isModalOpen ? 'active' : ''}`}>
            <h2>아이템 획득!</h2>
            <div className={`item ${purchaseItem.itemType}`}>
              <div>
                <img src={purchaseItem.itemImage} alt={purchaseItem.itemName} />
              </div>
              <p>{purchaseItem.itemName}</p>
            </div>
            <p>잔여 포인트 : {point}p</p>
            <Button className="common" onClick={() => setIsModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Portal>
    </main>
  );
}

export default PoorItemSetting;
