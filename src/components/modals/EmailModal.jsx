import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { ReservationsViewer } from '../reservations/ReservationsViewer';
import './Modal.css';
import './EmailModal.css';

const ADMIN_EMAIL = 'raouanedev@gmail.com';
const baseUrl = 'https://hajj-omra-booking-backend.onrender.com';

export const EmailModal = ({ show, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('Recherche des réservations pour:', email);

    try {
      if (email === ADMIN_EMAIL) {
        console.log('Email admin détecté, redirection vers le panneau admin');
        localStorage.setItem('userEmail', ADMIN_EMAIL);
        onClose();
        navigate('/admin');
        return;
      }

      // Recherche des réservations
      const response = await fetch(
        `${baseUrl}/pelerin/search?email=${encodeURIComponent(email.trim().toLowerCase())}`
      );
      console.log('Statut de la réponse:', response.status);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Réservations trouvées:', data);
      
      if (!Array.isArray(data)) {
        console.error('Format de réponse invalide:', data);
        throw new Error('Format de réponse invalide');
      }

      if (data.length === 0) {
        setError('Aucune réservation trouvée pour cet email. Vérifiez que vous utilisez bien l\'email fourni lors de votre inscription.');
        return;
      }

      setReservations(data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setError('Impossible de trouver vos réservations. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      {reservations ? (
        <ReservationsViewer 
          reservations={reservations} 
          onClose={() => {
            setReservations(null);
            setEmail('');
            onClose();
          }} 
        />
      ) : (
        <div className="modal-content">
          <h3>Accéder à mes réservations</h3>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>

          <div className="modal-description">
            <p>
              Pour consulter vos réservations en toute sécurité, veuillez saisir l'adresse email 
              que vous avez utilisée lors de votre inscription.
            </p>
            <p className="info-text">
              Vos informations sont protégées et accessibles uniquement avec votre email.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Votre email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="exemple@email.com"
                className="modal-input"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <Button 
              type="submit"
              variant="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Recherche...' : 'Consulter mes réservations'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

EmailModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}; 