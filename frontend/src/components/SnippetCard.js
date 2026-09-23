import { useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { upvoteSnippet, downvoteSnippet, deleteSnippet, toggleBookmark } from '../features/snippetSlice';
import { fetchCollections, createCollection, addSnippetToCollection, removeSnippetFromCollection } from '../features/collectionSlice';
import { toPrismLanguage } from '../utils/languages';
import { highlightMatch } from '../utils/highlightMatch';
import SyntaxHighlighter from '../utils/syntaxHighlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  FaArrowUp, FaArrowDown, FaComment, FaCopy, FaCheck, FaPen, FaTrash,
  FaBookmark, FaRegBookmark, FaFolderPlus, FaPlus
} from 'react-icons/fa';

const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Clipboard API is unavailable on non-HTTPS origins — fall back to the
  // classic hidden-textarea + execCommand trick
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
};

const SnippetCard = ({ snippet, highlightQuery }) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [collectionPanelOpen, setCollectionPanelOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { items: collections, loaded: collectionsLoaded } = useSelector(state => state.collections);

  const hasUpvoted = Boolean(snippet.upvoters?.includes(user?._id));
  const hasDownvoted = Boolean(snippet.downvoters?.includes(user?._id));
  const hasBookmarked = Boolean(snippet.bookmarkedBy?.includes(user?._id));
  const isOwner = Boolean(user) && snippet.author === user.username;

  const requireLogin = (action) => {
    if (!user) {
      navigate('/login');
      return;
    }
    action();
  };

  const handleUpvote = () => requireLogin(() => dispatch(upvoteSnippet(snippet._id)));
  const handleDownvote = () => requireLogin(() => dispatch(downvoteSnippet(snippet._id)));
  const handleBookmark = () => requireLogin(() => dispatch(toggleBookmark(snippet._id)));

  const handleToggleCollectionPanel = () => requireLogin(() => {
    if (!collectionPanelOpen && !collectionsLoaded) {
      dispatch(fetchCollections());
    }
    setCollectionPanelOpen((open) => !open);
  });

  const handleToggleInCollection = (collection) => {
    const inCollection = collection.snippets
      ? collection.snippets.some((s) => (s._id || s) === snippet._id)
      : false;
    if (inCollection) {
      dispatch(removeSnippetFromCollection({ collectionId: collection._id, snippetId: snippet._id }));
    } else {
      dispatch(addSnippetToCollection({ collectionId: collection._id, snippetId: snippet._id }));
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    const result = await dispatch(createCollection({ name: newCollectionName.trim() })).unwrap();
    setNewCollectionName('');
    dispatch(addSnippetToCollection({ collectionId: result._id, snippetId: snippet._id }));
  };

  const copyCode = async () => {
    try {
      await copyToClipboard(snippet.code);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteSnippet(snippet._id)).unwrap();
    } catch (err) {
      setDeleteError(err?.message || 'Failed to delete snippet. Please try again.');
      setConfirmingDelete(false);
    }
  };

  return (
    <div className="card snippet-card my-3">
      <div className="card-body">
        <h5 className="card-title neon-text">{highlightMatch(snippet.title, highlightQuery)}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          by <Link to={`/user/${encodeURIComponent(snippet.author)}`} className="author-link">{snippet.author}</Link>
          {snippet.author !== "CodeGalaxy" && (
            <span className="ms-2 text-muted">
              {new Date(snippet.createdAt).toLocaleDateString()}
            </span>
          )}
        </h6>
        <p className="card-text">{highlightMatch(snippet.description, highlightQuery)}</p>

        {snippet.tags?.length > 0 && (
          <div className="tag-chip-row">
            {snippet.tags.map((tag) => (
              <Link key={tag} to={`/snippets?tags=${encodeURIComponent(tag)}`} className="tag-chip">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div className="code-block">
          <SyntaxHighlighter
            language={toPrismLanguage(snippet.language)}
            style={vscDarkPlus}
            customStyle={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px'
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>

        {deleteError && <p className="text-danger small mb-2">{deleteError}</p>}

        {confirmingDelete ? (
          <div className="delete-confirm mt-3" role="alert">
            <span className="me-2">Delete this snippet? This can't be undone.</span>
            <button className="btn btn-danger btn-sm me-2" onClick={handleConfirmDelete}>
              Yes, delete
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div className="card-actions mt-3">
              <div className="vote-actions">
                <button
                  className={`btn btn-vote ${hasUpvoted ? 'voted' : ''}`}
                  onClick={handleUpvote}
                  title="Upvote"
                  aria-label="Upvote"
                  aria-pressed={hasUpvoted}
                >
                  <FaArrowUp />
                  <span>{snippet.upvoters?.length || 0}</span>
                </button>
                <button
                  className={`btn btn-vote ${hasDownvoted ? 'voted' : ''}`}
                  onClick={handleDownvote}
                  title="Downvote"
                  aria-label="Downvote"
                  aria-pressed={hasDownvoted}
                >
                  <FaArrowDown />
                  <span>{snippet.downvoters?.length || 0}</span>
                </button>
              </div>

              <Link
                to={`/snippet/${snippet._id}`}
                className="btn btn-comment"
                title="View comments"
              >
                <FaComment />
                <span>Comments ({snippet.commentCount ?? snippet.comments?.length ?? 0})</span>
              </Link>

              <button
                className="btn btn-copy"
                onClick={copyCode}
                title={copied ? 'Copied!' : 'Copy code'}
                aria-label={copyError ? 'Failed to copy code' : (copied ? 'Copied to clipboard' : 'Copy code to clipboard')}
              >
                {copied ? <FaCheck /> : <FaCopy />}
                <span>{copyError ? 'Copy failed' : (copied ? 'Copied!' : 'Copy Code')}</span>
              </button>

              <button
                className={`btn btn-copy ${hasBookmarked ? 'voted' : ''}`}
                onClick={handleBookmark}
                title={hasBookmarked ? 'Remove bookmark' : 'Bookmark'}
                aria-label={hasBookmarked ? 'Remove bookmark' : 'Bookmark this snippet'}
                aria-pressed={hasBookmarked}
              >
                {hasBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                <span>{hasBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <button
                className="btn btn-copy"
                onClick={handleToggleCollectionPanel}
                title="Add to collection"
                aria-label="Add to collection"
                aria-expanded={collectionPanelOpen}
              >
                <FaFolderPlus />
                <span>Collections</span>
              </button>

              {isOwner && (
                <>
                  <Link
                    to={`/snippet/${snippet._id}/edit`}
                    className="btn btn-copy"
                    title="Edit snippet"
                    aria-label="Edit snippet"
                  >
                    <FaPen />
                    <span>Edit</span>
                  </Link>
                  <button
                    className="btn btn-copy"
                    onClick={() => setConfirmingDelete(true)}
                    title="Delete snippet"
                    aria-label="Delete snippet"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>

            {collectionPanelOpen && (
              <div className="collection-panel mt-2">
                {collections.length === 0 ? (
                  <p className="small text-muted mb-2">You don't have any collections yet.</p>
                ) : (
                  <ul className="collection-panel-list">
                    {collections.map((collection) => {
                      const inCollection = collection.snippets
                        ? collection.snippets.some((s) => (s._id || s) === snippet._id)
                        : false;
                      return (
                        <li key={collection._id}>
                          <button
                            type="button"
                            className={`collection-panel-item ${inCollection ? 'in-collection' : ''}`}
                            onClick={() => handleToggleInCollection(collection)}
                            aria-pressed={inCollection}
                          >
                            {inCollection && <FaCheck className="me-2" />}
                            {collection.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <form onSubmit={handleCreateAndAdd} className="collection-panel-new">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="New collection name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    maxLength={100}
                  />
                  <button type="submit" className="btn btn-sm btn-copy" disabled={!newCollectionName.trim()}>
                    <FaPlus />
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default memo(SnippetCard);
