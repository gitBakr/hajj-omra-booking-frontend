import React, { useState, useEffect } from 'react';
import './AdminOffres.css';

const API_URL = 'https://hajj-omra-booking-backend.onrender.com';

const AdminOffres = ({ onRetour, onRetourAccueil }) => {
  const [offres, setOffres] = useState({ hajj: [], omra: [] });
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('hajj');
  const [nouvelleOffre, setNouvelleOffre] = useState({
    titre: '',
    prix: ''
  });

  useEffect(() => {
    fetchOffres();
  }, []);

  const fetchOffres = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/offres`);
      const data = await response.json();
      setOffres(data || { hajj: [], omra: [] });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!nouvelleOffre.titre || !nouvelleOffre.prix) {
        alert('Veuillez remplir tous les champs');
        return;
      }

      const response = await fetch(`${API_URL}/offres`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          titre: nouvelleOffre.titre,
          prix: parseFloat(nouvelleOffre.prix),
          dateDepart: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Offre ajoutée:', data);
        
        setOffres(prev => ({
          ...prev,
          [selectedType]: [...(prev[selectedType] || []), { ...data, type: selectedType }]
        }));
        
        setNouvelleOffre({ titre: '', prix: '' });
      } else {
        throw new Error('Erreur lors de l\'ajout de l\'offre');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Erreur lors de l\'ajout de l\'offre');
    }
  };

  const supprimerOffre = async (id) => {
    try {
      await fetch(`${API_URL}/offres/${id}`, { method: 'DELETE' });
      fetchOffres();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="admin-dark">
      <button onClick={onRetour} className="retour-btn">
        ← Retour au formulaire
      </button>

      <div className="nav-buttons">
        <button 
          className={`nav-btn ${selectedType === 'hajj' ? 'active' : ''}`}
          onClick={() => setSelectedType('hajj')}
        >
          Réservations
        </button>
        <button 
          className={`nav-btn ${selectedType === 'omra' ? 'active' : ''}`}
          onClick={() => setSelectedType('omra')}
        >
          Gestion des Offres
        </button>
      </div>

      <h1 className="title">Gestion des Offres</h1>

      <div className="type-buttons">
        <button 
          className={`type-btn ${selectedType === 'hajj' ? 'active' : ''}`}
          onClick={() => setSelectedType('hajj')}
        >
          Hajj
        </button>
        <button 
          className={`type-btn ${selectedType === 'omra' ? 'active' : ''}`}
          onClick={() => setSelectedType('omra')}
        >
          Omra
        </button>
      </div>

      <div className="offre-form">
        <input
          type="text"
          placeholder="Titre de l'offre"
          value={nouvelleOffre.titre}
          onChange={(e) => setNouvelleOffre({...nouvelleOffre, titre: e.target.value})}
          className="input-dark"
        />
        <input
          type="number"
          placeholder="Prix"
          value={nouvelleOffre.prix}
          onChange={(e) => setNouvelleOffre({...nouvelleOffre, prix: e.target.value})}
          className="input-dark"
        />
        <button onClick={handleSubmit} className="btn-ajouter">
          Ajouter
        </button>
      </div>

      <div className="offres-list">
        <h2 className="section-title">Offres {selectedType === 'hajj' ? 'Hajj' : 'Omra'}</h2>
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <>
            {selectedType === 'hajj' && offres?.hajj ? (
              offres.hajj.map(offre => (
                <div key={offre._id} className="offre-item">
                  <div className="offre-content">
                    <span className="offre-titre">{offre.titre}</span>
                    <span className="offre-prix">{offre.prix}€</span>
                  </div>
                  <div className="offre-actions">
                    <button className="btn-edit">✎</button>
                    <button 
                      className="btn-delete"
                      onClick={() => supprimerOffre(offre._id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : selectedType === 'omra' && offres?.omra ? (
              offres.omra.map(offre => (
                <div key={offre._id} className="offre-item">
                  <div className="offre-content">
                    <span className="offre-titre">{offre.titre}</span>
                    <span className="offre-prix">{offre.prix}€</span>
                  </div>
                  <div className="offre-actions">
                    <button className="btn-edit">✎</button>
                    <button 
                      className="btn-delete"
                      onClick={() => supprimerOffre(offre._id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-offres">Aucune offre disponible</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOffres; 