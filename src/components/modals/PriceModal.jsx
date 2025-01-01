import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../common/Button';
import './Modal.css';
import './PriceModal.css';

export const PriceModal = ({ show, onClose, priceInfo }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Détails du prix</h3>
        <button 
          className="modal-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>

        <div className="price-details">
          <div className="price-item">
            <span>Prix de base</span>
            <span>{priceInfo.basePrice}€</span>
          </div>
          {priceInfo.supplement > 0 && (
            <div className="price-item">
              <span>Supplément chambre</span>
              <span>+{priceInfo.supplement}€</span>
            </div>
          )}
          <div className="price-total">
            <span>Total</span>
            <span>{priceInfo.total}€</span>
          </div>
        </div>

        <Button 
          variant="primary"
          onClick={onClose}
          fullWidth
        >
          Fermer
        </Button>
      </div>
    </div>
  );
};

PriceModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  priceInfo: PropTypes.shape({
    basePrice: PropTypes.number.isRequired,
    supplement: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired
}; 