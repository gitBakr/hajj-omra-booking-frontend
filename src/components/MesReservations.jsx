import React, { useState } from 'react';
import './MesReservations.css';

const API_URL = 'http://localhost:5001';
const ADMIN_EMAIL = 'raouanedev@gmail.com';

const formatChambreType = (chambre) => {
  if (!chambre || !chambre.type) return 'Non spécifié';
  return chambre.type.charAt(0).toUpperCase() + chambre.type.slice(1);
};

const MesReservations = ({ onRetour }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [reservations, setReservations] = useState(null);
  const [searching, setSearching] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const searchReservations = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      const response = await fetch(`${API_URL}/api/pelerins/search?email=${searchEmail}`);
      const data = await response.json();
      setReservations(data.reservations);
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.error('Erreur:', error);
      setReservations([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h2>
          {searchEmail === ADMIN_EMAIL && reservations ? 
            'Panel Administrateur - Toutes les Réservations' : 
            'Mes Réservations'
          }
        </h2>
        <button className="retour-btn" onClick={onRetour}>
          ← Retour au formulaire
        </button>
      </div>

      <div className="search-section">
        <form onSubmit={searchReservations}>
          <div className="form-group">
            <label>Email utilisé lors de l'inscription</label>
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              required
              placeholder="Entrez votre email"
            />
          </div>
          <button 
            type="submit" 
            className="search-button"
            disabled={searching}
          >
            {searching ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>
      </div>

      {reservations && (
        <div className="reservations-results">
          {reservations.length > 0 ? (
            <div className="reservations-list">
              {isAdmin && (
                <div className="admin-stats">
                  <div className="stats-row">
                    <div className="stats-col">
                      <h4>Réservations</h4>
                      <p>Total : {reservations.length}</p>
                      <p>Hajj : {reservations.filter(r => r.typePelerinage === 'hajj').length}</p>
                      <p>Omra : {reservations.filter(r => r.typePelerinage === 'omra').length}</p>
                    </div>
                    <div className="stats-col">
                      <h4>Répartition</h4>
                      <p>Hommes : {reservations.filter(r => r.civilite === 'M.').length}</p>
                      <p>Femmes : {reservations.filter(r => r.civilite === 'Mme' || r.civilite === 'Mlle').length}</p>
                    </div>
                  </div>
                </div>
              )}
              {reservations.map((reservation, index) => (
                <div key={index} className="reservation-card">
                  <div className="reservation-header">
                    <h4>{reservation.typePelerinage === 'hajj' ? 'Hajj 2025' : 'Omra Ramadhan'}</h4>
                    <span className="person-number">Personne {index + 1}</span>
                  </div>
                  <div className="reservation-details">
                    <p><strong>Date de départ:</strong> {reservation.dateDepart}</p>
                    <p>
                      <strong>Identité:</strong> {reservation.civilite} {reservation.prenom} {reservation.nom}
                    </p>
                    <p><strong>Email:</strong> {reservation.email}</p>
                    <p><strong>Téléphone:</strong> {reservation.telephone}</p>
                    <p><strong>Nationalité:</strong> {reservation.nationalite}</p>
                    <p>
                      <strong>Adresse:</strong> {reservation.adresse.numero} {reservation.adresse.rue}, 
                      {reservation.adresse.codePostal} {reservation.adresse.ville}
                    </p>
                    {reservation.besoinsSpeciaux && (
                      <p><strong>Besoins spéciaux:</strong> {reservation.besoinsSpeciaux}</p>
                    )}
                    <p>
                      <strong>Date d'inscription:</strong> {
                        new Date(reservation.dateInscription).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      }
                    </p>
                    {reservation.chambre && (
                      <p>
                        <strong>Type de chambre:</strong> {formatChambreType(reservation.chambre)}
                        {reservation.chambre.supplement > 0 && (
                          <span className="supplement-info">
                            (Supplément: {reservation.chambre.supplement}€)
                          </span>
                        )}
                      </p>
                    )}
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
      )}
    </div>
  );
};

export default MesReservations; 