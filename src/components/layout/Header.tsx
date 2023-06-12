import React from 'react';
import '../../styles/components/_Header.scss';
import { AiOutlineLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import Alarm from '../elements/Alarm';

function Header({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div id="header">
      <button type="button" onClick={() => navigate(-1)}>
        <AiOutlineLeft />
      </button>
      <h1>{children}</h1>
      <Alarm />
    </div>
  );
}

export default Header;
