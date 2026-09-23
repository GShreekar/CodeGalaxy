import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SnippetCard from '../components/SnippetCard';
import Loader from '../components/Loader';
import { fetchSnippets } from '../features/snippetSlice';
import './MySnippetsPage.css';

const MySnippetsPage = () => {
  const dispatch = useDispatch();
  const { items, page, pages, loading } = useSelector(state => state.snippets);
  const { user } = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.username) {
      dispatch(fetchSnippets({ author: user.username, page: 1 }));
    }
  }, [dispatch, user?.username]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(fetchSnippets({ author: user.username, search: query, page: 1 }));
  };

  const handleLoadMore = () => {
    dispatch(fetchSnippets({ author: user.username, search: searchQuery, page: page + 1 }));
  };

  if (loading && page === 1) return <Loader />;

  return (
    <div className="my-snippets-page">
      <div className="container py-4">
        <div className="header-section">
          <h2 className="page-title neon-text">My Snippets</h2>
          <Link to="/create-snippet" className="btn btn-create">
            Create Snippet
          </Link>
        </div>

        <div className="search-section mb-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search my snippets..."
          />
        </div>

        {items.length === 0 ? (
          <div className="no-snippets">
            <h3 className="text-center neon-text">
              {searchQuery ? 'No matching snippets found' : 'No snippets yet'}
            </h3>
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

export default MySnippetsPage;
