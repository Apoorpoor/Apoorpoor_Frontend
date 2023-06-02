import React from 'react';
import '../../styles/components/_Header.scss';
import { AiOutlineLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router';

function Header({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div id="header">
      <button type="button" onClick={() => navigate('/')}>
        <AiOutlineLeft />
      </button>
      <h1>{children}</h1>
    </div>
  );
}

export default Header;
