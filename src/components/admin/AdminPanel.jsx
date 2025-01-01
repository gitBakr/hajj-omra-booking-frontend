import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { useNavigate } from 'react-router-dom';

const baseUrl = 'https://hajj-omra-booking-backend.onrender.com';
const ADMIN_EMAIL = 'raouanedev@gmail.com';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [pelerins, setPelerins] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    hajj: 0,
    omra: 0,
    chambres: { double: 0, triple: 0, quadruple: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/admin/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: ADMIN_EMAIL })
      });

      if (!response.ok) {
        console.error('Erreur serveur:', response.status);
        throw new Error('Erreur de chargement');
      }

      const data = await response.json();
      console.log('Données admin reçues:', data);
      setPelerins(data);

      // Calculer les statistiques
      const stats = {
        total: data.length,
        hajj: data.filter(p => p.typePelerinage === 'hajj').length,
        omra: data.filter(p => p.typePelerinage === 'omra').length,
        chambres: {
          double: data.filter(p => p.chambre?.type === 'double').length,
          triple: data.filter(p => p.chambre?.type === 'triple').length,
          quadruple: data.filter(p => p.chambre?.type === 'quadruple').length
        }
      };
      setStats(stats);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleCleanDB = async () => {
    if (!window.confirm('⚠️ Êtes-vous sûr de vouloir nettoyer la base de données ? Cette action est irréversible.')) {
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch(`${baseUrl}/admin/clean-db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: ADMIN_EMAIL })
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Réponse nettoyage:', data);

      setMessage({
        type: 'success',
        text: '✅ Base de données nettoyée avec succès !'
      });

      // Recharger la page après 2 secondes
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setMessage({
        type: 'error',
        text: '❌ Erreur lors du nettoyage de la base de données'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Retour à l'accueil
        </button>
        <h1>Administration</h1>
        <div className="admin-actions">
          <button onClick={() => navigate('/admin/offres')} className="manage-btn">
            Gérer les offres
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
          <button
            className="clean-db-btn"
            onClick={handleCleanDB}
            disabled={loading}
          >
            {loading ? 'Nettoyage...' : '🗑️ Nettoyer la base de données'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="stats-section">
        <h2>Statistiques</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Réservations</h3>
            <p>{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>Hajj</h3>
            <p>{stats.hajj}</p>
          </div>
          <div className="stat-card">
            <h3>Omra</h3>
            <p>{stats.omra}</p>
          </div>
        </div>

        <h3>Répartition des chambres</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Double</h4>
            <p>{stats.chambres.double}</p>
          </div>
          <div className="stat-card">
            <h4>Triple</h4>
            <p>{stats.chambres.triple}</p>
          </div>
          <div className="stat-card">
            <h4>Quadruple</h4>
            <p>{stats.chambres.quadruple}</p>
          </div>
        </div>
      </div>

      <div className="pelerins-section">
        <h2>Liste des Pèlerins</h2>
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="pelerins-list">
            {pelerins.map(pelerin => (
              <div key={pelerin._id} className="pelerin-card">
                <div className="selection-indicator">
                  <span className="check-mark">✓</span>
                </div>
                
                <div className="pelerin-header">
                  <h3>{pelerin.civilite} {pelerin.nom} {pelerin.prenom}</h3>
                  <span className={`type-badge ${pelerin.typePelerinage}`}>
                    {pelerin.typePelerinage.toUpperCase()}
                  </span>
                </div>
                
                <div className="pelerin-details">
                  <p><strong>Email:</strong> {pelerin.email}</p>
                  <p><strong>Téléphone:</strong> {pelerin.telephone}</p>
                  <p><strong>Nationalité:</strong> {pelerin.nationalite}</p>
                  <p><strong>Chambre:</strong> {pelerin.chambre?.type || 'Non spécifiée'}</p>
                  <p><strong>Date d'inscription:</strong> {new Date(pelerin.dateInscription).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 