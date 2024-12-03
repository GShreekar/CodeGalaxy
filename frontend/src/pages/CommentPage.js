// src/pages/CommentPage.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSnippetById, addComment } from '../features/snippetSlice';
import './CommentPage.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CommentPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentSnippet, loading } = useSelector(state => state.snippets);
  const { user } = useSelector(state => state.auth);
  const [commentText, setCommentText] = useState('');

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
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (loading || !currentSnippet) return <div>Loading...</div>;

  return (
    <div className="comment-page">
      <div className="container py-4">
        {/* Snippet Card */}
        <div className="snippet-card mb-4">
          <h3 className="card-title neon-text">{currentSnippet.title}</h3>
          <h6 className="card-subtitle mb-2">by {currentSnippet.author}</h6>
          <p className="card-text">{currentSnippet.description}</p>
          <div className="code-container">
            <SyntaxHighlighter 
              language={'C++' ? 'cpp' : currentSnippet.language.toLowerCase()}
              style={vscDarkPlus}
              customStyle={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '1rem',
                borderRadius: '4px',
                margin: '1rem 0'
              }}
            >
              {currentSnippet.code}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h4 className="comments-title neon-text mb-4">Comments</h4>

          {/* Comment Form */}
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

          {/* Comments List */}
          <div className="comments-list">
            {currentSnippet.comments?.length === 0 ? (
              <p className="text-center">No comments yet. Be the first to comment!</p>
            ) : (
              currentSnippet.comments?.map((comment, index) => (
                <div key={index} className="comment-card">
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

export default CommentPage;