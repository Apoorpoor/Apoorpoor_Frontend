import React, { ReactNode } from 'react';
import '../../styles/components/_Button.scss';

type ButtonChildren = {
  children: ReactNode;
  className: string;
}

function Button({ children, className }: ButtonChildren) {
  return (
  <button type='button' className={className}>
    {children}
  </button>
  );
} 

export default Button;
