import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import SnippetCard from '../components/SnippetCard';
import Loader from '../components/Loader';
import { fetchAllUserSnippets } from '../features/snippetSlice';
import './UserSnippetsPage.css';

const UserSnippetsPage = () => {
  const dispatch = useDispatch();
  const { snippets, loading } = useSelector(state => state.snippets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    dispatch(fetchAllUserSnippets());
  }, [dispatch]);

  const users = [...new Set(snippets.map(snippet => snippet.author))];

  const filteredSnippets = snippets.filter(snippet =>
    (selectedUser ? snippet.author === selectedUser : true) &&
    (searchQuery ? 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    )
  );

  if (loading) return <Loader />;

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
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <SearchBar 
                onSearch={setSearchQuery}
                placeholder="Search snippets..."
              />
            </div>
          </div>
        </div>

        {filteredSnippets.length === 0 ? (
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
              {filteredSnippets.map(snippet => (
                <div key={snippet._id} className="col-12 col-md-6 col-lg-4">
                  <SnippetCard snippet={snippet} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserSnippetsPage;