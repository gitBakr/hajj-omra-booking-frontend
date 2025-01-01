import React, { createContext, useState, useContext, useEffect } from 'react';

const API_URL = "https://hajj-omra-booking-backend.onrender.com";

const OffresContext = createContext();

export const OffresProvider = ({ children }) => {
  const [offres, setOffres] = useState({
    hajj: [],
    omra: []
  });

  // Charger les offres depuis l'API
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        console.log('Fetching offres from:', `${API_URL}/offres`);
        const response = await fetch(`${API_URL}/offres`);
        
        if (!response.ok) throw new Error('Erreur lors du chargement des offres');
        const data = await response.json();
        
        console.log('Données reçues du backend:', data);
        
        // Nettoyer les données en ajoutant un type par défaut si nécessaire
        const cleanedData = data.map(offre => ({
          ...offre,
          type: offre.type?.toLowerCase() || 'hajj' // Par défaut, on met 'hajj'
        }));
        
        // Organiser les offres par type
        const hajjOffres = cleanedData.filter(offre => offre.type === 'hajj');
        const omraOffres = cleanedData.filter(offre => offre.type === 'omra');
        
        console.log('Offres filtrées:', { 
          hajj: hajjOffres, 
          omra: omraOffres,
          totalOffres: data.length,
          typesUniques: [...new Set(data.map(o => o.type))]
        });
        
        setOffres({
          hajj: hajjOffres,
          omra: omraOffres
        });
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchOffres();
  }, []);

  // Fonction pour ajouter une offre
  const addOffre = async (newOffre) => {
    try {
      const response = await fetch(`${API_URL}/offres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          ...newOffre,
          email: 'raouanedev@gmail.com'
        })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout de l\'offre');
      const addedOffre = await response.json();

      // Ajouter le type manuellement car le backend ne le renvoie pas
      const completeOffre = {
        ...addedOffre,
        type: newOffre.type
      };

      setOffres(prev => {
        // S'assurer que les tableaux existent
        const prevHajj = Array.isArray(prev.hajj) ? prev.hajj : [];
        const prevOmra = Array.isArray(prev.omra) ? prev.omra : [];

        // Créer le nouvel état en fonction du type
        return {
          hajj: newOffre.type === 'hajj' ? [...prevHajj, completeOffre] : prevHajj,
          omra: newOffre.type === 'omra' ? [...prevOmra, completeOffre] : prevOmra
        };
      });

      return completeOffre;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const updateOffre = async (offre) => {
    try {
      const response = await fetch(`${API_URL}/offres/${offre._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          ...offre,
          email: 'raouanedev@gmail.com'
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la modification');
      const updatedOffre = await response.json();

      // Ajouter le type si le backend ne le renvoie pas
      const completeOffre = {
        ...updatedOffre,
        type: offre.type // Garder le type de l'offre originale
      };

      setOffres(prev => {
        // S'assurer que les tableaux existent
        const prevHajj = Array.isArray(prev.hajj) ? prev.hajj : [];
        const prevOmra = Array.isArray(prev.omra) ? prev.omra : [];

        return {
          hajj: completeOffre.type === 'hajj' 
            ? prevHajj.map(o => o._id === completeOffre._id ? completeOffre : o)
            : prevHajj,
          omra: completeOffre.type === 'omra'
            ? prevOmra.map(o => o._id === completeOffre._id ? completeOffre : o)
            : prevOmra
        };
      });

      return completeOffre;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const deleteOffre = async (id) => {
    try {
      const response = await fetch(`${API_URL}/offres/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          email: 'raouanedev@gmail.com'
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      setOffres(prev => ({
        hajj: prev.hajj.filter(o => o._id !== id),
        omra: prev.omra.filter(o => o._id !== id)
      }));
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  return (
    <OffresContext.Provider value={{ offres, setOffres, addOffre, updateOffre, deleteOffre }}>
      {children}
    </OffresContext.Provider>
  );
};

export const useOffres = () => useContext(OffresContext); 