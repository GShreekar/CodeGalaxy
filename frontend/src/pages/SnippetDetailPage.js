import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  fetchSnippetById, addComment, fetchSnippetComments, updateComment,
  deleteComment, clearCurrentSnippet, clearComments
} from '../features/snippetSlice';
import { fetchUserProfile, clearUserProfile, toggleFollow } from '../features/userProfileSlice';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import SnippetCard from '../components/SnippetCard';
import Avatar from '../components/Avatar';
import { FaPen, FaTrash, FaCheck, FaTimes, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import './SnippetDetailPage.css';

const CommentItem = ({ comment, snippetId, canEdit, canDelete }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [error, setError] = useState('');
  const wasEdited = comment.updatedAt !== comment.createdAt;

  const handleSave = async () => {
    if (!editText.trim()) return;
    try {
      await dispatch(updateComment({ snippetId, commentId: comment._id, text: editText })).unwrap();
      setEditing(false);
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to update comment.');
    }
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this comment?')) return;
    dispatch(deleteComment({ snippetId, commentId: comment._id }));
  };

  return (
    <div className="comment-card">
      <div className="comment-header d-flex justify-content-between align-items-center">
        <span className="comment-author">
          {comment.username}
          {wasEdited && <span className="comment-edited ms-2">(edited)</span>}
        </span>
        {(canEdit || canDelete) && !editing && (
          <div className="comment-actions">
            {canEdit && (
              <button
                type="button"
                className="comment-action-btn"
                onClick={() => setEditing(true)}
                title="Edit comment"
                aria-label="Edit comment"
              >
                <FaPen />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                className="comment-action-btn"
                onClick={handleDelete}
                title="Delete comment"
                aria-label="Delete comment"
              >
                <FaTrash />
              </button>
            )}
          </div>
        )}
      </div>

      {error && <Alert type="danger" message={error} className="mb-2" />}

      {editing ? (
        <div className="comment-edit-form">
          <textarea
            className="form-control"
            rows="2"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            maxLength={1000}
          />
          <div className="comment-edit-actions mt-2">
            <button type="button" className="comment-action-btn" onClick={handleSave} title="Save" aria-label="Save comment">
              <FaCheck />
            </button>
            <button
              type="button"
              className="comment-action-btn"
              onClick={() => { setEditing(false); setEditText(comment.text); setError(''); }}
              title="Cancel"
              aria-label="Cancel edit"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <div className="comment-body">{comment.text}</div>
      )}
    </div>
  );
};

// public detail page: reading (and the OG tags below) needs no login, only
// posting a comment does — this is the "permalink" a snippet gets shared by
const SnippetDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentSnippet, loading, comments } = useSelector(state => state.snippets);
  const { user } = useSelector(state => state.auth);
  const { profile: authorProfile } = useSelector(state => state.userProfile);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [followBusy, setFollowBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchSnippetById(id));
    dispatch(fetchSnippetComments({ snippetId: id, page: 1 }));
    return () => {
      dispatch(clearCurrentSnippet());
      dispatch(clearComments());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentSnippet?.author) return;
    dispatch(fetchUserProfile(currentSnippet.author));
    return () => {
      dispatch(clearUserProfile());
    };
  }, [dispatch, currentSnippet?.author]);

  const handleToggleFollow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFollowBusy(true);
    try {
      await dispatch(toggleFollow(currentSnippet.author)).unwrap();
    } finally {
      setFollowBusy(false);
    }
  };

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

  const handleLoadMore = () => {
    dispatch(fetchSnippetComments({ snippetId: id, page: comments.page + 1 }));
  };

  // guard against a stale currentSnippet from a previously-viewed id while
  // this page's own fetch is still in flight
  if (loading || !currentSnippet || currentSnippet._id !== id) return <Loader />;

  const metaDescription = currentSnippet.description?.slice(0, 160);
  const isSnippetOwner = Boolean(user) && currentSnippet.author === user.username;

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
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="detail-breadcrumb-sep">/</span>
          <Link to={`/language/${currentSnippet.language.toLowerCase()}`}>{currentSnippet.language}</Link>
          <span className="detail-breadcrumb-sep">/</span>
          <span className="detail-breadcrumb-current">{currentSnippet.title}</span>
        </nav>

        <div className="snippet-detail-grid">
          <div className="snippet-detail-main">
            <SnippetCard snippet={currentSnippet} detailed />

            <div className="comments-section">
              <h4 className="comments-title neon-text mb-4">Discussion ({comments.total})</h4>

              {error && <Alert type="danger" message={error} className="mb-3" />}

              {user ? (
                <form onSubmit={handleSubmitComment} className="comment-form mb-4">
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Share benchmarks, edge-cases, or optimizations..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      maxLength={1000}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-comment mt-2">
                    Comment
                  </button>
                </form>
              ) : (
                <div className="login-prompt mb-4">
                  <Link to="/login" className="neon-link">Log in</Link> to leave a comment.
                </div>
              )}

              <div className="comments-list">
                {comments.items.length === 0 && !comments.loading ? (
                  <p className="text-center">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.items.map((comment) => {
                    const isCommentAuthor = Boolean(user) && (comment.author === user._id || comment.username === user.username);
                    return (
                      <CommentItem
                        key={comment._id}
                        comment={comment}
                        snippetId={id}
                        canEdit={isCommentAuthor}
                        canDelete={isCommentAuthor || isSnippetOwner}
                      />
                    );
                  })
                )}
              </div>

              {comments.loading && <Loader />}

              {!comments.loading && comments.page < comments.pages && (
                <div className="text-center mt-3">
                  <button type="button" className="btn btn-comment" onClick={handleLoadMore}>
                    Load more comments
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="snippet-detail-aside">
            {authorProfile && authorProfile.username === currentSnippet.author && (
              <div className="author-card">
                <Avatar username={authorProfile.username} size={56} />
                <Link to={`/user/${encodeURIComponent(authorProfile.username)}`} className="author-card-name">
                  {authorProfile.name}
                </Link>
                <span className="author-card-username">@{authorProfile.username}</span>

                <div className="author-card-stats">
                  <div>
                    <span className="author-card-stat-value">{authorProfile.snippetCount}</span>
                    <span className="author-card-stat-label">Snippets</span>
                  </div>
                  <div>
                    <span className="author-card-stat-value">{authorProfile.totalUpvotes}</span>
                    <span className="author-card-stat-label">Upvotes</span>
                  </div>
                  <div>
                    <span className="author-card-stat-value">{authorProfile.followerCount}</span>
                    <span className="author-card-stat-label">Followers</span>
                  </div>
                </div>

                {(!user || user.username !== authorProfile.username) && (
                  <button
                    type="button"
                    className={`btn btn-follow author-card-follow-btn ${authorProfile.isFollowing ? 'following' : ''}`}
                    onClick={handleToggleFollow}
                    disabled={followBusy}
                  >
                    {authorProfile.isFollowing ? <FaUserMinus /> : <FaUserPlus />}
                    <span>{authorProfile.isFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SnippetDetailPage;
