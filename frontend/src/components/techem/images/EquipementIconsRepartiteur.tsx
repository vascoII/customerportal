import React from 'react';
import EauIcon from './icons_svg/eau.svg';
import RepartiteurIcon from './icons_svg/repartiteur.svg';
import CompteurIcon from './icons_svg/compteur_energie.svg';

export default function EquipementIcons({ size = 32, color = 'currentColor' }) {
  const style = { width: size, height: size, color };
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <EauIcon style={style} />
      <RepartiteurIcon style={style} />
      <CompteurIcon style={style} />
    </div>
  );
}
