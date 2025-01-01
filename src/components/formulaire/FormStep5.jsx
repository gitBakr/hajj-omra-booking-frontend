import React from 'react';
import PropTypes from 'prop-types';
import './FormStep5.css';

export const FormStep5 = ({ formulaire, onChange }) => {
  const complements = [
    {
      type: 'assurance',
      label: 'Assurance Voyage',
      description: 'Couverture complète pendant votre séjour',
      prix: 150
    },
    {
      type: 'transport',
      label: 'Transport Aéroport',
      description: 'Transfert aller-retour aéroport',
      prix: 50
    },
    {
      type: 'guide',
      label: 'Guide Francophone',
      description: 'Accompagnement pendant les rituels',
      prix: 100
    }
  ];

  const toggleComplement = (complement) => {
    const currentComplements = formulaire.complements || [];
    const isSelected = currentComplements.some(c => c.type === complement.type);

    if (isSelected) {
      onChange('complements', currentComplements.filter(c => c.type !== complement.type));
    } else {
      onChange('complements', [...currentComplements, complement]);
    }
  };

  return (
    <div className="form-step form-step-complements">
      <div className="step-content">
        <h2 className="step-title">5. COMPLÉMENTS</h2>
        
        <div className="complements-grid">
          {complements.map((complement) => {
            const isSelected = formulaire.complements?.some(c => c.type === complement.type);
            
            return (
              <div
                key={complement.type}
                className={`complement-option ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleComplement(complement)}
              >
                <div className="complement-header">
                  <h3>{complement.label}</h3>
                  <span className="prix">{complement.prix}€</span>
                </div>
                <p className="complement-description">{complement.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

FormStep5.propTypes = {
  formulaire: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}; 