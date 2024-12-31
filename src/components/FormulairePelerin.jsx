import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './FormulairePelerin.css';
import MesReservations from './MesReservations';

const API_URL = "https://hajj-omra-booking-backend.onrender.com/pelerin";
const isDev = process.env.NODE_ENV === 'development';

const FormulairePelerin = ({ 
  onRetour = () => window.location.href = '/',
  packType = 'hajj' 
}) => {
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
        adresse: {
          numero: '',
          rue: '',
          ville: '',
          codePostal: ''
        },
        typePelerinage: packType,
        dateDepart: packType === 'hajj' ? 
          'Du 01 Mai au 20 Juin 2025' : 
          'Du 15 Mars au 05 Avril 2025',
        besoinsSpeciaux: '',
        chambre: {
          type: 'quadruple',
          supplement: 0
        },
      }
    }
  ]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [reservations, setReservations] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showReservations, setShowReservations] = useState(false);
  const [personnes, setPersonnes] = useState([]);
  const [showPersonneForm, setShowPersonneForm] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
          adresse: {
            numero: '',
            rue: '',
            ville: '',
            codePostal: ''
          },
          typePelerinage: formulaires[0].data.typePelerinage,
          dateDepart: formulaires[0].data.dateDepart,
          besoinsSpeciaux: ''
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
        },
        body: JSON.stringify(donnees)
      });

      const resultat = await response.json();

      // Vérifier si la réponse contient une erreur
      if (!response.ok) {
        throw new Error(resultat.message || `Erreur HTTP: ${response.status}`);
      }

      console.log('✅ Données envoyées avec succès:', resultat);
      return resultat;

    } catch (erreur) {
      console.error("❌ Erreur lors de l'envoi:", erreur);
      throw erreur;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' }); // Réinitialiser le message

    try {
      // Soumettre tous les formulaires
      const resultats = await Promise.all(
        formulaires.map(async (form) => {
          console.log(`Envoi des données pour ${form.data.prenom} ${form.data.nom}...`);
          try {
            const resultat = await envoyerDonnees(form.data);
            return resultat;
          } catch (error) {
            console.error('❌ Erreur détaillée:', error);
            throw error;
          }
        })
      );

      console.log('✅ Tous les formulaires ont été envoyés:', resultats);
      
      setMessage({
        type: 'success',
        text: `✅ ${formulaires.length} inscription(s) enregistrée(s) avec succès !
               Email utilisé : ${formulaires[0].data.email}
               Cliquez sur "Voir mes réservations" pour vérifier.`
      });

      // Réinitialiser le formulaire après succès
      setFormulaires([{
        id: 1,
        data: {
          civilite: '',
          nom: '',
          prenom: '',
          nationalite: '',
          telephone: '',
          email: '',
          adresse: {
            numero: '',
            rue: '',
            ville: '',
            codePostal: ''
          },
          typePelerinage: packType,
          dateDepart: packType === 'hajj' ? 
            'Du 01 Mai au 20 Juin 2025' : 
            'Du 15 Mars au 05 Avril 2025',
          besoinsSpeciaux: '',
          chambre: {
            type: 'quadruple',
            supplement: 0
          }
        }
      }]);

      // Scroll en haut pour voir le message de succès
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi:', error);
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
        adresse: {
          numero: Math.floor(Math.random() * 100 + 1).toString(),
          rue: getRandomElement(donneesFictives.rues),
          ville: getRandomElement(donneesFictives.villes),
          codePostal: getRandomElement(donneesFictives.codesPostaux)
        },
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

  const searchReservations = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      console.log('🔍 Recherche pour email:', searchEmail);
      const response = await fetch(`${API_URL}/search?email=${searchEmail}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const data = await response.json();
      console.log('✅ Réservations trouvées:', data);
      
      if (data && data.length > 0) {
        setReservations(data);
        setShowModal(true);
      } else {
        setReservations([]);
        setMessage({
          type: 'error',
          text: 'Aucune réservation trouvée pour cet email.'
        });
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la recherche des réservations.'
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
        const response = await fetch(`${API_URL}/pelerin/clean`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'raouanedev@gmail.com'  // Email admin
          })
        });
        const data = await response.json();
        alert('✅ ' + data.message);
      } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur lors du nettoyage');
      }
    }
  };

  if (showReservations) {
    return <MesReservations onRetour={() => setShowReservations(false)} />;
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
          onClick={() => {
            setShowModal(true);
            setMessage({ type: '', text: '' });
          }}
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
            onClick={async () => {
              if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer toutes les données ?')) {
                try {
                  const response = await fetch(`${API_URL}/api/pelerins/clean`, {
                    method: 'DELETE'
                  });
                  const data = await response.json();
                  alert('✅ ' + data.message);
                } catch (error) {
                  console.error('Erreur:', error);
                  alert('❌ Erreur lors du nettoyage');
                }
              }
            }} 
            className="test-button clean-test"
          >
            Nettoyer DB
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {formulaires.map((formulaire, index) => (
          <div key={formulaire.id} className="formulaire-section">
            <h3>Personne {index + 1}</h3>
            {formulaires.length > 1 && (
              <button
                type="button"
                onClick={() => supprimerFormulaire(formulaire.id)}
                className="supprimer-formulaire-btn"
              >
                Supprimer
              </button>
            )}

            {/* Type de Pèlerinage (visible pour tous les formulaires) */}
            <div className="form-section">
              <h3>Type de Pèlerinage</h3>
              <div className="type-pelerinage-selector">
                <div 
                  className={`type-option ${formulaire.data.typePelerinage === 'hajj' ? 'selected' : ''}`}
                  onClick={() => handleChange(formulaire.id, 'typePelerinage', 'hajj')}
                >
                  <h4>Hajj 2025</h4>
                  <p>Grand pèlerinage</p>
                  <p className="details">Du 01 Mai au 20 Juin 2025</p>
                  <p className="price">À partir de 6990€/personne</p>
                </div>
                <div 
                  className={`type-option ${formulaire.data.typePelerinage === 'omra' ? 'selected' : ''}`}
                  onClick={() => handleChange(formulaire.id, 'typePelerinage', 'omra')}
                >
                  <h4>Omra Ramadhan</h4>
                  <p>Petit pèlerinage</p>
                  <p className="details">Du 15 Mars au 05 Avril 2025</p>
                  <p className="price">À partir de 2900€/personne</p>
                </div>
              </div>
            </div>

            {/* Informations Personnelles */}
            <div className="form-section">
              <h3>Informations Personnelles</h3>
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

            <div className="form-section">
              <h3>Contact</h3>
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
              
              {/* Nouveaux champs d'adresse */}
              <div className="form-row">
                <div className="form-group">
                  <label className="required-field">Numéro</label>
                  <input
                    type="text"
                    value={formulaire.data.adresse.numero}
                    onChange={(e) => handleChange(formulaire.id, 'adresse', {
                      ...formulaire.data.adresse,
                      numero: e.target.value
                    })}
                    placeholder="Ex: 12"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="required-field">Rue</label>
                  <input
                    type="text"
                    value={formulaire.data.adresse.rue}
                    onChange={(e) => handleChange(formulaire.id, 'adresse', {
                      ...formulaire.data.adresse,
                      rue: e.target.value
                    })}
                    placeholder="Ex: rue de la Paix"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="required-field">Code Postal</label>
                  <input
                    type="text"
                    value={formulaire.data.adresse.codePostal}
                    onChange={(e) => handleChange(formulaire.id, 'adresse', {
                      ...formulaire.data.adresse,
                      codePostal: e.target.value
                    })}
                    placeholder="Ex: 75001"
                    pattern="[0-9]{5}"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="required-field">Ville</label>
                  <input
                    type="text"
                    value={formulaire.data.adresse.ville}
                    onChange={(e) => handleChange(formulaire.id, 'adresse', {
                      ...formulaire.data.adresse,
                      ville: e.target.value
                    })}
                    placeholder="Ex: Paris"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Informations Complémentaires</h3>
              <div className="form-group">
                <label>Besoins Spéciaux</label>
                <textarea
                  value={formulaire.data.besoinsSpeciaux}
                  onChange={(e) => handleChange(formulaire.id, 'besoinsSpeciaux', e.target.value)}
                  placeholder="Précisez vos besoins particuliers (régime alimentaire, assistance médicale, etc.)"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Choix de Chambre</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Type de chambre (optionnel)</label>
                  <select
                    value={formulaire.data.chambre?.type || 'quadruple'}
                    onChange={(e) => {
                      const type = e.target.value;
                      let supplement = 0;
                      
                      switch(type) {
                        case 'double':
                          supplement = 500;
                          break;
                        case 'triple':
                          supplement = 250;
                          break;
                        default:
                          supplement = 0;
                      }
                      
                      handleChange(formulaire.id, 'chambre', {
                        type: type,
                        supplement: supplement
                      });
                    }}
                    className="chambre-select"
                  >
                    <option value="quadruple">Chambre standard</option>
                    <option value="triple">Chambre pour 3 personnes (+250€)</option>
                    <option value="double">Chambre pour 2 personnes (+500€)</option>
                  </select>
                </div>
              </div>

              {formulaire.data.chambre?.supplement > 0 && (
                <div className="chambre-info">
                  <p>
                    <strong>Supplément chambre :</strong> {formulaire.data.chambre.supplement}€
                    <span className="chambre-detail">
                      (Inclus dans le prix final)
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="form-actions">
          {formulaires.length < 5 && (
            <button
              type="button"
              onClick={ajouterFormulaire}
              className="ajouter-button"
            >
              + Ajouter une personne
            </button>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              'Envoi en cours...'
            ) : (
              <>
                ENVOYER
                {formulaires.length > 1 && (
                  <span className="personnes-count">
                    ({formulaires.length} personnes)
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="modal-close" 
              onClick={() => {
                setShowModal(false);
                setReservations(null);
                setSearchEmail('');
              }}
            >
              ×
            </button>
            <h3>Rechercher mes réservations</h3>
            
            <form onSubmit={searchReservations} className="search-form">
              <div className="form-group">
                <label>Email utilisé lors de l'inscription</label>
                <input
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  required
                  placeholder="Entrez votre email"
                />
              </div>
              <button 
                type="submit" 
                className="search-button"
                disabled={searching}
              >
                {searching ? 'Recherche...' : 'Rechercher'}
              </button>
            </form>

            {reservations && (
              <div className="reservations-results">
                {reservations.length > 0 ? (
                  <div className="reservations-list">
                    {reservations.map((reservation, index) => (
                      <div key={index} className="reservation-card">
                        <div className="reservation-header">
                          <h4>{reservation.typePelerinage === 'hajj' ? 'Hajj 2025' : 'Omra Ramadhan'}</h4>
                          <span className="person-number">Personne {index + 1}</span>
                        </div>
                        <div className="reservation-details">
                          <p><strong>Date de départ:</strong> {reservation.dateDepart}</p>
                          <p>
                            <strong>Identité:</strong> {reservation.civilite} {reservation.prenom} {reservation.nom}
                          </p>
                          <p><strong>Email:</strong> {reservation.email}</p>
                          <p><strong>Téléphone:</strong> {reservation.telephone}</p>
                          <p><strong>Nationalité:</strong> {reservation.nationalite}</p>
                          <p>
                            <strong>Adresse:</strong> {reservation.adresse.numero} {reservation.adresse.rue}, 
                            {reservation.adresse.codePostal} {reservation.adresse.ville}
                          </p>
                          {reservation.besoinsSpeciaux && (
                            <p><strong>Besoins spéciaux:</strong> {reservation.besoinsSpeciaux}</p>
                          )}
                          <p>
                            <strong>Date d'inscription:</strong> {
                              new Date(reservation.dateInscription).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-reservations">
                    <p>Aucune réservation trouvée pour cet email.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showScrollTop && (
        <button 
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Retour en haut"
        >
          ↑
        </button>
      )}
    </div>
  );
};

FormulairePelerin.propTypes = {
  onRetour: PropTypes.func,
  packType: PropTypes.string
};

export default FormulairePelerin; 