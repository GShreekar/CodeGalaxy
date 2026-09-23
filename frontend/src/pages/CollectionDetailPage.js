import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollectionById, updateCollection, clearCurrentCollection } from '../features/collectionSlice';
import SnippetCard from '../components/SnippetCard';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import './CollectionsPage.css';

const CollectionDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector(state => state.collections);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    dispatch(fetchCollectionById(id));
    return () => dispatch(clearCurrentCollection());
  }, [dispatch, id]);

  const handleRename = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    await dispatch(updateCollection({ id, name: nameInput.trim() }));
    setEditingName(false);
  };

  if (loading || !current || current._id !== id) return <Loader />;

  if (error) {
    return (
      <div className="container py-5 text-center">
        <Alert type="danger" message={error} />
        <Link to="/collections" className="btn btn-primary mt-3">Back to Collections</Link>
      </div>
    );
  }

  return (
    <div className="collections-page">
      <div className="container py-4">
        <div className="header-section mb-4">
          {editingName ? (
            <form onSubmit={handleRename} className="d-flex gap-2 align-items-center">
              <input
                type="text"
                className="form-control"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={100}
                autoFocus
              />
              <button type="submit" className="btn btn-create">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingName(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <h2 className="page-title neon-text">
              {current.name}
              <button
                className="btn btn-copy btn-sm ms-3"
                onClick={() => { setNameInput(current.name); setEditingName(true); }}
              >
                Rename
              </button>
            </h2>
          )}
          {current.description && <p className="text-muted">{current.description}</p>}
        </div>

        {current.snippets.length === 0 ? (
          <div className="no-snippets">
            <h3 className="text-center neon-text">This collection is empty</h3>
            <p className="text-center text-muted">
              Use "Collections" on any snippet card to add one here.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {current.snippets.map((snippet) => (
              <div key={snippet._id} className="col-12 col-md-6 col-lg-4">
                <SnippetCard snippet={snippet} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailPage;
