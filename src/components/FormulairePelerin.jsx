import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FormulairePelerin.css';
import { useFormulairePelerin } from '../hooks/useFormulairePelerin';
import { FormStep1 } from './formulaire/FormStep1';
import { FormStep2 } from './formulaire/FormStep2';
import { FormStep3 } from './formulaire/FormStep3';
import { FormStep4 } from './formulaire/FormStep4';
import { MessageBanner } from './common/MessageBanner';
import { Header } from './common/Header';
import { StepIndicator } from './common/StepIndicator';
import { StepNavigation } from './common/StepNavigation';
import { EmailModal, PriceModal } from './modals';
import { useModals } from '../hooks/useModals';

const TEST_DATA = [
  {
    civilite: 'M.',
    prenom: 'Ahmed',
    nom: 'Benali',
    nationalite: 'Tunisienne',
    telephone: '0612345678',
    email: 'ahmed.test@gmail.com'
  },
  {
    civilite: 'Mme',
    prenom: 'Fatima',
    nom: 'Zahra',
    nationalite: 'Marocaine',
    telephone: '0687654321',
    email: 'fatima.test@gmail.com'
  },
  {
    civilite: 'M.',
    prenom: 'Karim',
    nom: 'Mansouri',
    nationalite: 'Algérienne',
    telephone: '0698765432',
    email: 'karim.test@gmail.com'
  }
];

const FormulairePelerin = ({ onRetour, packType }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const {
    showEmailModal,
    showPriceModal,
    openEmailModal,
    closeEmailModal,
    openPriceModal,
    closePriceModal
  } = useModals();

  const {
    offres,
    loading,
    formulaires,
    message,
    setMessage,
    handleChange,
    handleSubmit,
    handleOffreSelect,
    searchReservations
  } = useFormulairePelerin(setCurrentStep);

  const validateStep1 = () => {
    return formulaires[0]?.offre !== null;
  };

  const validateStep2 = () => {
    const f = formulaires[0];
    return f?.civilite && f?.nom && f?.prenom && f?.nationalite;
  };

  const validateStep3 = () => {
    const f = formulaires[0];
    return f?.telephone && f?.email;
  };

  const validateStep4 = () => {
    return formulaires[0]?.chambre !== null;
  };

  const nextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        if (!isValid) {
          setMessage({ type: 'error', text: 'Veuillez sélectionner une offre' });
        }
        break;
      case 2:
        isValid = validateStep2();
        if (!isValid) {
          setMessage({ type: 'error', text: 'Veuillez remplir tous les champs d\'informations personnelles' });
        }
        break;
      case 3:
        isValid = validateStep3();
        if (!isValid) {
          setMessage({ type: 'error', text: 'Veuillez remplir tous les champs de contact' });
        }
        break;
      case 4:
        isValid = validateStep4();
        if (!isValid) {
          setMessage({ type: 'error', text: 'Veuillez sélectionner une chambre' });
        }
        break;
      default:
        break;
    }

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setMessage(null); // Effacer le message d'erreur si la validation réussit
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleTestFill = () => {
    const randomData = TEST_DATA[Math.floor(Math.random() * TEST_DATA.length)];
    const randomChambre = {
      type: ['double', 'triple', 'quadruple'][Math.floor(Math.random() * 3)],
      supplement: [0, 250, 500][Math.floor(Math.random() * 3)]
    };

    handleChange(1, 'civilite', randomData.civilite);
    handleChange(1, 'prenom', randomData.prenom);
    handleChange(1, 'nom', randomData.nom);
    handleChange(1, 'nationalite', randomData.nationalite);
    handleChange(1, 'telephone', randomData.telephone);
    handleChange(1, 'email', randomData.email);
    handleChange(1, 'chambre', randomChambre);

    if (offres.hajj.length > 0 || offres.omra.length > 0) {
      const allOffres = [...offres.hajj, ...offres.omra];
      const randomOffre = allOffres[Math.floor(Math.random() * allOffres.length)];
      handleOffreSelect(randomOffre);
    }
  };

  return (
    <div className="formulaire-container">
      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={handleTestFill}
          className="test-fill-btn"
          title="Remplir avec des données de test"
        >
          🧪 Mode Test
        </button>
      )}
      <MessageBanner message={message} />
      <Header onShowReservations={openEmailModal} />

      <div className="form-content">
        <StepIndicator currentStep={currentStep} />

        <form onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && (
            <FormStep1
              offres={offres}
              loading={loading}
              onSelect={handleOffreSelect}
              selectedOffre={formulaires[0]?.offre}
            />
          )}
          
          {currentStep === 2 && (
            <FormStep2
              formulaire={formulaires[0]}
              onChange={(name, value) => handleChange(formulaires[0].id, name, value)}
            />
          )}

          {currentStep === 3 && (
            <FormStep3
              formulaire={formulaires[0]}
              onChange={(name, value) => handleChange(formulaires[0].id, name, value)}
            />
          )}

          {currentStep === 4 && (
            <FormStep4
              formulaire={formulaires[0]}
              onChange={(name, value) => handleChange(formulaires[0].id, name, value)}
            />
          )}

          <StepNavigation
            currentStep={currentStep}
            onPrev={prevStep}
            onNext={nextStep}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </form>
      </div>

      <EmailModal
        show={showEmailModal}
        onClose={closeEmailModal}
        onSubmit={searchReservations}
      />
    </div>
  );
};

FormulairePelerin.propTypes = {
  onRetour: PropTypes.func,
  packType: PropTypes.string
};

export default FormulairePelerin; 