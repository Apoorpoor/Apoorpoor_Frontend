import React, { ReactNode } from 'react';
import '../../styles/components/_Button.scss';

type ButtonChildren = {
  children: ReactNode;
  className: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function Button({ children, className, onClick}: ButtonChildren) {
  return (
  <button type='button' className={className} onClick={onClick}>
    {children}
  </button>
  );
} 

export default Button;
