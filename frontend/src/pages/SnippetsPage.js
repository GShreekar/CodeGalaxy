import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SearchBar from '../components/SearchBar';
import SnippetCard from '../components/SnippetCard';
import Loader from '../components/Loader';
import { fetchSnippets } from '../features/snippetSlice';
import './SnippetsPage.css';

const SnippetsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { items, page, pages, loading } = useSelector(state => state.snippets);

  useEffect(() => {
    dispatch(fetchSnippets({ search: searchQuery, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(fetchSnippets({ search: query, page: 1 }));
  };

  const handleLoadMore = () => {
    dispatch(fetchSnippets({ search: searchQuery, page: page + 1 }));
  };

  if (loading && page === 1) return <Loader />;

  return (
    <div className="snippets-page">
      <div className="container py-4">
        <div className="search-container mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {items.length === 0 ? (
          <div className="no-snippets">
            <h3 className="text-center neon-text">No snippets found</h3>
          </div>
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

export default SnippetsPage;
