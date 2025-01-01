import React from 'react';
import './styles.css';
import { useOffres } from '../../context/OffresContext';
import OffreForm from './OffreForm';
import OffreList from './OffreList';

const AdminOffres = () => {
  const { offres, addOffre, updateOffre, deleteOffre } = useOffres();

  const handleSubmit = async (newOffer) => {
    try {
      console.log('Envoi de la nouvelle offre:', newOffer);
      await addOffre(newOffer);
      console.log('Offre ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  const handleEdit = async (offre) => {
    try {
      await updateOffre(offre);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await deleteOffre(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
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