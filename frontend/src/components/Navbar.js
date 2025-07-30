import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './styles.css';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand neon-text" to="/">CodeGalaxy</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav ms-auto text-end">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/snippets')}`} to="/snippets">Snippets</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/categories')}`} to="/categories">Categories</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/community')}`} to="/community">
                Shared Snippets
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/contact')}`} to="/contact">Contact</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/my-snippets')}`} to="/my-snippets">My Snippets</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/profile')}`} to="/profile">Profile</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/login')}`} to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;