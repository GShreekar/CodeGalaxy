import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaCalendarWeek, FaArrowUp, FaCode } from 'react-icons/fa';
import { logout } from '../features/authSlice';
import { fetchUserStats } from '../features/statsSlice';
import './ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { data: stats, loading: statsLoading } = useSelector(state => state.stats);

  useEffect(() => {
    dispatch(fetchUserStats());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <div className="container py-5">
        <div className="profile-card">
          <div className="profile-header">
            <h2 className="neon-text">Profile</h2>
          </div>
          
          <div className="profile-content">
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{user?.name}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Username</span>
                <span className="info-value">{user?.username}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email}</span>
              </div>
            </div>

            {!statsLoading && stats && (
              <div className="creator-stats">
                <div className="creator-stat">
                  <FaCode />
                  <span className="creator-stat-value">{stats.snippetCount}</span>
                  <span className="creator-stat-label">Snippets</span>
                </div>
                <div className="creator-stat">
                  <FaEye />
                  <span className="creator-stat-value">{stats.totalViews}</span>
                  <span className="creator-stat-label">Total views</span>
                </div>
                <div className="creator-stat">
                  <FaCalendarWeek />
                  <span className="creator-stat-value">{stats.viewsThisWeek}</span>
                  <span className="creator-stat-label">Views this week</span>
                </div>
                <div className="creator-stat">
                  <FaArrowUp />
                  <span className="creator-stat-value">{stats.totalUpvotes}</span>
                  <span className="creator-stat-label">Upvotes</span>
                </div>
              </div>
            )}

            <div className="profile-actions">
              <Link to="/my-snippets" className="btn btn-primary snippets-btn">
                My Snippets
              </Link>

              {user?.username && (
                <Link to={`/user/${encodeURIComponent(user.username)}`} className="btn public-profile-btn">
                  View Public Profile
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="btn btn-danger logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;