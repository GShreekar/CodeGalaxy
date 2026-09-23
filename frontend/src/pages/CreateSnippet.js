import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSnippet } from '../features/snippetSlice';
import Alert from '../components/Alert';
import SnippetForm from '../components/SnippetForm';
import './CreateSnippet.css';

const EMPTY_SNIPPET = { title: '', description: '', language: '', code: '' };

const CreateSnippet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await dispatch(createSnippet({
        ...formData,
        author: user.username
      })).unwrap();
      navigate('/my-snippets');
    } catch (err) {
      setError(err?.message || 'Failed to create snippet. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="create-snippet-page">
      <div className="container py-4">
        <div className="snippet-form-card">
          <h2 className="card-title text-center neon-text mb-4">
            Create New Snippet
          </h2>

          {error && <Alert type="danger" message={error} className="mb-3" />}

          <SnippetForm
            initialValues={EMPTY_SNIPPET}
            onSubmit={handleSubmit}
            submitLabel="Create Snippet"
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSnippet;
