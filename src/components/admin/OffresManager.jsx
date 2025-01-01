import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OffresManager.css';

const baseUrl = 'https://hajj-omra-booking-backend.onrender.com';
const ADMIN_EMAIL = 'raouanedev@gmail.com';

const OffresManager = () => {
  const navigate = useNavigate();
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    titre: '',
    prix: '',
    type: 'hajj'
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadOffres();
  }, []);

  const loadOffres = async () => {
    try {
      const response = await fetch(`${baseUrl}/offres`);
      if (!response.ok) throw new Error('Erreur de chargement');
      const data = await response.json();
      setOffres(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editMode 
        ? `${baseUrl}/offres/${editId}`
        : `${baseUrl}/offres`;

      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          email: ADMIN_EMAIL
        })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'opération');

      loadOffres();
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

    try {
      const response = await fetch(`${baseUrl}/offres/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: ADMIN_EMAIL })
      });

      if (!response.ok) throw new Error('Erreur de suppression');

      loadOffres();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (offre) => {
    setFormData({
      titre: offre.titre,
      prix: offre.prix,
      type: offre.type
    });
    setEditMode(true);
    setEditId(offre._id);
  };

  const resetForm = () => {
    setFormData({ titre: '', prix: '', type: 'hajj' });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="offres-manager">
      <div className="admin-header">
        <button onClick={() => navigate('/admin')} className="back-btn">
          ← Retour au tableau de bord
        </button>
        <h1>Gestion des Offres</h1>
      </div>

      <div className="form-section">
        <h2>{editMode ? 'Modifier l\'offre' : 'Ajouter une offre'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre</label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => setFormData({...formData, titre: e.target.value})}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Prix</label>
            <input
              type="number"
              value={formData.prix}
              onChange={(e) => setFormData({...formData, prix: e.target.value})}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="form-input"
            >
              <option value="hajj">Hajj</option>
              <option value="omra">Omra</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editMode ? 'Modifier' : 'Ajouter'}
            </button>
            {editMode && (
              <button type="button" onClick={resetForm} className="cancel-btn">
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="offres-list">
        <h2>Liste des offres</h2>
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="offres-grid">
            {offres.map(offre => (
              <div key={offre._id} className="offre-card">
                <div className="offre-header">
                  <h3>{offre.titre}</h3>
                  <span className={`type-badge ${offre.type || 'hajj'}`}>
                    {(offre.type || 'hajj').toUpperCase()}
                  </span>
                </div>
                <p className="offre-prix">{offre.prix} €</p>
                <div className="offre-actions">
                  <button onClick={() => handleEdit(offre)} className="edit-btn">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(offre._id)} className="delete-btn">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffresManager; 