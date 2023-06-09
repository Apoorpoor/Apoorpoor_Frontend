import React, { ReactNode } from 'react';
import '../../styles/components/_Layout.scss';
import Controller from './Controller';

type ChildrenType = {
  children: ReactNode;
};

function Layout({ children }: ChildrenType) {
  return (
    <div className="Wrapper">
      <div className="Container">{children}</div>
      <Controller />
    </div>
  );
}

export default Layout;
