const VoyageStep = ({ onNext, selectedType, setSelectedType }) => {
  return (
    <div className="voyage-options">
      <div 
        className={`voyage-card ${selectedType === 'hajj' ? 'selected' : ''}`}
        onClick={() => setSelectedType('hajj')}
      >
        <div className="selection-indicator">
          {selectedType === 'hajj' && <span className="check-mark">✓</span>}
        </div>
        <h3>Hajj</h3>
        <p>Pèlerinage à la Mecque</p>
      </div>

      <div 
        className={`voyage-card ${selectedType === 'omra' ? 'selected' : ''}`}
        onClick={() => setSelectedType('omra')}
      >
        <div className="selection-indicator">
          {selectedType === 'omra' && <span className="check-mark">✓</span>}
        </div>
        <h3>Omra</h3>
        <p>Petit pèlerinage</p>
      </div>
    </div>
  );
}; 