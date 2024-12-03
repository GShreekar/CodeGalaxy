// src/pages/HomePage.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import SnippetCard from '../components/SnippetCard';
import { fetchSnippets } from '../features/snippetSlice';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { snippets, loading } = useSelector(state => state.snippets);

  useEffect(() => {
    dispatch(fetchSnippets());
  }, [dispatch]);

  const trendingSnippets = [...snippets]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <h1 className="main-title">CodeGalaxy</h1>
          <p className="hero-description">
            Explore the universe of code snippets. Share, discover, and learn from developers worldwide.
            Your cosmic journey through programming starts here.
          </p>
          <div className="search-container">
            <SearchBar placeholder="Search the galaxy of code..." />
          </div>
        </div>
      </div>

      <div className="trending-section">
        <div className="container">
          <h2 className="section-title">Trending Snippets</h2>
          <div className="row g-4">
            {trendingSnippets.map(snippet => (
              <div key={snippet._id} className="col-12 col-md-6 col-lg-4">
                <SnippetCard snippet={snippet} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;