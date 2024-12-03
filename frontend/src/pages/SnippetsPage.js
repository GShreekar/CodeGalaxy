// src/pages/SnippetsPage.js
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
  const { snippets, loading } = useSelector(state => state.snippets);

  useEffect(() => {
    dispatch(fetchSnippets());
  }, [dispatch]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(fetchSnippets({ search: query }));
  };

  if (loading) return <Loader />;

  return (
    <div className="snippets-page">
      <div className="container py-4">
        <div className="search-container mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {snippets.length === 0 ? (
          <div className="no-snippets">
            <h3 className="text-center neon-text">No snippets found</h3>
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

export default SnippetsPage;