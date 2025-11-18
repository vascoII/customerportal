import React from 'react';
import CompteurIcon from './icons_svg/compteur_energie.svg';

export default function EquipementIconsCompteur({ size = 32, color = 'currentColor' }) {
  const style = { width: size, height: size, color };
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <CompteurIcon style={style} />
    </div>
  );
}
