const API_URL = "https://hajj-omra-booking-backend.onrender.com";

export const offresService = {
  // Récupérer toutes les offres
  async getOffres() {
    const response = await fetch(`${API_URL}/offres`);
    if (!response.ok) throw new Error('Erreur lors du chargement des offres');
    const data = await response.json();
    return {
      hajj: data.filter(offre => offre.type === 'hajj'),
      omra: data.filter(offre => offre.type === 'omra')
    };
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