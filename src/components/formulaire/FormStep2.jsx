import React from 'react';
import PropTypes from 'prop-types';
import './FormStep2.css';

export const FormStep2 = ({ formulaire, onChange }) => {
  return (
    <div className="form-step form-step-informations">
      <div className="step-content">
        <h2 className="step-title">2. INFORMATIONS</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Civilité</label>
            <select
              value={formulaire.civilite || ''}
              onChange={(e) => onChange('civilite', e.target.value)}
              required
            >
              <option value="">Sélectionnez</option>
              <option value="M.">Monsieur</option>
              <option value="Mme">Madame</option>
              <option value="Mlle">Mademoiselle</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={formulaire.nom || ''}
              onChange={(e) => onChange('nom', e.target.value)}
              required
              placeholder="Votre nom"
            />
          </div>

          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              value={formulaire.prenom || ''}
              onChange={(e) => onChange('prenom', e.target.value)}
              required
              placeholder="Votre prénom"
            />
          </div>

          <div className="form-group">
            <label>Nationalité</label>
            <input
              type="text"
              value={formulaire.nationalite || ''}
              onChange={(e) => onChange('nationalite', e.target.value)}
              required
              placeholder="Votre nationalité"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

FormStep2.propTypes = {
  formulaire: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}; 