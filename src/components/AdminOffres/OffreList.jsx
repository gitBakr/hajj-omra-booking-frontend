import React from 'react';
import OffreItem from './OffreItem';
import './styles.css';

const OffreList = ({ offres, onEdit, onDelete, type }) => {
  return (
    <div className="offers-section">
      <h3>Offres {type === 'hajj' ? 'Hajj' : 'Omra'}</h3>
      <div className="offers-grid">
        {offres.map(offre => (
          <OffreItem 
            key={offre._id}
            offre={offre}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default OffreList; 