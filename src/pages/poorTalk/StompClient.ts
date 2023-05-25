import { Stomp, Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const socket = new SockJS('http://localhost:3000/chat'); // 엔드포인트 URL 대체 예정
const stompClient: Client = Stomp.over(socket);
const sendMessage = (destination: string, body: string) => {
    stompClient.publish({ destination, body });
};
const isStompConnected = () => stompClient.connected;

export { stompClient, sendMessage, isStompConnected };