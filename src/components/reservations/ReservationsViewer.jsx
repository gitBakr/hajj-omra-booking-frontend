import React, { useState } from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import './ReservationsViewer.css';

export const ReservationsViewer = ({ reservations, onClose }) => {
  const handleDownload = (reservation) => {
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // Définir les couleurs de la marque
    const goldColor = [218, 165, 32];
    const darkGray = [51, 51, 51];
    
    // En-tête avec logo (simulé avec du texte stylisé)
    doc.setFontSize(24);
    doc.setTextColor(...goldColor);
    doc.text('HAJJ & OMRA', 105, 20, { align: 'center' });
    
    // Sous-titre
    doc.setFontSize(14);
    doc.setTextColor(...darkGray);
    doc.text('AGENCE DE VOYAGE SPIRITUEL', 105, 30, { align: 'center' });
    
    // Ligne de séparation
    doc.setDrawColor(...goldColor);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Titre du document
    doc.setFontSize(20);
    doc.setTextColor(...goldColor);
    doc.text('Confirmation de Réservation', 105, 50, { align: 'center' });
    
    // Cadre d'informations principales
    doc.setDrawColor(...goldColor);
    doc.setLineWidth(0.1);
    doc.rect(20, 60, 170, 40);
    
    // Informations principales
    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    doc.text(`Référence: #${reservation._id.slice(-6).toUpperCase()}`, 25, 70);
    doc.text(`Date de réservation: ${new Date(reservation.dateInscription).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })}`, 25, 80);
    
    // Type de voyage (sans émoji)
    doc.setFontSize(16);
    doc.setTextColor(...goldColor);
    doc.text(`${reservation.typePelerinage.toUpperCase()}`, 25, 90);
    
    // Sections d'informations
    const drawSection = (title, content, startY) => {
      // Titre de section avec symboles simples au lieu d'émojis
      doc.setFillColor(...goldColor);
      doc.rect(20, startY, 170, 8, 'F');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      
      // Utiliser des symboles simples au lieu d'émojis
      const getIcon = (title) => {
        switch(title) {
          case 'INFORMATIONS PERSONNELLES': return '>';
          case 'CONTACT': return '>';
          case 'HÉBERGEMENT': return '>';
          case 'TARIFICATION': return '€';
          default: return '>';
        }
      };
      
      doc.text(`${getIcon(title)} ${title}`, 25, startY + 6);
      
      // Contenu
      doc.setTextColor(...darkGray);
      let y = startY + 15;
      content.forEach(line => {
        doc.text(line, 25, y);
        y += 8;
      });
      
      return y + 5; // Retourne la position Y pour la prochaine section
    };
    
    // Section Informations personnelles
    let nextY = drawSection('INFORMATIONS PERSONNELLES', [
      `Nom complet: ${reservation.civilite} ${reservation.nom} ${reservation.prenom}`,
      `Nationalité: ${reservation.nationalite}`
    ], 110);
    
    // Section Contact
    nextY = drawSection('CONTACT', [
      `Email: ${reservation.email}`,
      `Téléphone: ${reservation.telephone}`
    ], nextY);
    
    // Section Hébergement
    const hebergementInfo = [`Type de chambre: ${reservation.chambre?.type.toUpperCase()}`];
    if (reservation.chambre?.supplement > 0) {
      hebergementInfo.push(`Supplément: ${reservation.chambre.supplement}€`);
    }
    nextY = drawSection('HÉBERGEMENT', hebergementInfo, nextY);
    
    // Après la section hébergement, ajoutons la section tarification
    nextY = drawSection('TARIFICATION', [
      `Prix de base: ${reservation.offre?.prix || 0}€`,
      reservation.chambre?.supplement > 0 ? `Supplément chambre: +${reservation.chambre.supplement}€` : '',
      `Prix total: ${calculateTotal(reservation)}€`
    ].filter(Boolean), nextY);
    
    // Pied de page
    doc.setDrawColor(...goldColor);
    doc.line(20, 270, 190, 270);
    
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text('Pour toute question, contactez-nous:', 105, 280, { align: 'center' });
    doc.setTextColor(...goldColor);
    doc.text('contact@hajj-omra.fr | +33 (0)1 23 45 67 89', 105, 285, { align: 'center' });
    doc.text('www.hajj-omra.fr', 105, 290, { align: 'center' });
    
    // Télécharger le PDF
    doc.save(`reservation-${reservation._id.slice(-6)}.pdf`);
  };

  const calculateTotal = (reservation) => {
    let total = 0;
    
    // Prix de base de l'offre
    if (reservation.offre?.prix) {
      total += Number(reservation.offre.prix);
    }
    
    // Supplément chambre
    if (reservation.chambre?.supplement) {
      total += Number(reservation.chambre.supplement);
    }
    
    return total;
  };

  return (
    <div className="modal-overlay">
      <div className="reservations-modal">
        <div className="modal-header">
          <h2>Mes Réservations</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {reservations.length === 0 ? (
          <div className="no-reservations">
            <span className="icon">📭</span>
            <p>Aucune réservation trouvée</p>
          </div>
        ) : (
          <div className="reservations-list">
            {reservations.map(reservation => (
              <div key={reservation._id} className="reservation-card">
                <div className="reservation-header">
                  <div className="header-main">
                    <span className={`type-badge ${reservation.typePelerinage}`}>
                      {reservation.typePelerinage === 'hajj' ? '🕋' : '🌙'} {reservation.typePelerinage.toUpperCase()}
                    </span>
                    <span className="reservation-date">
                      Réservé le {new Date(reservation.dateInscription).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="reservation-id">
                    Référence: #{reservation._id.slice(-6).toUpperCase()}
                  </div>
                </div>

                <div className="reservation-body">
                  <div className="info-section">
                    <h3>👤 Informations personnelles</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Nom complet</label>
                        <p>{reservation.civilite} {reservation.nom} {reservation.prenom}</p>
                      </div>
                      <div className="info-item">
                        <label>Nationalité</label>
                        <p>{reservation.nationalite}</p>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>📞 Contact</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Email</label>
                        <p>{reservation.email}</p>
                      </div>
                      <div className="info-item">
                        <label>Téléphone</label>
                        <p>{reservation.telephone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>🏨 Hébergement</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Type de chambre</label>
                        <p className="chambre-type">
                          {reservation.chambre?.type.charAt(0).toUpperCase() + reservation.chambre?.type.slice(1)}
                        </p>
                      </div>
                      {reservation.chambre?.supplement > 0 && (
                        <div className="info-item">
                          <label>Supplément</label>
                          <p className="supplement">{reservation.chambre.supplement}€</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>💰 Tarification</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Offre sélectionnée</label>
                        <p>{reservation.offre?.titre}</p>
                        <p className="price">{reservation.offre?.prix}€</p>
                      </div>
                      {reservation.chambre?.supplement > 0 && (
                        <div className="info-item">
                          <label>Supplément chambre</label>
                          <p className="supplement">+{reservation.chambre.supplement}€</p>
                        </div>
                      )}
                      <div className="info-item total">
                        <label>Total</label>
                        <p className="total-price">{calculateTotal(reservation)}€</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="reservation-actions">
                  <button 
                    className="action-btn download"
                    onClick={() => handleDownload(reservation)}
                  >
                    <span>📥</span> Télécharger le récapitulatif
                  </button>
                  <button className="action-btn contact">
                    <span>✉️</span> Contacter l'agence
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

ReservationsViewer.propTypes = {
  reservations: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    civilite: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    prenom: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    telephone: PropTypes.string.isRequired,
    nationalite: PropTypes.string.isRequired,
    typePelerinage: PropTypes.string.isRequired,
    chambre: PropTypes.shape({
      type: PropTypes.string,
      supplement: PropTypes.number
    }),
    dateInscription: PropTypes.string.isRequired
  })).isRequired,
  onClose: PropTypes.func.isRequired
}; 