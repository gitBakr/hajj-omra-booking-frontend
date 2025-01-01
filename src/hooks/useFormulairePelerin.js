import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const baseUrl = 'https://hajj-omra-booking-backend.onrender.com';

// Constantes EmailJS
const EMAILJS_SERVICE_ID = 'service_izw1pma';
const EMAILJS_TEMPLATE_ID = 'template_bqkl86r';
const EMAILJS_PUBLIC_KEY = 'ktYqhkd2pNkTEmsbp';

export const useFormulairePelerin = (packType) => {
  const [offres, setOffres] = useState({ hajj: [], omra: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
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

  useEffect(() => {
    const loadOffres = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/offres`);
        const data = await response.json();
        
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
      const cleanEmail = formulaire.email.trim().toLowerCase();
      console.log('Données du formulaire:', formulaire);

      if (!formulaire.offre) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner une offre' });
        return;
      }
      if (!formulaire.civilite || !formulaire.nom || !formulaire.prenom || !formulaire.nationalite) {
        setMessage({ type: 'error', text: 'Veuillez remplir tous les champs d\'informations personnelles' });
        return;
      }
      if (!formulaire.telephone || !formulaire.email) {
        setMessage({ type: 'error', text: 'Veuillez remplir tous les champs de contact' });
        return;
      }
      if (!formulaire.chambre) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner une chambre' });
        return;
      }

      const pelerinData = {
        civilite: formulaire.civilite,
        nom: formulaire.nom,
        prenom: formulaire.prenom,
        nationalite: formulaire.nationalite,
        telephone: formulaire.telephone,
        email: formulaire.email,
        typePelerinage: formulaire.offre.type || (formulaire.offre.titre.toLowerCase().includes('hajj') ? 'hajj' : 'omra'),
        offre: {
          _id: formulaire.offre._id,
          titre: formulaire.offre.titre,
          prix: Number(formulaire.offre.prix),
          type: formulaire.offre.type
        },
        chambre: {
          type: formulaire.chambre.type,
          supplement: Number(formulaire.chambre.supplement || 0)
        }
      };
      console.log('Type de pèlerinage:', pelerinData.typePelerinage);
      console.log('Offre complète:', formulaire.offre);
      console.log('Données à envoyer:', pelerinData);

      const response = await fetch(`${baseUrl}/pelerin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(pelerinData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur détaillée du serveur:', errorData);
        
        // Gestion des messages d'erreur spécifiques
        if (errorData.message && errorData.message.includes('déjà enregistré')) {
          setMessage({ 
            type: 'error', 
            text: `⚠️ Une réservation existe déjà pour ${formulaire.civilite} ${formulaire.nom} ${formulaire.prenom}. 
                   Si c'est bien vous, vous pouvez consulter votre réservation avec votre email.
                   Si ce n'est pas vous, veuillez nous contacter.`
          });
        } else {
          throw new Error(`Erreur lors de l'envoi: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      console.log('Réponse de la BD:', data);

      console.log('Envoi de l\'email...');
      try {
        const emailParams = {
          to_email: cleanEmail,
          to_name: `${formulaire.civilite} ${formulaire.nom} ${formulaire.prenom}`.trim(),
          user_email: cleanEmail,
          reservation_id: data._id.slice(-6).toUpperCase(),
          date: new Date().toLocaleDateString('fr-FR'),
          type_voyage: pelerinData.typePelerinage.toUpperCase(),
          nationalite: String(formulaire.nationalite || ''),
          telephone: String(formulaire.telephone || ''),
          type_chambre: String(formulaire.chambre?.type || '').toUpperCase(),
          prix_base: String(formulaire.offre.prix),
          supplement: String(formulaire.chambre?.supplement || '0'),
          prix_total: String(Number(formulaire.offre.prix) + Number(formulaire.chambre?.supplement || 0))
        };

        console.log('Paramètres email à envoyer:', emailParams);

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          emailParams,
          EMAILJS_PUBLIC_KEY
        );

        console.log('✅ Email envoyé avec succès');
      } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        console.error('Détails des paramètres qui ont échoué:', emailParams);
        throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
      }

      setMessage({
        type: 'success',
        text: `🎉 Félicitations ! Votre réservation a été enregistrée avec succès. 
               Un email de confirmation vient de vous être envoyé à l'adresse ${cleanEmail}. 
               Vous pouvez consulter votre réservation à tout moment avec votre email.`
      });

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