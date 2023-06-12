/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { BiBell } from 'react-icons/bi';
import { useRecoilState } from 'recoil';
import alarmMessageState from '../../shared/Alarm';
import Button from './Button';

function Alarm() {
  const [alarmState, setAlarmState] = useRecoilState(alarmMessageState);

  useEffect(() => {
    const subscribeURL = `${process.env.REACT_APP_SERVER_URL}/sub`;
    const accessToken = localStorage.getItem('AToken');

    const eventSource = new EventSource(`${subscribeURL}?token=${accessToken}`);

    // eventSource.onopen = () => {
    //   console.log('Connection opened');
    // };

    eventSource.addEventListener('getBadge', (event) => {
      const message = event.data;
      const eventData = JSON.parse(message);

      alert(message);
      setAlarmState(eventData);
    });

    // eventSource.onmessage = (event) => {
    //   const message = event.data;
    //   setAlarmState(message);
    //   console.log('Received message:', message);
    // };

    // eventSource.onmessage = async (e) => {
    //   const res = await e.data;
    //   const parsedData = JSON.parse(res);

    //   // 받아오는 data로 할 일
    //   setAlarmState(parsedData);
    // };

    eventSource.onerror = (event) => {
      console.log('Error occurred:', event);
    };

    return () => {
      eventSource.close();
    };
  }, [setAlarmState]);

  const openAlarm = () => {
    console.log('알람을 보여줘', alarmState);
  };

  console.log('알림 리코일 저장', alarmState);

  return (
    <div>
      <Button className="iconButton" onClick={openAlarm}>
        <BiBell />
      </Button>
      <div className="alarmList">
        <ul>
          <li>{alarmState}</li>
        </ul>
      </div>
    </div>
  );
}

export default Alarm;
