import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import SnippetCard from '../components/SnippetCard';
import Loader from '../components/Loader';
import { fetchTrendingSnippets } from '../features/snippetSlice';
import './HomePage.css';

const QUICK_LANGUAGES = ['TypeScript', 'Python', 'Rust', 'Go', 'JavaScript'];

const HomePage = () => {
  const dispatch = useDispatch();
  const { trending, trendingLoading } = useSelector(state => state.snippets);

  useEffect(() => {
    dispatch(fetchTrendingSnippets({ limit: 6 }));
  }, [dispatch]);

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <span className="hero-kicker">CodeGalaxy Registry</span>
          <h1 className="main-title">
            Discover, share, and remix <span className="accent-gradient">production-grade</span> code snippets.
          </h1>
          <p className="hero-description">
            The curated developer showcase and snippet hub for modern engineering teams.
            Real code, real context, zero boilerplate noise.
          </p>
          <div className="search-container">
            <SearchBar placeholder="Search snippets by keyword, language, or tag..." />
          </div>
          <div className="hero-quick-filters">
            <span className="hero-quick-filters-label">Quick filters:</span>
            {QUICK_LANGUAGES.map((lang) => (
              <Link key={lang} to={`/snippets?language=${encodeURIComponent(lang)}`} className="language-chip">
                {lang}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="trending-section">
        <div className="container">
          <span className="section-kicker">Live Stream</span>
          <h2 className="section-title">Trending This Week</h2>
          <p className="section-subtitle">Surgically tested and peer-vetted solutions from the community.</p>
          {trendingLoading ? (
            <Loader />
          ) : trending.length === 0 ? (
            <p className="text-center text-muted">No trending snippets yet — be the first to publish one.</p>
          ) : (
            <div className="row g-4">
              {trending.map(snippet => (
                <div key={snippet._id} className="col-12 col-md-6 col-lg-4">
                  <SnippetCard snippet={snippet} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
