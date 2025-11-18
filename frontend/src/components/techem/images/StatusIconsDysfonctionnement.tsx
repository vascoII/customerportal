import React from 'react';
import DysfonctionnementIcon from './icons_svg/dysfonctionnement.svg';


export default function StatusIconsDysfonctionnement({ size = 32, color = 'currentColor' }) {
  const style = { width: size, height: size, color };
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <DysfonctionnementIcon style={style} />
    </div>
  );
}
