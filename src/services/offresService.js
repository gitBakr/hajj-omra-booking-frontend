const API_URL = "https://hajj-omra-booking-backend.onrender.com";

export const offresService = {
  // Récupérer toutes les offres
  async getOffres() {
    try {
      console.log('Fetching offres from:', `${API_URL}/offres`);
      const response = await fetch(`${API_URL}/offres`);
      
      if (!response.ok) throw new Error('Erreur lors du chargement des offres');
      
      const data = await response.json();
      console.log('Données reçues:', data);

      // Déduire le type à partir du titre
      const offresAvecType = data.map(offre => ({
        ...offre,
        type: offre.titre.toLowerCase().includes('hajj') ? 'hajj' : 'omra'
      }));
      
      return {
        hajj: offresAvecType.filter(offre => offre.type === 'hajj'),
        omra: offresAvecType.filter(offre => offre.type === 'omra')
      };
    } catch (error) {
      console.error('Erreur getOffres:', error);
      return { hajj: [], omra: [] };
    }
  },

  // Ajouter une offre
  async addOffre(offre) {
    const response = await fetch(`${API_URL}/offres`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...offre,
        email: 'raouanedev@gmail.com'
      })
    });
    if (!response.ok) throw new Error('Erreur lors de l\'ajout');
    return response.json();
  },

  // Modifier une offre
  async updateOffre(offre) {
    const response = await fetch(`${API_URL}/offres/${offre._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...offre,
        email: 'raouanedev@gmail.com'
      })
    });
    if (!response.ok) throw new Error('Erreur lors de la modification');
    return response.json();
  },

  // Supprimer une offre
  async deleteOffre(id) {
    const response = await fetch(`${API_URL}/offres/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'raouanedev@gmail.com'
      })
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
    return true;
  }
}; 