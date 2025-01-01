import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

export const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  icon,
  disabled = false,
  fullWidth = false,
  onClick,
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
}; 