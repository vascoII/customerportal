import React from 'react';
import FuiteIcon from './icons_svg/fuite.svg';

export default function StatusIconsFuite({ size = 32, color = 'currentColor' }) {
  const style = { width: size, height: size, color };
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <FuiteIcon style={style} />
    </div>
  );
}
