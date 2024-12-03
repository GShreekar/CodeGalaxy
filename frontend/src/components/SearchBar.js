// src/components/SearchBar.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <div className="input-group">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search snippets or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;