// src/components/Loader.js
import './styles.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;