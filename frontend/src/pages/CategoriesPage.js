import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import './CategoriesPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getLanguageStats } from '../features/snippetSlice';

const CategoriesPage = () => {
  const languages = [
    'JavaScript', 'Python', 'Java', 'C++',
    'Ruby', 'PHP', 'Go', 'Swift',
    'Rust', 'TypeScript', 'Kotlin', 'SQL'
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { languageStats } = useSelector(state => state.snippets);

  useEffect(() => {
    dispatch(getLanguageStats());
  }, [dispatch]);

  const filteredLanguages = languages.filter(lang =>
    lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="categories-page">
      <div className="container py-4">
        <div className="search-container mb-4">
          <SearchBar onSearch={handleSearch} placeholder="Search languages..." />
        </div>

        <div className="row g-4">
          {filteredLanguages.map(language => (
            <div key={language} className="col-12 col-md-6 col-lg-4">
              <CategoryCard 
                language={language}
                count={languageStats?.find(stat => 
                  stat.language.toLowerCase() === language.toLowerCase()
                )?.count || 0}
              />
            </div>
          ))}
        </div>

        {filteredLanguages.length === 0 && (
          <div className="no-results">
            <h3 className="text-center neon-text">No languages found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;