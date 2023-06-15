import React from 'react';
import '../../styles/components/_Header.scss';
import { AiOutlineLeft } from 'react-icons/ai';
import { useLocation } from 'react-router';
import Alarm from '../elements/Alarm';

interface HeaderProps {
  children: React.ReactNode;
  navigateToPreviousPage: () => void;
}

function Header({ children, navigateToPreviousPage }: HeaderProps) {
  // const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname;

  return (
    <div id="header">
      <button type="button" onClick={navigateToPreviousPage}>
        <AiOutlineLeft />
      </button>
      <h1>{children}</h1>
      {page === '/poorRoom' ? <Alarm /> : null}
    </div>
  );
}

export default Header;
