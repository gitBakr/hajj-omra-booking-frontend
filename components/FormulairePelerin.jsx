import React, { useState } from 'react';
import './FormulairePelerin.css';

const FormulairePelerin = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    nationalite: '',
    numeroPasport: '',
    dateExpirationPasport: '',
    adresse: '',
    telephone: '',
    email: '',
    typePelerinage: 'hajj',
    dateDepart: '',
    dateRetour: '',
    besoinsSpeciaux: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/pelerins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des données');
      }

      const result = await response.json();
      console.log('Données enregistrées avec succès:', result);
      
      setFormData({
        nom: '',
        prenom: '',
        dateNaissance: '',
        lieuNaissance: '',
        nationalite: '',
        numeroPasport: '',
        dateExpirationPasport: '',
        adresse: '',
        telephone: '',
        email: '',
        typePelerinage: 'hajj',
        dateDepart: '',
        dateRetour: '',
        besoinsSpeciaux: '',
      });

      alert('Inscription réussie !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    }
  };

  return (
    <div className="formulaire-container">
      <h2>Formulaire d'Inscription pour {formData.typePelerinage === 'hajj' ? 'le Hajj' : 'la Omra'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Tout votre JSX de formulaire ici */}
        <div className="form-group">
          <label>Type de Pèlerinage</label>
          <select 
            name="typePelerinage" 
            value={formData.typePelerinage}
            onChange={handleChange}
          >
            <option value="hajj">Hajj</option>
            <option value="omra">Omra</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        {/* Ajoutez tous les autres champs du formulaire ici */}

        <button type="submit" className="submit-button">
          Soumettre la demande
        </button>
      </form>
    </div>
  );
};

export default FormulairePelerin; 