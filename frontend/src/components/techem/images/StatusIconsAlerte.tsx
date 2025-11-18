import React from 'react';
import AlerteIcon from './icons_svg/alerte.svg';

export default function StatusIconsAlerte({ size = 32, color = 'currentColor' }) {
  const style = { width: size, height: size, color };
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <AlerteIcon style={style} />
    </div>
  );
}
