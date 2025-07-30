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

  const normalizeLanguageName = (lang) => {
    const langMap = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'sql': 'SQL',
      'php': 'PHP'
    };
    return langMap[lang.toLowerCase()] || lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();
  };

  useEffect(() => {
    const normalizedLanguage = normalizeLanguageName(language);
    dispatch(fetchSnippets({ language: normalizedLanguage }));
  }, [dispatch, language]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const normalizedLanguage = normalizeLanguageName(language);
    dispatch(fetchSnippets({ language: normalizedLanguage, search: query }));
  };

  if (loading) return <Loader />;
  if (snippets.length === 0) return <div className="text-center">No snippets found</div>;

  return (
    <div className="language-page">
      <div className="container py-4">
        <h1 className="language-title text-center mb-4">
          {normalizeLanguageName(language)} Snippets
        </h1>

        <div className="search-container mb-4">
          <SearchBar 
            onSearch={handleSearch}
            placeholder={`Search ${normalizeLanguageName(language)} snippets...`}
          />
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="row g-4">
          {snippets.map(snippet => (
            <div key={snippet._id} className="col-12 col-md-6 col-lg-4">
              <SnippetCard snippet={snippet} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguagePage;