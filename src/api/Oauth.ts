/* eslint-disable @typescript-eslint/no-unused-vars */
// 카카오 로그인 인증 정보

const REST_API_KEY = '9c80737eed37f143e7b78ecc71685b2d';
const REDIRECT_URI = 'http://https://apoorpoor.vercel.app/oauth/kakao';

// const KAKAO_AUTH_URL = `http://15.164.247.53:8080/oauth2/authorization/kakao`;

// const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth2/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

// 로컬에서 테스트 서버랑 주고받을 때 url

// const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=b285dc18b3ecd8e4bc2dcc9a9460a12d
// &redirect_uri=https://apoorpoor.vercel.app/oauth/kakao&response_type=code`;

// const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=b285dc18b3ecd8e4bc2dcc9a9460a12d&redirect_uri=http://localhost:3000/oauth/kakao&response_type=code`;

// 프론트 서버 변경 url 아마존
// const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=b285dc18b3ecd8e4bc2dcc9a9460a12d&redirect_uri=http://apoorpoor.s3-website.ap-northeast-2.amazonaws.com//oauth/kakao&response_type=code`;

// http://apoorpoor.s3-website.ap-northeast-2.amazonaws.com/

// apoorpoor 서버 연결
// const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=b285dc18b3ecd8e4bc2dcc9a9460a12d&redirect_uri=${process.env.REACT_APP_SERVER_URL}/oauth/kakao&response_type=code`;

// 버셀 연결
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=b285dc18b3ecd8e4bc2dcc9a9460a12d&redirect_uri=http://localhost:3000/oauth/kakao&response_type=code`;

// ${process.env.REACT_APP_SERVER_URL}
export default KAKAO_AUTH_URL;
