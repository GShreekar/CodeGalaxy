import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchSnippetById, updateSnippet } from '../features/snippetSlice';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import SnippetForm from '../components/SnippetForm';
import './CreateSnippet.css';

const EditSnippet = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { currentSnippet, loading } = useSelector(state => state.snippets);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchSnippetById(id));
  }, [dispatch, id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await dispatch(updateSnippet({ id, ...formData })).unwrap();
      navigate('/my-snippets');
    } catch (err) {
      setError(err?.message || 'Failed to update snippet. Please try again.');
      setSubmitting(false);
    }
  };

  // guard against a stale currentSnippet from a previously-viewed id
  // while this page's own fetch is still in flight
  if (loading || !currentSnippet || currentSnippet._id !== id) {
    return <Loader />;
  }

  // client-side check for a fast, friendly message — the server enforces this regardless
  if (currentSnippet.author !== user?.username) {
    return (
      <div className="create-snippet-page">
        <div className="container py-4 text-center">
          <Alert type="danger" message="You can only edit your own snippets." />
          <Link to="/my-snippets" className="btn btn-primary mt-3">Back to My Snippets</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="create-snippet-page">
      <div className="container py-4">
        <div className="snippet-form-card">
          <h2 className="card-title text-center neon-text mb-4">
            Edit Snippet
          </h2>

          {error && <Alert type="danger" message={error} className="mb-3" />}

          <SnippetForm
            initialValues={{
              title: currentSnippet.title,
              description: currentSnippet.description,
              language: currentSnippet.language,
              code: currentSnippet.code,
              tags: currentSnippet.tags
            }}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditSnippet;
