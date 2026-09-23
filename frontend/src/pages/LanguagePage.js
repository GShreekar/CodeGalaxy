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
  const { items, page, pages, loading, error } = useSelector(state => state.snippets);
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
    setSearchQuery('');
    dispatch(fetchSnippets({ language: normalizedLanguage, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, language]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const normalizedLanguage = normalizeLanguageName(language);
    dispatch(fetchSnippets({ language: normalizedLanguage, search: query, page: 1 }));
  };

  const handleLoadMore = () => {
    const normalizedLanguage = normalizeLanguageName(language);
    dispatch(fetchSnippets({ language: normalizedLanguage, search: searchQuery, page: page + 1 }));
  };

  if (loading && page === 1) return <Loader />;

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

        {items.length === 0 ? (
          <div className="text-center">No snippets found</div>
        ) : (
          <>
            <div className="row g-4">
              {items.map(snippet => (
                <div key={snippet._id} className="col-12 col-md-6 col-lg-4">
                  <SnippetCard snippet={snippet} />
                </div>
              ))}
            </div>
            {page < pages && (
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={handleLoadMore} disabled={loading}>
                  {loading ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LanguagePage;
