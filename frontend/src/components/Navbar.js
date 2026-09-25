import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import NotificationBell from './NotificationBell';
import SearchBar from './SearchBar';
import Avatar from './Avatar';
import { logout } from '../features/authSlice';
import './styles.css';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark cg-navbar">
      <div className="container">
        <Link className="navbar-brand cg-brand" to="/">
          <img src="/logo.svg" alt="CodeGalaxy" height="26" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {user && (
          <div className="d-lg-none">
            <NotificationBell />
          </div>
        )}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav cg-nav-links">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/snippets')}`} to="/snippets">Explore</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/categories')}`} to="/categories">Categories</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/community')}`} to="/community">Community</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/collections')}`} to="/collections">Collections</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/contact')}`} to="/contact">Contact</Link>
            </li>
          </ul>

          <div className="cg-navbar-search d-none d-lg-block">
            <SearchBar placeholder="Search snippets, tags, devs..." />
          </div>

          <ul className="navbar-nav cg-nav-actions">
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/create-snippet" className="btn btn-primary cg-new-snippet-btn">
                    <FaPlus /> <span>New Snippet</span>
                  </Link>
                </li>
                <li className="nav-item d-none d-lg-block">
                  <NotificationBell />
                </li>
                <li className="nav-item dropdown cg-account-dropdown">
                  <button
                    className="cg-avatar-btn"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="Account menu"
                  >
                    <Avatar username={user.username} size={34} />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end cg-dropdown-menu">
                    <li><span className="dropdown-item-text cg-dropdown-username">@{user.username}</span></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><Link className="dropdown-item" to="/my-snippets">My Snippets</Link></li>
                    <li><Link className="dropdown-item" to="/bookmarks">Bookmarks</Link></li>
                    <li><Link className="dropdown-item" to="/collections">Collections</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button type="button" className="dropdown-item cg-logout-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-primary" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
