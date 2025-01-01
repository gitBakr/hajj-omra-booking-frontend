import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './FormulairePelerin.css';
import MesReservations from './MesReservations';
import emailjs from '@emailjs/browser';
import { offresService } from '../services/offresService';

const API_URL = "https://hajj-omra-booking-backend.onrender.com/pelerin";
const isDev = process.env.NODE_ENV === 'development';

// Ajouter ces constantes pour EmailJS
const EMAILJS_SERVICE_ID = "service_izw1pma";
const EMAILJS_TEMPLATE_ID = "template_bqkl86r";
const EMAILJS_PUBLIC_KEY = "ktYqhkd2pNkTEmsbp";

const FormulairePelerin = ({ 
  onRetour = () => window.location.href = '/',
  packType = 'hajj' 
}) => {
  const [offres, setOffres] = useState({ hajj: [], omra: [] });
  
  // Charger les offres au montage du composant
  useEffect(() => {
    const loadOffres = async () => {
      try {
        const data = await offresService.getOffres();
        setOffres(data);
      } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
      }
    };
    
    loadOffres();
  }, []);

  // Vérification des props avec valeur par défaut pour onRetour
  const handleRetour = () => {
    if (typeof onRetour === 'function') {
      onRetour();
    } else {
      console.warn('onRetour n\'est pas défini, utilisation du comportement par défaut');
      window.location.href = '/';
    }
  };

  // Validation des props - uniquement en développement
  if (process.env.NODE_ENV === 'development' && (!onRetour || !packType)) {
    console.error('Props manquantes:', { onRetour, packType });
    return (
      <div className="error-container">
        <h2>Erreur de chargement</h2>
        <p>Une erreur est survenue lors du chargement du formulaire.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="error-button"
        >
          Retourner à l'accueil
        </button>
      </div>
    );
  }

  const [formulaires, setFormulaires] = useState([
    {
      id: 1,
      data: {
        civilite: '',
        nom: '',
        prenom: '',
        nationalite: '',
        telephone: '',
        email: '',
        typePelerinage: 'hajj',
        dateDepart: 'Du 01 Mai au 20 Juin 2025',
        besoinsSpeciaux: '',
        offreId: '',
        chambre: {
          type: 'quadruple',
          supplement: 0
        }
      }
    }
  ]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [showReservations, setShowReservations] = useState(false);
  const [personnes, setPersonnes] = useState([]);
  const [showPersonneForm, setShowPersonneForm] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceInfo, setPriceInfo] = useState({ basePrice: 0, supplement: 0, total: 0 });
  const [currentStep, setCurrentStep] = useState(1);

  // Données pour la génération aléatoire
  const donneesFictives = {
    civilites: ['M.', 'Mme', 'Mlle'],
    noms: ['Martin', 'Dubois', 'Bernard', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'],
    prenoms: ['Jean', 'Marie', 'Pierre', 'Sophie', 'Michel', 'Catherine', 'André', 'Philippe', 'Claire', 'Laurent'],
    nationalites: ['Française', 'Belge', 'Suisse', 'Canadienne', 'Marocaine', 'Algérienne', 'Tunisienne', 'Sénégalaise'],
    rues: ['rue de la Paix', 'avenue des Champs-Élysées', 'boulevard Haussmann', 'rue du Commerce', 'rue de Rivoli'],
    villes: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Nantes', 'Strasbourg'],
    codesPostaux: ['75001', '69001', '13001', '31000', '33000', '59000', '44000', '67000'],
    besoinsSpeciaux: [
      'Régime sans gluten',
      'Assistance médicale requise',
      'Fauteuil roulant nécessaire',
      'Régime végétarien',
      'Allergie aux arachides',
      'Diabétique',
      'Assistance pour la marche',
      '',
    ]
  };

  // Fonction pour générer un numéro de téléphone aléatoire
  const genererTelephone = () => {
    const prefixes = ['06', '07'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const numero = Array(8).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    return `${prefix}${numero}`;
  };

  // Fonction pour enlever les accents et caractères spéciaux
  const normaliserTexte = (texte) => {
    return texte
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlève les accents
      .replace(/[^a-z0-9]/gi, ''); // Enlève les caractères spéciaux
  };

  // Fonction pour générer un email à partir du nom et prénom
  const genererEmail = (nom, prenom) => {
    const nomNormalise = normaliserTexte(nom.toLowerCase());
    const prenomNormalise = normaliserTexte(prenom.toLowerCase());
    const domaines = ['gmail.com', 'yahoo.fr', 'hotmail.com', 'outlook.fr', 'orange.fr'];
    const domaine = domaines[Math.floor(Math.random() * domaines.length)];
    const random = Math.floor(Math.random() * 100);
    return `${prenomNormalise}.${nomNormalise}${random}@${domaine}`;
  };

  // Fonction pour obtenir un élément aléatoire d'un tableau
  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

  const ajouterFormulaire = () => {
    setFormulaires([
      ...formulaires,
      {
        id: formulaires.length + 1,
        data: {
          civilite: '',
          nom: '',
          prenom: '',
          nationalite: '',
          telephone: '',
          email: '',
          typePelerinage: formulaires[0].data.typePelerinage,
          dateDepart: formulaires[0].data.dateDepart,
          besoinsSpeciaux: '',
          chambre: {
            type: 'quadruple',
            supplement: 0
          }
        }
      }
    ]);
  };

  const handleChange = (id, name, value) => {
    setFormulaires(formulaires.map(form => {
      if (form.id === id) {
        if (name === 'typePelerinage') {
          return {
            ...form,
            data: {
              ...form.data,
              [name]: value,
              dateDepart: value === 'hajj' ? 
                'Du 01 Mai au 20 Juin 2025' : 
                'Du 15 Mars au 05 Avril 2025'
            }
          };
        }
        return {
          ...form,
          data: {
            ...form.data,
            [name]: value
          }
        };
      }
      return form;
    }));
  };

  const supprimerFormulaire = (id) => {
    if (formulaires.length > 1) {
      setFormulaires(formulaires.filter(form => form.id !== id));
    }
  };

  const envoyerDonnees = async (donnees) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          ...donnees,
          email: 'raouanedev@gmail.com'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erreur HTTP: ${response.status}`);
      }

      const resultat = await response.json();
      console.log('✅ Données envoyées avec succès:', resultat);
      return resultat;

    } catch (erreur) {
      console.error("❌ Erreur lors de l'envoi:", erreur);
      throw erreur;
    }
  };

  // Modifier la fonction d'envoi d'email
  const envoyerEmailConfirmation = async (email, details) => {
    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          to_name: details.prenom,
          type_pelerinage: details.typePelerinage,
          date_depart: details.dateDepart,
          nombre_personnes: details.nombrePersonnes
        }
      );
      console.log('✉️ Email envoyé avec succès:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  };

  // Ajouter une fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setFormulaires([{
      id: 1,
      data: {
        civilite: '',
        nom: '',
        prenom: '',
        nationalite: '',
        telephone: '',
        email: '',
        typePelerinage: 'hajj',
        dateDepart: 'Du 01 Mai au 20 Juin 2025',
        besoinsSpeciaux: '',
        chambre: {
          type: 'quadruple',
          supplement: 0
        }
      }
    }]);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modifier handleSubmit pour utiliser resetForm après succès
  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Envoyer les données au serveur
      const resultats = await Promise.all(
        formulaires.map(async (form) => {
          const resultat = await envoyerDonnees(form.data);
          return resultat;
        })
      );

      // Envoyer l'email de confirmation
      await envoyerEmailConfirmation(formulaires[0].data.email, {
        prenom: formulaires[0].data.prenom,
        typePelerinage: formulaires[0].data.typePelerinage,
        dateDepart: formulaires[0].data.dateDepart,
        nombrePersonnes: formulaires.length
      });

      setMessage({
        type: 'success',
        text: `✅ ${formulaires.length} inscription(s) enregistrée(s) avec succès !
               Un email de confirmation a été envoyé à : ${formulaires[0].data.email}
               Vous pouvez consulter vos réservations à tout moment.`
      });

      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        resetForm();
        setMessage({ type: '', text: '' });
      }, 3000);

      // Scroll en haut pour voir le message de succès
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('❌ Erreur:', error);
      setMessage({
        type: 'error',
        text: `❌ Erreur: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const remplirTest = () => {
    // Générer un email unique pour tous les formulaires
    const emailCommun = genererEmail(
      getRandomElement(donneesFictives.noms),
      getRandomElement(donneesFictives.prenoms)
    );

    // Remplir chaque formulaire avec des données différentes mais le même email
    const nouveauxFormulaires = formulaires.map(form => ({
      id: form.id,
      data: {
        civilite: getRandomElement(donneesFictives.civilites),
        nom: getRandomElement(donneesFictives.noms),
        prenom: getRandomElement(donneesFictives.prenoms),
        nationalite: getRandomElement(donneesFictives.nationalites),
        telephone: genererTelephone(),
        email: emailCommun,
        typePelerinage: formulaires[0].data.typePelerinage,
        dateDepart: formulaires[0].data.dateDepart,
        besoinsSpeciaux: getRandomElement(donneesFictives.besoinsSpeciaux),
      }
    }));

    setFormulaires(nouveauxFormulaires);
  };

  const closeMessage = () => {
    setMessage({ type: '', text: '' });
  };

  // Constante pour l'email admin
  const ADMIN_EMAIL = 'raouanedev@gmail.com';

  // Dans le composant FormulairePelerin, modifier la fonction searchReservations
  const searchReservations = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      console.log('🔍 Recherche pour email:', searchEmail);
      
      // Pour tous les utilisateurs (admin ou non), on redirige vers MesReservations
      setShowReservations(true);
      return;

    } catch (error) {
      console.error('❌ Erreur:', error);
      setMessage({
        type: 'error',
        text: 'Aucune réservation trouvée. Veuillez vérifier que vous avez entré le bon email.'
      });
    } finally {
      setSearching(false);
    }
  };

  const handleRetourClick = () => {
    if (typeof onRetour === 'function') {
      onRetour();
    }
  };

  // Vérifier si onRetour est défini au montage du composant
  useEffect(() => {
    if (!onRetour) {
      console.error('La prop onRetour est requise pour le composant FormulairePelerin');
    }
  }, [onRetour]);

  // Gérer l'affichage du bouton en fonction du scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pour le nettoyage de la base de données (en mode dev)
  const cleanDatabase = async () => {
    if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer toutes les données ?')) {
      try {
        const response = await fetch(`${API_URL}/clean`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        alert('✅ ' + data.message);
      } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur lors du nettoyage');
      }
    }
  };

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const calculerNombreChambres = () => {
    let chambresStandard = 0;
    let chambresSpeciales = 0;
    
    formulaires.forEach(form => {
      if (form.data.chambre?.type === 'quadruple') {
        // On accumule les clients standard pour diviser par 4 à la fin
        chambresStandard++;
      } else {
        // Pour triple ou double, une chambre par personne
        chambresSpeciales++;
      }
    });

    // Calcul final des chambres standard (arrondi supérieur)
    const totalChambresStandard = Math.ceil(chambresStandard / 4);
    const totalChambres = totalChambresStandard + chambresSpeciales;

    return {
      standard: totalChambresStandard,
      speciales: chambresSpeciales,
      total: totalChambres
    };
  };

  // Fonction de validation pour chaque étape
  const validateStep = () => {
    const form = formulaires[0].data;
    
    switch(currentStep) {
      case 1:
        // Validation du choix du voyage
        return form.typePelerinage !== '';
        
      case 2:
        // Validation des informations personnelles
        return (
          form.civilite !== '' &&
          form.nom !== '' &&
          form.prenom !== '' &&
          form.nationalite !== ''
        );
        
      case 3:
        // Validation des contacts (email et téléphone obligatoires, adresse optionnelle)
        return (
          form.telephone !== '' &&
          form.email !== '' &&
          form.email.includes('@') // Validation basique d'email
        );
        
      case 4:
        // Validation de l'hébergement
        return form.chambre?.type !== '';
        
      case 5:
        // Pas de validation nécessaire pour les infos complémentaires
        return true;
        
      default:
        return false;
    }
  };

  // Modifier la fonction nextStep pour inclure la validation
  const nextStep = () => {
    if (!validateStep()) {
      setMessage({
        type: 'error',
        text: 'Veuillez remplir tous les champs obligatoires avant de continuer'
      });
      return;
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setMessage({ type: '', text: '' }); // Effacer le message d'erreur
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Ajouter un style pour les champs requis non remplis
  const getInputStyle = (value) => {
    if (value === '' && validateStep() === false) {
      return 'input-error';
    }
    return '';
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Ajouter ces logs
  useEffect(() => {
    console.log('Offres disponibles:', offres);
    console.log('Offres Hajj:', offres.hajj);
    console.log('Offres Omra:', offres.omra);
  }, [offres]);

  if (showReservations) {
    return <MesReservations 
      onRetour={() => {
        setShowReservations(false);
        setSearchEmail('');  // Réinitialiser l'email de recherche
        setMessage({ type: '', text: '' }); // Nettoyer les messages
      }} 
      email={searchEmail}
    />;
  }

  return (
    <div className="formulaire-container" ref={formRef}>
      {message.text && (
        <div className={`message-container ${message.type}`}>
          <div className="message-content">
            {message.text}
            <button 
              className="close-message" 
              onClick={closeMessage}
              aria-label="Fermer le message"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="header-buttons">
        <button 
          type="button" 
          className="view-reservations-btn"
          onClick={() => setShowEmailModal(true)}
        >
          🔍 Voir mes réservations
        </button>
      </div>

      <h2>Inscription au Hajj et Omra</h2>
      
      {isDev && (
        <div className="buttons-test">
          <button type="button" onClick={remplirTest} className="test-button fill-test">
            Remplir test
          </button>
          <button 
            type="button" 
            onClick={cleanDatabase} 
            className="test-button clean-test"
          >
            Nettoyer DB
          </button>
          <button 
            type="button" 
            onClick={async () => {
              try {
                await envoyerEmailConfirmation('votre-email@test.com', {
                  prenom: 'Test',
                  typePelerinage: 'Hajj',
                  dateDepart: 'Du 01 Mai au 20 Juin 2025',
                  nombrePersonnes: 1
                });
                alert('✅ Email envoyé avec succès !');
              } catch (error) {
                alert('❌ Erreur : ' + error.message);
              }
            }} 
            className="test-button"
          >
            Tester Email
          </button>
        </div>
      )}
      
      <form onSubmit={(e) => e.preventDefault()}>
        {formulaires.map((formulaire, index) => (
          <div key={formulaire.id} className="formulaire-section">
            <h3>Personne {index + 1}</h3>

            {/* Indicateur d'étapes */}
            <div className="steps-indicator">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Voyage</div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Informations</div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Contact</div>
              <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>4. Hébergement</div>
              <div className={`step ${currentStep >= 5 ? 'active' : ''}`}>5. Compléments</div>
            </div>

            {/* Afficher uniquement l'étape courante */}
            {currentStep === 1 && (
              <div className="form-section">
                <div className="section-title">
                  <h3>1. Choix du voyage</h3>
                </div>

                <div className="voyage-selection">
                  <div className="voyage-type">
                    <h4>🕋 Offres Hajj</h4>
                    <div className="voyage-buttons">
                      {offres.hajj.map(offre => (
                        <button 
                          key={offre._id}
                          className={`voyage-btn ${formulaire.data.offreId === String(offre._id) ? 'selected' : ''}`}
                          onClick={() => {
                            setFormulaires(prevFormulaires => 
                              prevFormulaires.map(form => {
                                if (form.id === formulaire.id) {
                                  return {
                                    ...form,
                                    data: {
                                      ...form.data,
                                      offreId: String(offre._id),
                                      typePelerinage: offre.type,
                                      dateDepart: 'Du 01 Mai au 20 Juin 2025'
                                    }
                                  };
                                }
                                return form;
                              })
                            );
                          }}
                        >
                          <span className="voyage-titre">{offre.titre}</span>
                          <span className="voyage-prix">{offre.prix}€</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="voyage-type">
                    <h4>🌙 Offres Omra</h4>
                    <div className="voyage-buttons">
                      {offres.omra.map(offre => (
                        <button 
                          key={offre._id}
                          className={`voyage-btn ${formulaire.data.offreId === String(offre._id) ? 'selected' : ''}`}
                          onClick={() => {
                            setFormulaires(prevFormulaires => 
                              prevFormulaires.map(form => {
                                if (form.id === formulaire.id) {
                                  return {
                                    ...form,
                                    data: {
                                      ...form.data,
                                      offreId: String(offre._id),
                                      typePelerinage: offre.type,
                                      dateDepart: 'Du 15 Mars au 05 Avril 2025'
                                    }
                                  };
                                }
                                return form;
                              })
                            );
                          }}
                        >
                          <span className="voyage-titre">{offre.titre}</span>
                          <span className="voyage-prix">{offre.prix}€</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-section">
                <div className="section-title">
                  <h3>2. Informations Personnelles</h3>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="required-field">Civilité</label>
                    <select
                      value={formulaire.data.civilite}
                      onChange={(e) => handleChange(formulaire.id, 'civilite', e.target.value)}
                      required
                      className="civilite-select"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="M.">Monsieur</option>
                      <option value="Mme">Madame</option>
                      <option value="Mlle">Mademoiselle</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="required-field">Nom</label>
                    <input
                      type="text"
                      value={formulaire.data.nom}
                      onChange={(e) => handleChange(formulaire.id, 'nom', e.target.value)}
                      required
                      className={getInputStyle(formulaire.data.nom)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="required-field">Prénom</label>
                    <input
                      type="text"
                      value={formulaire.data.prenom}
                      onChange={(e) => handleChange(formulaire.id, 'prenom', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="required-field">Nationalité</label>
                    <input
                      type="text"
                      value={formulaire.data.nationalite}
                      onChange={(e) => handleChange(formulaire.id, 'nationalite', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-section">
                <div className="section-title">
                  <h3>3. Contact</h3>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="required-field">Téléphone</label>
                    <input
                      type="tel"
                      value={formulaire.data.telephone}
                      onChange={(e) => handleChange(formulaire.id, 'telephone', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="required-field">Email</label>
                    <input
                      type="email"
                      value={formulaire.data.email}
                      onChange={(e) => handleChange(formulaire.id, 'email', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="form-section">
                <div className="section-title">
                  <h3>4. Hébergement</h3>
                </div>
                <select
                  value={formulaire.data.chambre?.type || 'quadruple'}
                  onChange={(e) => {
                    const type = e.target.value;
                    let supplement = 0;
                    const basePrice = formulaire.data.typePelerinage === 'hajj' ? 6990 : 1490;
                    
                    switch(type) {
                      case 'triple':
                        supplement = 250;
                        break;
                      case 'double':
                        supplement = 500;
                        break;
                      default:
                        supplement = 0;
                    }
                    
                    setPriceInfo({
                      basePrice,
                      supplement,
                      total: basePrice + supplement
                    });
                    setShowPriceModal(true);
                    
                    setTimeout(() => {
                      setShowPriceModal(false);
                    }, 10000);
                    
                    handleChange(formulaire.id, 'chambre', {
                      type: type,
                      supplement: supplement
                    });
                  }}
                  className="form-input"
                >
                  <option value="quadruple">Chambre Quadruple (Standard - 4 personnes)</option>
                  <option value="triple">Chambre Triple (Supplément 250€)</option>
                  <option value="double">Chambre Double (Supplément 500€)</option>
                </select>
              </div>
            )}

            {currentStep === 5 && (
              <div className="form-section">
                <div className="section-title">
                  <h3>5. Informations Complémentaires</h3>
                </div>
                <div className="form-group">
                  <label>Besoins Spéciaux</label>
                  <textarea
                    value={formulaire.data.besoinsSpeciaux}
                    onChange={(e) => handleChange(formulaire.id, 'besoinsSpeciaux', e.target.value)}
                    placeholder="Précisez vos besoins particuliers (régime alimentaire, assistance médicale, etc.)"
                  />
                </div>
              </div>
            )}

            {/* Boutons de navigation */}
            <div className="step-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="prev-button">
                  ← Retour
                </button>
              )}
              {currentStep < 5 ? (
                <button type="button" onClick={nextStep} className="next-button">
                  Suivant →
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={handleSubmit} 
                  className="submit-button" 
                  disabled={loading}
                >
                  {loading ? 'Envoi en cours...' : 'ENVOYER'}
                </button>
              )}
            </div>
          </div>
        ))}
      </form>

      {showScrollTop && (
        <button 
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Retour en haut"
        >
          ↑
        </button>
      )}

      {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Voir mes réservations</h3>
            <button 
              className="modal-close" 
              onClick={() => setShowEmailModal(false)}
            >
              ×
            </button>
            <div className="form-group">
              <label>Email utilisé lors de l'inscription</label>
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                required
                placeholder="Entrez votre email"
                className="modal-input"
              />
            </div>
            <button 
              type="button"
              className="modal-submit-btn"
              onClick={() => {
                if (searchEmail) {
                  setShowEmailModal(false);
                  setShowReservations(true);
                }
              }}
            >
              Rechercher
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

FormulairePelerin.propTypes = {
  onRetour: PropTypes.func,
  packType: PropTypes.string
};

export default FormulairePelerin; 