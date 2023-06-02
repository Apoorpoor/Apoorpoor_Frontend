import React from 'react';
import '../../styles/components/_LevelMedal.scss';

type Level = {
    level: string,
}

function LevelMedal({ level } : Level) {
  return (
    <div id="levelMedal" className={`level${level}`}>
        <p>{level}</p>
    </div>
  )
}

export default LevelMedal;