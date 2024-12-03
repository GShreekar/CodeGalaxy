// src/pages/SearchResultPage.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSnippets } from '../features/snippetSlice';
import SnippetCard from '../components/SnippetCard';
import Loader from '../components/Loader';
import './SearchResultPage.css';

const SearchResultPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { snippets, loading } = useSelector(state => state.snippets);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    dispatch(fetchSnippets({ search: query }));
  }, [dispatch, location.search]);

  if (loading) return <Loader />;

  return (
    <div className="search-result-page">
      <div className="container py-4">
        <div className="search-header">
          <h2 className="neon-text">
            Search Results for "{searchQuery}"
          </h2>
          <p className="result-count">
            {snippets.length} {snippets.length === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {snippets.length === 0 ? (
          <div className="no-results">
            <h3 className="text-center">No snippets found</h3>
            <p className="text-center text-muted">
              Try different keywords or browse all snippets
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {snippets.map(snippet => (
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

export default SearchResultPage;