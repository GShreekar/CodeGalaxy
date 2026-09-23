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
  const { items, page, pages, total, loading } = useSelector(state => state.snippets);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    dispatch(fetchSnippets({ search: query, page: 1 }));
  }, [dispatch, location.search]);

  const handleLoadMore = () => {
    dispatch(fetchSnippets({ search: searchQuery, page: page + 1 }));
  };

  if (loading && page === 1) return <Loader />;

  return (
    <div className="search-result-page">
      <div className="container py-4">
        <div className="search-header">
          <h2 className="neon-text">
            Search Results for "{searchQuery}"
          </h2>
          <p className="result-count">
            {total} {total === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {items.length === 0 ? (
          <div className="no-results">
            <h3 className="text-center">No snippets found</h3>
            <p className="text-center text-muted">
              Try different keywords or browse all snippets
            </p>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {items.map(snippet => (
                <div key={snippet._id} className="col-12 col-md-6 col-lg-4">
                  <SnippetCard snippet={snippet} highlightQuery={searchQuery} />
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

export default SearchResultPage;
