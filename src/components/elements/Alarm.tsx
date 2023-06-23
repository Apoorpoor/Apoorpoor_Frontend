import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Button from './Button';
import alarmIcon from '../../static/image/ui/alarm.png';

interface ArrayType {
  id: number | null;
  msg: string | null;
  timestamp: Date | null;
}

function Alarm() {
  const [isConnected, setIsConnected] = useState(true);
  const [savedNotification, setSavedNotification] = useState<ArrayType[]>([]);
  const navigate = useNavigate();

  if (isConnected) {
    const subscribeURL = `${process.env.REACT_APP_SERVER_URL}/sub`;
    const accessToken = localStorage.getItem('AToken');

    const eventSource = new EventSource(
      `${subscribeURL}?token=${accessToken}`,
      {
        withCredentials: true,
      }
    );

    const handleGetBadge = (event: MessageEvent) => {
      const message = event.data;
      const eventData = JSON.parse(message);

      const notifications = [...savedNotification, eventData];
      setSavedNotification(notifications);

      // sessionStorage에 저장
      sessionStorage.setItem('notification', JSON.stringify(notifications));
    };

    eventSource.addEventListener('getBadge', handleGetBadge);

    // SSE 서버 연결
    eventSource.onopen = () => {
      console.log('Connection opened');
    };

    // SSE 서버 에러 발생
    eventSource.onerror = (event) => {
      console.log('Error occurred:', event);
      eventSource.removeEventListener('getBadge', handleGetBadge);
      eventSource.close();
    };

    setIsConnected(false);
  }

  const alarmCheckedHandler = () => {
    navigate('/AlarmStation');
  };
  const [notificationCount, setNotificationCount] = useState(false);

  const notification = sessionStorage.getItem('notification');

  useEffect(() => {
    // notification이 문자열로 취급되어서 감싸고 있는 대괄호도 length로 인식,length가 2 이상이어야 알림 내역이 있음
    if (notification !== null && notification.length > 2) {
      setNotificationCount(true);
    } else {
      setNotificationCount(false);
    }
  }, [notification]);
  return (
    <div>
      <Button
        className={`iconButton ${notificationCount === true ? 'checkMe' : ''}`}
        onClick={() => alarmCheckedHandler()}
      >
        <img
          src={alarmIcon}
          alt="alarm"
          style={{ width: '44px', height: '44px' }}
        />
      </Button>
    </div>
  );
}

export default Alarm;
