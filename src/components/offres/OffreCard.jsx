const OffreCard = ({ titre, prix, type, selected, onClick }) => {
  return (
    <div 
      className={`offre-card ${selected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      <div className="selection-indicator">
        {selected && <span className="check-mark">✓</span>}
      </div>
      <div className="offre-icon">
        {type === 'hajj' ? '🕋' : '🌙'}
      </div>
      <h3>{titre}</h3>
      <p className="prix">{prix}€</p>
    </div>
  );
}; 