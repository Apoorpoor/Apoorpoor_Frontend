import React, { ReactNode } from 'react';
import '../../styles/components/_Layout.scss';

type ChildrenType = {
  children: ReactNode;
}

function Layout({ children }: ChildrenType) {
  return (
    <div className="Wrapper">
      <div className="Container">
        {children}
      </div>
    </div>
  );
}

export default Layout;
