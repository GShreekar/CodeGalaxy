import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchSnippetById, addComment } from '../features/snippetSlice';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import SnippetCard from '../components/SnippetCard';
import './SnippetDetailPage.css';

// public detail page: reading (and the OG tags below) needs no login, only
// posting a comment does — this is the "permalink" a snippet gets shared by
const SnippetDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentSnippet, loading } = useSelector(state => state.snippets);
  const { user } = useSelector(state => state.auth);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchSnippetById(id));
  }, [dispatch, id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await dispatch(addComment({
        snippetId: id,
        text: commentText
      })).unwrap();
      setCommentText('');
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to add comment. Please try again.');
    }
  };

  // guard against a stale currentSnippet from a previously-viewed id while
  // this page's own fetch is still in flight
  if (loading || !currentSnippet || currentSnippet._id !== id) return <Loader />;

  const metaDescription = currentSnippet.description?.slice(0, 160);

  return (
    <div className="comment-page">
      <Helmet>
        <title>{currentSnippet.title} — CodeGalaxy</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={currentSnippet.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={window.location.href} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="container py-4">
        <SnippetCard snippet={currentSnippet} />

        <div className="comments-section">
          <h4 className="comments-title neon-text mb-4">Comments</h4>

          {error && <Alert type="danger" message={error} className="mb-3" />}

          {user ? (
            <form onSubmit={handleSubmitComment} className="comment-form mb-4">
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-comment mt-2">
                Add Comment
              </button>
            </form>
          ) : (
            <div className="login-prompt mb-4">
              <Link to="/login" className="neon-link">Log in</Link> to leave a comment.
            </div>
          )}

          <div className="comments-list">
            {currentSnippet.comments?.length === 0 ? (
              <p className="text-center">No comments yet. Be the first to comment!</p>
            ) : (
              currentSnippet.comments?.map((comment) => (
                <div key={comment._id} className="comment-card">
                  <div className="comment-header">
                    <span className="comment-author">{comment.username}</span>
                  </div>
                  <div className="comment-body">
                    {comment.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnippetDetailPage;
