import React from 'react';
import './styles.css';

const OffreItem = ({ offre, onEdit, onDelete }) => {
  return (
    <div className="offer-item">
      <div className="offer-content">
        <span className="offer-title">{offre.titre}</span>
        <span className="offer-price">{offre.prix}€</span>
      </div>
      <div className="offer-actions">
        <button onClick={() => onEdit(offre)} className="edit-btn" title="Modifier">✎</button>
        <button onClick={() => onDelete(offre._id)} className="delete-btn" title="Supprimer">×</button>
      </div>
    </div>
  );
};

export default OffreItem; 