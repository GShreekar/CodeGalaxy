// src/pages/CommentPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSnippetById, 
  addComment } from '../features/snippetSlice';
import SnippetCard from '../components/SnippetCard';
import './CommentPage.css';

const CommentPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);
  
  const { currentSnippet, loading } = useSelector(state => state.snippets);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchSnippetById(id));
  }, [dispatch, id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addComment({ 
        snippetId: id,
        text: commentText 
      })).unwrap();
      setCommentText('');
    } catch (error) {
      setError('Failed to add comment. Please try again.');
      console.error('Failed to add comment:', error);
    }
  };

  if (loading || !currentSnippet) return <div>Loading...</div>;

  return (
    <div className="comment-page">
      <div className="container py-4">
        <SnippetCard snippet={currentSnippet} />

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="comments-section">
          <h4 className="comments-title neon-text mb-4">Comments</h4>

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

          {currentSnippet.comments?.map(comment => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentPage;