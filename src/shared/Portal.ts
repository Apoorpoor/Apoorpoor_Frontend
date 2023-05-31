import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  let el = document.getElementById('portal');
  if (!el) {
    // portal 엘리먼트가 없을 경우에 대한 처리
    el = document.createElement('div');
    el.id = 'portal';
    document.body.appendChild(el);
  }
  return ReactDOM.createPortal(children, el);
};

export default Portal;
