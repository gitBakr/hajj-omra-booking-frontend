import React, { useState } from 'react';
import { OffreCard } from './OffreCard';
import './OffresSection.css';

const offres = [
  {
    id: 1,
    type: 'hajj',
    titre: 'HAJJ 2025',
    prix: 6990
  },
  {
    id: 2,
    type: 'omra',
    titre: 'OMRA RAMADHAN 2025',
    prix: 2390
  }
];

export const OffresSection = () => {
  const [selectedOffre, setSelectedOffre] = useState(null);

  return (
    <div className="offres-section">
      <div className="offres-grid">
        {offres.map(offre => (
          <OffreCard
            key={offre.id}
            type={offre.type}
            titre={offre.titre}
            prix={offre.prix}
            selected={selectedOffre === offre.id}
            onClick={() => setSelectedOffre(offre.id)}
          />
        ))}
      </div>
    </div>
  );
}; 