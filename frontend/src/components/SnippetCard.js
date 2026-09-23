import { useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { upvoteSnippet, downvoteSnippet } from '../features/snippetSlice';
import { toPrismLanguage } from '../utils/languages';
import SyntaxHighlighter from '../utils/syntaxHighlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaArrowUp, FaArrowDown, FaComment, FaCopy, FaCheck } from 'react-icons/fa';

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

const SnippetCard = ({ snippet }) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const hasUpvoted = Boolean(snippet.upvoters?.includes(user?._id));
  const hasDownvoted = Boolean(snippet.downvoters?.includes(user?._id));

  const handleUpvote = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(upvoteSnippet(snippet._id));
  };
  const handleDownvote = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(downvoteSnippet(snippet._id));
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

  return (
    <div className="card snippet-card my-3">
      <div className="card-body">
        <h5 className="card-title neon-text">{snippet.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          by {snippet.author}
          {snippet.author !== "CodeGalaxy" && (
            <span className="ms-2 text-muted">
              {new Date(snippet.createdAt).toLocaleDateString()}
            </span>
          )}
        </h6>
        <p className="card-text">{snippet.description}</p>

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
            to={`/snippet/${snippet._id}/comments`}
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
        </div>
      </div>
    </div>
  );
};

export default memo(SnippetCard);
