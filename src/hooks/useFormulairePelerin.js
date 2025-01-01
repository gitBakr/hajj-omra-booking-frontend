import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const baseUrl = 'https://hajj-omra-booking-backend.onrender.com';

const EMAILJS_SERVICE_ID = "service_izw1pma";
const EMAILJS_TEMPLATE_ID = "template_bqkl86r";
const EMAILJS_PUBLIC_KEY = "ktYqhkd2pNkTEmsbp";

export const useFormulairePelerin = (packType) => {
  const [offres, setOffres] = useState({ hajj: [], omra: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Initialiser le formulaire avec un objet vide
  const [formulaires, setFormulaires] = useState([{
    id: 1,
    civilite: '',
    nom: '',
    prenom: '',
    nationalite: '',
    telephone: '',
    email: '',
    chambre: null,
    complements: [],
    offre: null
  }]);

  // Charger les offres
  useEffect(() => {
    const loadOffres = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/offres`);
        const data = await response.json();
        
        // Transformer le format des offres
        const formattedOffres = {
          hajj: data.filter(offre => offre.type === 'hajj' || offre.titre.toLowerCase().includes('hajj')),
          omra: data.filter(offre => offre.type === 'omra' || offre.titre.toLowerCase().includes('omra'))
        };
        
        setOffres(formattedOffres);
      } catch (error) {
        console.error('❌ Erreur chargement offres:', error);
        setMessage({ type: 'error', text: 'Erreur lors du chargement des offres' });
      } finally {
        setLoading(false);
      }
    };

    loadOffres();
  }, []);

  const handleChange = (id, name, value) => {
    setFormulaires(prev => prev.map(form => {
      if (form.id === id) {
        return { ...form, [name]: value };
      }
      return form;
    }));
  };

  const handleOffreSelect = (offre) => {
    setFormulaires(prev => prev.map(form => ({
      ...form,
      offre
    })));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log('Début de la soumission...');
      
      const formulaire = formulaires[0];
      console.log('Données du formulaire:', formulaire);

      if (!formulaire.offre) {
        console.log('Offre manquante');
        setMessage({ type: 'error', text: 'Veuillez sélectionner une offre' });
        return;
      }
      if (!formulaire.civilite || !formulaire.nom || !formulaire.prenom || !formulaire.nationalite) {
        console.log('Informations personnelles manquantes');
        setMessage({ type: 'error', text: 'Veuillez remplir tous les champs d\'informations personnelles' });
        return;
      }
      if (!formulaire.telephone || !formulaire.email) {
        console.log('Informations de contact manquantes');
        setMessage({ type: 'error', text: 'Veuillez remplir tous les champs de contact' });
        return;
      }
      if (!formulaire.chambre) {
        console.log('Chambre non sélectionnée');
        setMessage({ type: 'error', text: 'Veuillez sélectionner une chambre' });
        return;
      }

      // Préparation des données pour l'envoi
      const pelerinData = {
        // Champs requis
        civilite: formulaire.civilite,
        nom: formulaire.nom,
        prenom: formulaire.prenom,
        nationalite: formulaire.nationalite,
        telephone: formulaire.telephone,
        email: formulaire.email,
        typePelerinage: formulaire.offre.titre.toLowerCase().includes('hajj') ? 'hajj' : 'omra',
        
        // Champs optionnels
        chambre: {
          type: formulaire.chambre.type,
          supplement: formulaire.chambre.supplement || 0
        }
      };
      console.log('Données à envoyer:', pelerinData);

      // Envoi à la BD avec l'URL correcte pour créer un pèlerin
      console.log('Envoi à la BD...');
      const response = await fetch(`${baseUrl}/pelerin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(pelerinData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Erreur détaillée du serveur:', errorData);
        throw new Error(`Erreur lors de l'envoi: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse de la BD:', data);

      // Envoi de l'email de confirmation
      console.log('Envoi de l\'email...');
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: formulaire.email,
          to_name: `${formulaire.civilite} ${formulaire.nom} ${formulaire.prenom}`,
          reservation_id: data._id,
          offre_titre: formulaire.offre.titre,
          montant_total: pelerinData.montantTotal,
          type_chambre: formulaire.chambre.type
        },
        EMAILJS_PUBLIC_KEY
      );

      console.log('Email envoyé avec succès');

      // Message de succès
      setMessage({
        type: 'success',
        text: 'Votre réservation a été enregistrée avec succès !'
      });

      // Reset du formulaire
      setFormulaires([{
        id: 1,
        civilite: '',
        nom: '',
        prenom: '',
        nationalite: '',
        telephone: '',
        email: '',
        chambre: null,
        offre: null
      }]);

      // Scroll vers le haut de la page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    } catch (error) {
      console.error('❌ Erreur détaillée:', error);
      setMessage({
        type: 'error',
        text: 'Une erreur est survenue lors de l\'enregistrement de votre réservation. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const searchReservations = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/pelerin/search?email=${email}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Erreur recherche réservations:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    offres,
    loading,
    formulaires,
    message,
    setMessage,
    handleChange,
    handleSubmit,
    handleOffreSelect,
    searchReservations
  };
}; 