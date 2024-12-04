// src/components/SnippetCard.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Fix navigate import
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { upvoteSnippet, downvoteSnippet } from '../features/snippetSlice';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  return (
    <div className="card snippet-card my-3">
      <div className="card-body">
        <h5 className="card-title neon-text">{snippet.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">by {snippet.author}</h6>
        <p className="card-text">{snippet.description}</p>
        

        <div className="code-block">
          <SyntaxHighlighter 
            language={'C++' ? 'cpp' : snippet.language.toLowerCase()}
            style={vscDarkPlus}
            customStyle={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px'
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>

        <div className="button-group">
          <button 
            className="btn btn-outline-primary me-2 mb-3" 
            onClick={copyCode}
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <Link 
            to={`/snippet/${snippet._id}/comments`} 
            className="btn btn-outline-info me-2 mb-3"
          >
            Comments
          </Link>
        </div>
        <div className="button-group">
          <button 
            className={`btn ${snippet.upvoters?.includes(user?._id) ? 'btn-success' : 'btn-outline-success'} me-2 mb-3`}
            onClick={handleUpvote}
          >
            Upvotes: {snippet.upvotes}
          </button>
          <button 
            className={`btn ${snippet.downvoters?.includes(user?._id) ? 'btn-danger' : 'btn-outline-danger'} me-2 mb-3`}
            onClick={handleDownvote}
          >
            Downvotes: {snippet.downvotes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnippetCard;