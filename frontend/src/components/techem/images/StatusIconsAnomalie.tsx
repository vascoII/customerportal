import React from 'react';
import AnomalieIcon from './icons_svg/anomalie.svg';

export default function StatusIconsAnomalie({ size = 32, color = 'currentColor' }) {
  const style = { width: size, height: size, color };
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <AnomalieIcon style={style} />
    </div>
  );
}
