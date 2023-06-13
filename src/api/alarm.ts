const subscribeURL = `${process.env.REACT_APP_SERVER_URL}/sub`;
const accessToken = localStorage.getItem('AToken');

const eventSource = new EventSource(`${subscribeURL} ?token= ${accessToken}`);

export default { eventSource };
