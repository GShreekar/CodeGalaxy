// src/pages/LanguagePage.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import SnippetCard from '../components/SnippetCard';
import Loader from '../components/Loader';
import { fetchSnippets } from '../features/snippetSlice';
import './LanguagePage.css';

const LanguagePage = () => {
  const { language } = useParams();
  const dispatch = useDispatch();
  const { snippets, loading, error } = useSelector(state => state.snippets);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Convert language parameter to match the stored format
    const formattedLanguage = language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
    dispatch(fetchSnippets({ language: formattedLanguage }));
  }, [dispatch, language]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedLanguage = language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
    dispatch(fetchSnippets({ language: formattedLanguage, search: query }));
  };

  const filteredSnippets = snippets.filter(snippet => 
    snippet.language.toLowerCase() === language.toLowerCase()
  );

  if (loading) return <Loader />;

  return (
    <div className="language-page">
      <div className="container py-4">
        <h1 className="language-title text-center mb-4">
          {language.charAt(0).toUpperCase() + language.slice(1)} Snippets
        </h1>

        <div className="search-container mb-4">
          <SearchBar 
            onSearch={handleSearch}
            placeholder={`Search ${language} snippets...`}
          />
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {filteredSnippets.length === 0 ? (
          <div className="no-snippets">
            <h3 className="text-center neon-text">
              No {language} snippets found
            </h3>
          </div>
        ) : (
          <div className="row g-4">
            {filteredSnippets.map(snippet => (
              <div key={snippet._id} className="col-12 col-md-6 col-lg-4">
                <SnippetCard snippet={snippet} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguagePage;