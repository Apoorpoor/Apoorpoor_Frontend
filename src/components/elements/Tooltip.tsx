import React, { ReactNode, useState } from 'react';
import '../../styles/components/_Tooltip.scss';

interface TooltipProps {
  children: ReactNode;
}

function Tooltip({ children }: TooltipProps) {
  const [isTooltipShow, setIsTooltipShow] = useState(false);

  const showTooltip = () => {
    setIsTooltipShow(!isTooltipShow);
  };
  return (
    <div className="tooltip">
      <button type="button" onClick={() => showTooltip()}>i</button>
      <div className={`tooltipContents ${isTooltipShow === true? 'show': ''}`}>{children}</div>
    </div>
  );
}

export default Tooltip;
