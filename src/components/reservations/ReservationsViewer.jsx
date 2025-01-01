import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ReservationsViewer.css';

export const ReservationsViewer = ({ reservations, onClose }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      const element = e.target;
      setShowScrollTop(element.scrollTop > 300);
    };

    const modalElement = document.querySelector('.reservations-modal');
    if (modalElement) {
      modalElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleDownload = (reservation) => {
    const data = {
      ...reservation,
      dateInscription: new Date(reservation.dateInscription).toLocaleDateString()
    };

    const content = `
DÉTAILS DE LA RÉSERVATION

Référence: ${data._id}
Type de pèlerinage: ${data.typePelerinage.toUpperCase()}
Date d'inscription: ${data.dateInscription}

INFORMATIONS PERSONNELLES
------------------------
${data.civilite} ${data.nom} ${data.prenom}
Nationalité: ${data.nationalite}

CONTACT
-------
Email: ${data.email}
Téléphone: ${data.telephone}

HÉBERGEMENT
-----------
Type de chambre: ${data.chambre?.type || 'Non spécifié'}
${data.chambre?.supplement ? `Supplément: ${data.chambre.supplement}€` : ''}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservation-${data.typePelerinage}-${data.nom}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const scrollToTop = () => {
    const modalElement = document.querySelector('.reservations-modal');
    if (modalElement) {
      modalElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="reservations-modal">
        <div className="modal-header">
          <h2>Mes Réservations ({reservations.length})</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {reservations.length === 0 ? (
          <div className="no-reservations">
            Aucune réservation trouvée
          </div>
        ) : (
          <div className="reservations-list">
            {reservations.map(reservation => (
              <div key={reservation._id} className="reservation-card">
                <div className="reservation-header">
                  <h3>{reservation.civilite} {reservation.nom} {reservation.prenom}</h3>
                  <span className={`type-badge ${reservation.typePelerinage}`}>
                    {reservation.typePelerinage.toUpperCase()}
                  </span>
                </div>

                <div className="reservation-details">
                  <div className="detail-group">
                    <label>Contact</label>
                    <p>{reservation.email}</p>
                    <p>{reservation.telephone}</p>
                  </div>

                  <div className="detail-group">
                    <label>Nationalité</label>
                    <p>{reservation.nationalite}</p>
                  </div>

                  <div className="detail-group">
                    <label>Chambre</label>
                    <p>Type: {reservation.chambre?.type || 'Non spécifié'}</p>
                    {reservation.chambre?.supplement > 0 && (
                      <p>Supplément: {reservation.chambre.supplement}€</p>
                    )}
                  </div>

                  <div className="detail-group">
                    <label>Date d'inscription</label>
                    <p>{new Date(reservation.dateInscription).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="reservation-actions">
                  <button 
                    onClick={() => handleDownload(reservation)}
                    className="download-btn"
                  >
                    Télécharger votre réservation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showScrollTop && (
          <button 
            className="scroll-top-btn"
            onClick={scrollToTop}
            aria-label="Retour en haut"
          >
            ↑
          </button>
        )}
      </div>
    </div>
  );
};

ReservationsViewer.propTypes = {
  reservations: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    civilite: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    prenom: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    telephone: PropTypes.string.isRequired,
    nationalite: PropTypes.string.isRequired,
    typePelerinage: PropTypes.string.isRequired,
    chambre: PropTypes.shape({
      type: PropTypes.string,
      supplement: PropTypes.number
    }),
    dateInscription: PropTypes.string.isRequired
  })).isRequired,
  onClose: PropTypes.func.isRequired
}; 