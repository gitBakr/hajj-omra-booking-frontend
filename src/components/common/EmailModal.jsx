import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from './Button';
import './EmailModal.css';

export const EmailModal = ({ show, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(email);
      setEmail('');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Voir mes réservations</h3>
        <button 
          className="modal-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email utilisé lors de l'inscription</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Entrez votre email"
              className="modal-input"
            />
          </div>

          <Button 
            type="submit"
            variant="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </Button>
        </form>
      </div>
    </div>
  );
};

EmailModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}; 