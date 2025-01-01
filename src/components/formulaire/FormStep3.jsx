import React from 'react';
import PropTypes from 'prop-types';
import './FormStep3.css';

export const FormStep3 = ({ formulaire, onChange }) => {
  return (
    <div className="form-step form-step-contact">
      <div className="step-content">
        <h2 className="step-title">3. CONTACT</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              value={formulaire.telephone || ''}
              onChange={(e) => onChange('telephone', e.target.value)}
              required
              placeholder="Votre numéro de téléphone"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formulaire.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              required
              placeholder="Votre adresse email"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

FormStep3.propTypes = {
  formulaire: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}; 