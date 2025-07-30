import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSnippetById, addComment } from '../features/snippetSlice';
import './CommentPage.css';
import SnippetCard from '../components/SnippetCard';

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
        <SnippetCard snippet={currentSnippet} disableClick={true} />

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