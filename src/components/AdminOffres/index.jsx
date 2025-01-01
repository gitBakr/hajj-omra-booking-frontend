import React, { useState, useEffect } from 'react';
import './styles.css';
import { offresService } from '../../services/offresService';
import OffreForm from './OffreForm';
import OffreList from './OffreList';

const AdminOffres = () => {
  const [offres, setOffres] = useState({ hajj: [], omra: [] });

  useEffect(() => {
    loadOffres();
  }, []);

  const loadOffres = async () => {
    try {
      const data = await offresService.getOffres();
      setOffres(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async (newOffer) => {
    try {
      await offresService.addOffre(newOffer);
      await loadOffres(); // Recharger les offres
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = async (offre) => {
    try {
      await offresService.updateOffre(offre);
      await loadOffres();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await offresService.deleteOffre(id);
        await loadOffres();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  return (
    <div className="admin-offres">
      <h2>Gestion des Offres</h2>
      <OffreForm onSubmit={handleSubmit} />
      
      <div className="offers-list">
        <OffreList 
          type="hajj"
          offres={offres.hajj}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        <OffreList 
          type="omra"
          offres={offres.omra}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default AdminOffres; 