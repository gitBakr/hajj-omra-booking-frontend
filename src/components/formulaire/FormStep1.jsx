import React from 'react';
import PropTypes from 'prop-types';
import './FormStep1.css';

export const FormStep1 = ({ offres, loading, onSelect, selectedOffre }) => {
  return (
    <div className="form-step">
      <div className="step-content">
        <h2 className="step-title">1. CHOIX DU VOYAGE</h2>
        
        <div className="voyage-section">
          <h3 className="offre-type">🕋 Offres Hajj</h3>
          <div className="offres-list">
            {loading ? (
              <div className="loading">Chargement...</div>
            ) : offres?.hajj?.length > 0 ? (
              offres.hajj.map((offre) => (
                <div
                  key={offre._id}
                  className={`offre-item ${selectedOffre?._id === offre._id ? 'selected' : ''}`}
                  onClick={() => onSelect(offre)}
                >
                  <span className="offre-titre">{offre.titre}</span>
                  <span className="offre-prix">{offre.prix}€</span>
                </div>
              ))
            ) : (
              <p className="no-offres">Aucune offre Hajj disponible</p>
            )}
          </div>
        </div>

        <div className="voyage-section">
          <h3 className="offre-type">🌙 Offres Omra</h3>
          <div className="offres-list">
            {loading ? (
              <div className="loading">Chargement...</div>
            ) : offres?.omra?.length > 0 ? (
              offres.omra.map((offre) => (
                <div
                  key={offre._id}
                  className={`offre-item ${selectedOffre?._id === offre._id ? 'selected' : ''}`}
                  onClick={() => onSelect(offre)}
                >
                  <span className="offre-titre">{offre.titre}</span>
                  <span className="offre-prix">{offre.prix}€</span>
                </div>
              ))
            ) : (
              <p className="no-offres">Aucune offre Omra disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

FormStep1.propTypes = {
  offres: PropTypes.shape({
    hajj: PropTypes.array,
    omra: PropTypes.array
  }),
  loading: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  selectedOffre: PropTypes.object
}; 