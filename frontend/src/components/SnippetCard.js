// src/components/SnippetCard.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Fix navigate import
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { upvoteSnippet, downvoteSnippet } from '../features/snippetSlice';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaArrowUp, FaArrowDown, FaComment, FaCopy, FaCheck } from 'react-icons/fa';

const SnippetCard = ({ snippet }) => {
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Fix navigate hook
  const { user } = useSelector(state => state.auth);

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

  const copyCode = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons or links
    if (e.target.closest('.btn') || e.target.closest('a')) {
      return;
    }
    navigate(`/snippet/${snippet._id}/comments`);
  };

  return (
    <div 
      className="card snippet-card my-3"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
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
            language={snippet.language === 'C++' ? 'cpp' : snippet.language.toLowerCase()}
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
              className={`btn btn-vote ${snippet.upvoters?.includes(user?._id) ? 'voted' : ''}`}
              onClick={handleUpvote}
              title="Upvote"
            >
              <FaArrowUp />
              <span>{snippet.upvoters?.length || 0}</span>
            </button>
            <button 
              className={`btn btn-vote ${snippet.downvoters?.includes(user?._id) ? 'voted' : ''}`}
              onClick={handleDownvote}
              title="Downvote"
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
            <span>Comments ({snippet.comments?.length || 0})</span>
          </Link>

          <button 
            className="btn btn-copy"
            onClick={copyCode}
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? <FaCheck /> : <FaCopy />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnippetCard;