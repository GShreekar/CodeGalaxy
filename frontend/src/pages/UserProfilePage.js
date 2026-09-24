import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, clearUserProfile, toggleFollow } from '../features/userProfileSlice';
import { fetchUserSnippets } from '../features/snippetSlice';
import SnippetCard from '../components/SnippetCard';
import Avatar from '../components/Avatar';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, error: profileError } = useSelector(state => state.userProfile);
  const { items, page, pages, loading: snippetsLoading } = useSelector(state => state.snippets);
  const { user } = useSelector(state => state.auth);
  const [followBusy, setFollowBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile(username));
    dispatch(fetchUserSnippets({ username, page: 1 }));
    return () => {
      dispatch(clearUserProfile());
    };
  }, [dispatch, username]);

  const handleLoadMore = () => {
    dispatch(fetchUserSnippets({ username, page: page + 1 }));
  };

  const handleToggleFollow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFollowBusy(true);
    try {
      await dispatch(toggleFollow(username)).unwrap();
    } finally {
      setFollowBusy(false);
    }
  };

  if (profileLoading) return <Loader />;

  if (profileError || !profile) {
    return (
      <div className="container py-5 text-center">
        <Alert type="danger" message={profileError || 'User not found'} />
        <Link to="/community" className="btn btn-primary mt-3">Browse Community Snippets</Link>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="container py-4">
        <div className="profile-header-card mb-4">
          <Avatar username={profile.username} size={72} />
          <div className="profile-header-info">
            <h2 className="neon-text mb-1">{profile.name}</h2>
            <p className="text-muted mb-2">@{profile.username}</p>
            <p className="mb-0">
              Member since {new Date(profile.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
            </p>
            {(!user || user.username !== profile.username) && (
              <button
                type="button"
                className={`btn btn-follow mt-2 ${profile.isFollowing ? 'following' : ''}`}
                onClick={handleToggleFollow}
                disabled={followBusy}
                aria-pressed={profile.isFollowing}
              >
                {profile.isFollowing ? <FaUserMinus /> : <FaUserPlus />}
                <span>{profile.isFollowing ? 'Following' : 'Follow'}</span>
              </button>
            )}
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-value">{profile.snippetCount}</span>
              <span className="profile-stat-label">Snippets</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{profile.totalUpvotes}</span>
              <span className="profile-stat-label">Upvotes</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{profile.followerCount}</span>
              <span className="profile-stat-label">Followers</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{profile.followingCount}</span>
              <span className="profile-stat-label">Following</span>
            </div>
          </div>
        </div>

        <h3 className="neon-text mb-3">Snippets by {profile.username}</h3>

        {snippetsLoading && page === 1 ? (
          <Loader />
        ) : items.length === 0 ? (
          <div className="no-snippets">
            <h3 className="text-center neon-text">No snippets yet</h3>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {items.map(snippet => (
                <div key={snippet._id} className="col-12 col-md-6 col-lg-4">
                  <SnippetCard snippet={snippet} />
                </div>
              ))}
            </div>
            {page < pages && (
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={handleLoadMore} disabled={snippetsLoading}>
                  {snippetsLoading ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
