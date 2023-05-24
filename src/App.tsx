import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  Account,
  AddAccount,
  IntroTalk,
  Login,
  Main,
  Nickname,
  PoorRoom,
  PoorTalk,
} from './pages/index';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/nickname' element={<Nickname />} />
      <Route path='/' element={<Main />} />
      <Route path='/addAccount' element={<AddAccount />} />
      <Route path='/account' element={<Account />} />
      <Route path='/poorRoom' element={<PoorRoom />} />
      <Route path='/introTalk' element={<IntroTalk />} />
      <Route path='/poorTalk' element={<PoorTalk />} />
    </Routes>
  );
}

export default App;
