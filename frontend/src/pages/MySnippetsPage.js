// src/pages/MySnippetsPage.js
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SnippetCard from '../components/SnippetCard';
import { fetchSnippets } from '../features/snippetSlice';
import './MySnippetsPage.css';

const MySnippetsPage = () => {
  const dispatch = useDispatch();
  const { snippets, loading } = useSelector(state => state.snippets);
  const { user } = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchSnippets());
  }, [dispatch]);

  const userSnippets = snippets.filter(snippet => 
    snippet.author === user?.username &&
    snippet.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onSearch={(query) => setSearchQuery(query)}
            placeholder="Search my snippets..."
          />
        </div>

        {userSnippets.length === 0 ? (
          <div className="no-snippets">
            <h3 className="text-center neon-text">
              {searchQuery ? 'No matching snippets found' : 'No snippets yet'}
            </h3>
          </div>
        ) : (
          <div className="row g-4">
            {userSnippets.map(snippet => (
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

export default MySnippetsPage;