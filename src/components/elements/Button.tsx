import React, { ReactNode } from 'react';
import '../../styles/components/_Button.scss';

type ButtonChildren = {
  children: ReactNode;
  className: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

function Button({ children, className, onClick, disabled }: ButtonChildren) {
  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  disabled: false,
};

export default Button;
