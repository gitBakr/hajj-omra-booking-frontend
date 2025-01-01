import React from 'react';
import PropTypes from 'prop-types';
import './MessageBanner.css';

export const MessageBanner = ({ message }) => {
  if (!message || !message.text) return null;

  return (
    <div className={`message-banner ${message.type}`}>
      {message.text}
      <button className="close-message" onClick={message.onClose}>
        ×
      </button>
    </div>
  );
};

MessageBanner.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string,
    text: PropTypes.string,
    onClose: PropTypes.func
  })
}; 