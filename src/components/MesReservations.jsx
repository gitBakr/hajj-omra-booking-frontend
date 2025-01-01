import React, { useState } from 'react';
import AdminOffres from './AdminOffres';
import './MesReservations.css';

const API_URL = 'https://hajj-omra-booking-backend.onrender.com';
const ADMIN_EMAIL = 'raouanedev@gmail.com';

const MesReservations = ({ onRetour, email, reservations }) => {
  const [showOffres, setShowOffres] = useState(false);
  const isAdmin = email === ADMIN_EMAIL;

  // Calcul des statistiques pour l'admin
  const stats = isAdmin ? {
    total: reservations.length,
    hajj: reservations.filter(r => r.typePelerinage === 'hajj').length,
    omra: reservations.filter(r => r.typePelerinage === 'omra').length,
    chambres: {
      double: reservations.filter(r => r.chambre?.type === 'double').length,
      triple: reservations.filter(r => r.chambre?.type === 'triple').length,
      quadruple: reservations.filter(r => r.chambre?.type === 'quadruple').length
    }
  } : null;

  if (showOffres && isAdmin) {
    return (
      <AdminOffres 
        onRetour={() => setShowOffres(false)} 
        onRetourAccueil={onRetour}
      />
    );
  }

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h2>{isAdmin ? 'Administration' : 'Mes réservations'}</h2>
        <div className="header-buttons">
          <button onClick={onRetour} className="retour-btn">
            ← Retour à l'accueil
          </button>
          {isAdmin && (
            <button 
              onClick={() => setShowOffres(true)}
              className="gestion-offres-btn"
            >
              Gérer les offres
            </button>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="admin-panel">
          <div className="admin-stats">
            <h3>Statistiques</h3>
            <p>Total des réservations : {stats.total}</p>
            <p>Hajj : {stats.hajj}</p>
            <p>Omra : {stats.omra}</p>
            <h4>Répartition des chambres :</h4>
            <p>Double : {stats.chambres.double}</p>
            <p>Triple : {stats.chambres.triple}</p>
            <p>Quadruple : {stats.chambres.quadruple}</p>
          </div>
        </div>
      )}

      {reservations && reservations.length > 0 ? (
        <div className="reservations-list">
          {reservations.map((reservation, index) => (
            <div key={index} className="reservation-card">
              <div className="reservation-header">
                <h3>{reservation.civilite} {reservation.nom} {reservation.prenom}</h3>
                <span className="type-pelerinage">{reservation.typePelerinage.toUpperCase()}</span>
              </div>
              <div className="reservation-details">
                <p><strong>Email :</strong> {reservation.email}</p>
                <p><strong>Téléphone :</strong> {reservation.telephone}</p>
                <p><strong>Nationalité :</strong> {reservation.nationalite}</p>
                <p><strong>Date de départ :</strong> {reservation.dateDepart}</p>
                <p><strong>Type de chambre :</strong> {reservation.chambre?.type || 'Non spécifié'}</p>
                {reservation.besoinsSpeciaux && (
                  <p><strong>Besoins spéciaux :</strong> {reservation.besoinsSpeciaux}</p>
                )}
                <p><strong>Date d'inscription :</strong> {new Date(reservation.dateInscription).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-reservations">
          <p>Aucune réservation trouvée.</p>
        </div>
      )}
    </div>
  );
};

export default MesReservations; 