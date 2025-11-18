import React from 'react';
import EauIcon from './icons_svg/eau.svg';

export default function EquipementIconsEau({ size = 32, color = 'currentColor' }) {
  const style = { width: size, height: size, color };
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <EauIcon style={style} />
    </div>
  );
}
