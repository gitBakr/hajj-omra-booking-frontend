import React from 'react';
import PropTypes from 'prop-types';
import './StepIndicator.css';

const steps = [
  { number: 1, label: 'Offre' },
  { number: 2, label: 'Informations' },
  { number: 3, label: 'Contact' },
  { number: 4, label: 'Chambre' }
];

export const StepIndicator = ({ currentStep }) => {
  const getStepClass = (stepNumber) => {
    if (stepNumber === currentStep) return 'step active';
    if (stepNumber < currentStep) return 'step completed';
    return 'step';
  };

  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="step-indicator">
      <div 
        className="progress-line" 
        style={{ width: `${progressWidth}%` }}
      />
      {steps.map(({ number, label }) => (
        <div key={number} className={getStepClass(number)}>
          {number}
          <span className="step-label">{label}</span>
        </div>
      ))}
    </div>
  );
};

StepIndicator.propTypes = {
  currentStep: PropTypes.number.isRequired
}; 