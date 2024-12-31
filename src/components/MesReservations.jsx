import React, { useState, useEffect } from 'react';
import './MesReservations.css';

const API_URL = 'https://hajj-omra-booking-backend.onrender.com/pelerin';
const ADMIN_EMAIL = 'raouanedev@gmail.com';

const formatChambreType = (chambre) => {
  if (!chambre || !chambre.type) return 'Non spécifié';
  return chambre.type.charAt(0).toUpperCase() + chambre.type.slice(1);
};

const MesReservations = ({ onRetour, email }) => {
  const [reservations, setReservations] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  // Fonction de calcul des chambres
  const calculerNombreChambres = () => {
    if (!reservations) return { standard: 0, speciales: 0, total: 0 };
    
    let chambresStandard = 0;
    let chambresSpeciales = 0;
    
    reservations.forEach(reservation => {
      if (reservation.chambre?.type === 'quadruple') {
        chambresStandard++;
      } else {
        chambresSpeciales++;
      }
    });

    const totalChambresStandard = Math.ceil(chambresStandard / 4);
    const totalChambres = totalChambresStandard + chambresSpeciales;

    return {
      standard: totalChambresStandard,
      speciales: chambresSpeciales,
      total: totalChambres
    };
  };

  // Charger les réservations dès que le composant est monté
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${API_URL}/search?email=${email}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setReservations(data);

        // Vérifier si c'est l'admin
        if (email === ADMIN_EMAIL) {
          setIsAdmin(true);
          // Charger les stats pour l'admin...
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (email) {
      fetchReservations();
    }
  }, [email]);

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h2>
          {isAdmin ? 'Panel Administrateur - Toutes les Réservations' : 'Mes Réservations'}
        </h2>
        <button className="retour-btn" onClick={onRetour}>
          ← Retour au formulaire
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Afficher directement les résultats si on a un email */}
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
              {email === ADMIN_EMAIL && (
                <div className="admin-panel">
                  <h3>Statistiques</h3>
                  <div className="stats-container">
                    <div className="stat-item">
                      <h4>Chambres nécessaires</h4>
                      <p>Standard : {calculerNombreChambres().standard}</p>
                      <p>Spéciales : {calculerNombreChambres().speciales}</p>
                      <p>Total : {calculerNombreChambres().total}</p>
                    </div>
                  </div>
                </div>
              )}
              {reservations.map((reservation, index) => (
                <div key={index} className="reservation-card">
                  <div className="reservation-header">
                    <h3>{reservation.civilite} {reservation.nom} {reservation.prenom}</h3>
                    <span className="reservation-type">{reservation.typePelerinage}</span>
                  </div>
                  
                  <div className="reservation-details">
                    <p><strong>Nationalité :</strong> {reservation.nationalite}</p>
                    <p><strong>Email :</strong> {reservation.email}</p>
                    <p><strong>Téléphone :</strong> {reservation.telephone}</p>
                    <p><strong>Date de départ :</strong> {reservation.dateDepart}</p>
                    <p><strong>Type de chambre :</strong> {reservation.chambre.type}</p>
                    {reservation.besoinsSpeciaux && (
                      <p><strong>Besoins spéciaux :</strong> {reservation.besoinsSpeciaux}</p>
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

      {/* Afficher le formulaire de recherche uniquement si on n'a pas d'email */}
      {!email && (
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
      )}
    </div>
  );
};

export default MesReservations; 