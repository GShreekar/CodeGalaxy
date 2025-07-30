import { Link } from 'react-router-dom';
import './styles.css';

const CategoryCard = ({ language, count }) => {
  
  return (
    <div className="category-card">
      <div className="category-content">
        <h3 className="language-title">{language}</h3>
        <p className="snippet-count">
          {count} {count === 1 ? 'snippet' : 'snippets'}
        </p>
        <Link 
          to={`/language/${language.toLowerCase()}`} 
          className="explore-btn"
        >
          Explore
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;
