import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SnippetCard from '../components/SnippetCard';
import Loader from '../components/Loader';
import { fetchSnippets } from '../features/snippetSlice';
import { LANGUAGES } from '../utils/languages';
import '../components/styles.css';
import './SnippetsPage.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' }
];

const SnippetsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') || 'newest';
  const language = searchParams.get('language') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { items, page, pages, loading } = useSelector(state => state.snippets);

  useEffect(() => {
    dispatch(fetchSnippets({ search: searchQuery, sort, language, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, sort, language]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(fetchSnippets({ search: query, sort, language, page: 1 }));
  };

  const handleSortChange = (e) => {
    const next = new URLSearchParams(searchParams);
    if (e.target.value === 'newest') {
      next.delete('sort');
    } else {
      next.set('sort', e.target.value);
    }
    setSearchParams(next);
  };

  const handleLanguageClick = (lang) => {
    const next = new URLSearchParams(searchParams);
    if (lang === language) {
      next.delete('language');
    } else {
      next.set('language', lang);
    }
    setSearchParams(next);
  };

  const handleLoadMore = () => {
    dispatch(fetchSnippets({ search: searchQuery, sort, language, page: page + 1 }));
  };

  if (loading && page === 1) return <Loader />;

  return (
    <div className="snippets-page">
      <div className="container py-4">
        <div className="search-container mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="filters-section mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <label htmlFor="sort-select" className="text-white mb-0">Sort by</label>
            <select
              id="sort-select"
              className="form-select neon-select w-auto"
              value={sort}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="language-chip-row">
            <button
              type="button"
              className={`language-chip ${!language ? 'active' : ''}`}
              onClick={() => handleLanguageClick('')}
              aria-pressed={!language}
            >
              All Languages
            </button>
            {LANGUAGES.map(lang => (
              <button
                type="button"
                key={lang}
                className={`language-chip ${language === lang ? 'active' : ''}`}
                onClick={() => handleLanguageClick(lang)}
                aria-pressed={language === lang}
              >
                {lang}
              </button>
            ))}
          </div>
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
