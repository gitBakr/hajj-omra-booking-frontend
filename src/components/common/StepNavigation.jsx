import React from 'react';
import PropTypes from 'prop-types';
import './StepNavigation.css';

export const StepNavigation = ({ currentStep, onPrev, onNext, onSubmit, loading }) => {
  const isLastStep = currentStep === 4;

  return (
    <div className="step-navigation">
      {currentStep > 1 && (
        <button
          className="prev-button"
          onClick={onPrev}
          disabled={loading}
        >
          Précédent
        </button>
      )}

      <button
        className={isLastStep ? 'submit-button' : 'next-button'}
        onClick={isLastStep ? onSubmit : onNext}
        disabled={loading}
      >
        {isLastStep ? (loading ? 'Envoi en cours...' : 'Envoyer') : 'Suivant'}
      </button>
    </div>
  );
};

StepNavigation.propTypes = {
  currentStep: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool
}; 