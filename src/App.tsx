import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Layout } from './components';
import {
  Account,
  AddAccount,
  EditAccount,
  AddAccountDone,
  IntroTalk,
  Login,
  Main,
  Nickname,
  PoorRoom,
  PoorTalk,
  Redirection,
  Age,
  Gender,
  Finished,
  PoorItemSetting,
  BadgeList,
  AlarmStation,
  Social,
  Reduction,
  Flex,
} from './pages/index';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // 토큰 있는지 확인 -> 없으면 login 이동
  useEffect(() => {
    const token = localStorage.getItem('AToken') || Cookies.get('RToken');
    const accountPageRegex = /^\/(account|account)\/\d+$/;
    const accountAddPageRegex = /^\/(account|addAccount)\/\d+$/;
    const accountDonePageRegex = /^\/(account|addAccountDone)\/\d+$/;
    const accountEditPageRegex = /^\/(account|editAccount)\/\d+$/;

    if (
      (!token && !accountPageRegex.test(location.pathname)) ||
      (!token && !accountAddPageRegex.test(location.pathname)) ||
      (!token && !accountDonePageRegex.test(location.pathname)) ||
      (!token && !accountEditPageRegex.test(location.pathname))
    ) {
      navigate('/login');
    }
  }, [navigate, location]);
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/nickname" element={<Nickname />} />
        <Route path="/" element={<Main />} />
        <Route path="/account/:id" element={<Account />} />
        <Route path="/addAccount/:id" element={<AddAccount />} />
        <Route path="/editAccount/:id" element={<EditAccount />} />
        <Route path="/addAccountDone/:id" element={<AddAccountDone />} />
        <Route path="/poorRoom" element={<PoorRoom />} />
        <Route path="/poorItemSetting" element={<PoorItemSetting />} />
        <Route path="/introTalk" element={<IntroTalk />} />
        <Route path="/poorTalk" element={<PoorTalk />} />
        <Route path="/oauth/kakao" element={<Redirection />} />
        <Route path="/age" element={<Age />} />
        <Route path="/gender" element={<Gender />} />
        <Route path="/finished" element={<Finished />} />
        <Route path="/badgeList" element={<BadgeList />} />
        <Route path="/alarmStation" element={<AlarmStation />} />
        <Route path="/social" element={<Social />} />
        <Route path="/social/reduction" element={<Reduction />} />
        <Route path="/social/flex" element={<Flex />} />
      </Routes>
    </Layout>
  );
}

export default App;
