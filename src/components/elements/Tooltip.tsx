import React from 'react'

type TooltipContent = {
    title: string,
    description: string,
    children: React.ReactNode
}

function Tooltip({ title, description, children} :TooltipContent) {
  return (
    <div>
        <h3>{title}</h3>
        <p>{description}</p>
        {children}
    </div>
  )
}

export default Tooltip