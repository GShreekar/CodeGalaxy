import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollections, createCollection, deleteCollection } from '../features/collectionSlice';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import './CollectionsPage.css';

const CollectionsPage = () => {
  const dispatch = useDispatch();
  const { items, loading, loaded } = useSelector(state => state.collections);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchCollections());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await dispatch(createCollection({ name: name.trim(), description: description.trim() })).unwrap();
      setName('');
      setDescription('');
      setError('');
    } catch (err) {
      setError(err || 'Failed to create collection');
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteCollection(id));
    setConfirmingDeleteId(null);
  };

  if (loading && !loaded) return <Loader />;

  return (
    <div className="collections-page">
      <div className="container py-4">
        <h2 className="page-title neon-text mb-4">My Collections</h2>

        {error && <Alert type="danger" message={error} className="mb-3" />}

        <form onSubmit={handleCreate} className="collection-create-form mb-4">
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Collection name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-create w-100" disabled={!name.trim()}>
                Create
              </button>
            </div>
          </div>
        </form>

        {items.length === 0 ? (
          <div className="no-snippets">
            <h3 className="text-center neon-text">No collections yet</h3>
            <p className="text-center text-muted">
              Create one above, or use "Collections" on any snippet card.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {items.map((collection) => (
              <div key={collection._id} className="col-12 col-md-6 col-lg-4">
                <div className="collection-card">
                  <h5 className="neon-text">
                    <Link to={`/collections/${collection._id}`} className="collection-link">
                      {collection.name}
                    </Link>
                  </h5>
                  {collection.description && <p className="text-muted">{collection.description}</p>}
                  <p className="mb-3">
                    {collection.snippetCount} {collection.snippetCount === 1 ? 'snippet' : 'snippets'}
                  </p>

                  {confirmingDeleteId === collection._id ? (
                    <div className="delete-confirm">
                      <span className="me-2">Delete this collection?</span>
                      <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(collection._id)}>
                        Yes
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setConfirmingDeleteId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-copy btn-sm" onClick={() => setConfirmingDeleteId(collection._id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
