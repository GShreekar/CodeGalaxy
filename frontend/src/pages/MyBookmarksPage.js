import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import SnippetCard from '../components/SnippetCard';
import Loader from '../components/Loader';
import { fetchUserBookmarks } from '../features/snippetSlice';
import './MySnippetsPage.css';

const MyBookmarksPage = () => {
  const dispatch = useDispatch();
  const { items, page, pages, loading } = useSelector(state => state.snippets);

  useEffect(() => {
    dispatch(fetchUserBookmarks({ page: 1 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(fetchUserBookmarks({ page: page + 1 }));
  };

  if (loading && page === 1) return <Loader />;

  return (
    <div className="my-snippets-page">
      <div className="container py-4">
        <div className="header-section">
          <h2 className="page-title neon-text">My Bookmarks</h2>
          <Link to="/snippets" className="btn btn-create">
            Browse Snippets
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="no-snippets">
            <h3 className="text-center neon-text">No bookmarks yet</h3>
            <p className="text-center text-muted">
              Bookmark a snippet you want to come back to — yours or anyone else's.
            </p>
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

export default MyBookmarksPage;
