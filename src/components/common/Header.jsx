import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

export const Header = ({ onShowReservations }) => {
  return (
    <div className="header-container">
      <button 
        className="reservations-btn"
        onClick={onShowReservations}
      >
        🔍 Voir mes réservations
      </button>
      
      <h1 className="main-title">
        Inscription au Hajj et Omra
      </h1>
    </div>
  );
};

Header.propTypes = {
  onShowReservations: PropTypes.func.isRequired
}; 