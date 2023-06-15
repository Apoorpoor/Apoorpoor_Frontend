/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../../components';
import '../../styles/pages/_AlarmStation.scss';

interface ArrayType {
  alarmType: string;
  msg: string | null;
  timestamp: string | null;
}

function AlarmStation() {
  const navigate = useNavigate();

  // Header 이전 버튼
  const navigateToPreviousPage = () => {
    navigate(-1);
  };

  const savedNotification = sessionStorage.getItem('notification');
  const parsedNotification: ArrayType[] = JSON.parse(savedNotification || '[]');

  function calculateElapsedTime(timeString: string | null): string {
    if (timeString === null) {
      return '0분';
    }
    // 주어진 문자열에서 숫자 추출
    const [month, day, hour, minute] =
      timeString.match(/\d+/g)?.map(Number) ?? [];

    // 현재 시간 가져오기
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
    const currentDay = now.getDate();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // 경과 시간 계산
    const elapsedMinutes =
      (currentMonth - month) * 30 * 24 * 60 +
      (currentDay - day) * 24 * 60 +
      (currentHour - hour) * 60 +
      (currentMinute - minute);

    if (elapsedMinutes > 60) {
      return `${Math.floor(elapsedMinutes / 60)}시간`;
    }
    return `${elapsedMinutes}분`;
  }

  const checkAlarmHandler = (alarmType: string) => {
    if (alarmType === '레벨업') {
      navigate('/poorItemSetting');
    } else if (alarmType === '소비뱃지') {
      navigate('/badgeList');
    }
  };

  return (
    <main id="alarmStation">
      <Header navigateToPreviousPage={navigateToPreviousPage}>알림</Header>
      <div className="alarmList">
        {parsedNotification.length === 0 ? (
          <div className="noAlarm">
            <h2>텅 비었네요</h2>
            <p>
              최근 도착한
              <br />
              알림이 없어요
            </p>
          </div>
        ) : (
          <ul>
            {parsedNotification?.map((notification) => (
              <li
                key={notification.msg}
                onClick={() => checkAlarmHandler(notification.alarmType)}
              >
                <p>
                  {notification.alarmType}
                  <span>{calculateElapsedTime(notification.timestamp)} 전</span>
                </p>

                {notification.alarmType === '레벨업' ? (
                  <p>
                    <span>{notification.msg}레벨로 레벨UP! </span>
                    여기까지 오시느라 고생하셨어요! 지금 열린 아이템을
                    확인해보세요!
                  </p>
                ) : (
                  <p>
                    <span>{notification.msg}</span> 뱃지를 획득했어요! 지금
                    확인하러 가볼까요?
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default AlarmStation;
