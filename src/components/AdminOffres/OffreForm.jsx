import React, { useState } from 'react';
import './styles.css';

const OffreForm = ({ onSubmit }) => {
  const [selectedType, setSelectedType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newOffer = {
      titre: formData.get('titre'),
      prix: Number(formData.get('prix')),
      type: selectedType
    };
    onSubmit(newOffer);
    e.target.reset();
    setSelectedType('');
  };

  return (
    <div className="offer-form-container">
      <div className="type-buttons">
        <button 
          type="button"
          className={`type-btn ${selectedType === 'hajj' ? 'selected' : ''}`}
          onClick={() => setSelectedType('hajj')}
        >
          Hajj
        </button>
        <button 
          type="button"
          className={`type-btn ${selectedType === 'omra' ? 'selected' : ''}`}
          onClick={() => setSelectedType('omra')}
        >
          Omra
        </button>
      </div>

      <form onSubmit={handleSubmit} className="offer-form">
        <input 
          type="text" 
          name="titre" 
          placeholder="Titre de l'offre"
          required 
        />
        <input 
          type="number" 
          name="prix" 
          placeholder="Prix"
          required 
        />
        <button type="submit" disabled={!selectedType}>
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default OffreForm; 