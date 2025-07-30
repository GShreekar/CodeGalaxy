import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './styles.css';

const SearchBar = ({ onSearch, placeholder = "Search snippets..." }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (onSearch) {
      onSearch(trimmedQuery);
    } else if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <div className="input-group">
        <input
          type="text"
          className="form-control search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={100}
        />
        <button className="btn btn-primary" type="submit" disabled={!query.trim()}>
          <FaSearch />
          <span className="d-none d-sm-inline ms-1">Search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;