import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import SnippetCard from '../components/SnippetCard';
import Loader from '../components/Loader';
import { fetchSnippets, fetchSnippetAuthors } from '../features/snippetSlice';
import './UserSnippetsPage.css';

const UserSnippetsPage = () => {
  const dispatch = useDispatch();
  const { items, page, pages, authors, loading } = useSelector(state => state.snippets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    dispatch(fetchSnippetAuthors());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSnippets({ excludeAuthor: 'CodeGalaxy', author: selectedUser, search: searchQuery, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedUser]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(fetchSnippets({ excludeAuthor: 'CodeGalaxy', author: selectedUser, search: query, page: 1 }));
  };

  const handleLoadMore = () => {
    dispatch(fetchSnippets({ excludeAuthor: 'CodeGalaxy', author: selectedUser, search: searchQuery, page: page + 1 }));
  };

  if (loading && page === 1) return <Loader />;

  return (
    <div className="user-snippets-page">
      <div className="container py-4">
        <h2 className="page-title neon-text text-center mb-4">
          Community Snippets
        </h2>

        <div className="filters-section mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <select
                className="form-select neon-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">All Users</option>
                {authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search snippets..."
              />
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="no-snippets">
            <h3 className="text-center neon-text">No snippets found</h3>
          </div>
        ) : (
          <>
            {selectedUser && (
              <h3 className="user-header neon-text mb-4">
                {selectedUser}'s Snippets
              </h3>
            )}
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

export default UserSnippetsPage;
