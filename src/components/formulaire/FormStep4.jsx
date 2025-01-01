import React from 'react';
import PropTypes from 'prop-types';
import './FormStep4.css';

export const FormStep4 = ({ formulaire, onChange }) => {
  const chambres = [
    {
      type: 'double',
      label: 'Chambre Double',
      description: '2 personnes par chambre',
      supplement: 500
    },
    {
      type: 'triple',
      label: 'Chambre Triple',
      description: '3 personnes par chambre',
      supplement: 250
    },
    {
      type: 'quadruple',
      label: 'Chambre Quadruple',
      description: '4 personnes par chambre',
      supplement: 0
    }
  ];

  return (
    <div className="form-step form-step-hebergement">
      <div className="step-content">
        <h2 className="step-title">4. HÉBERGEMENT</h2>
        
        <div className="chambres-grid">
          {chambres.map((chambre) => (
            <div
              key={chambre.type}
              className={`chambre-option ${formulaire.chambre?.type === chambre.type ? 'selected' : ''}`}
              onClick={() => onChange('chambre', { type: chambre.type, supplement: chambre.supplement })}
            >
              <div className="chambre-header">
                <h3>{chambre.label}</h3>
                <span className="supplement">
                  {chambre.supplement > 0 ? `+${chambre.supplement}€` : '0€'}
                </span>
              </div>
              <p className="chambre-description">{chambre.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

FormStep4.propTypes = {
  formulaire: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}; 