import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './styles.css';

const Footer = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <footer className="cg-footer">
      <div className="container">
        <div className="cg-footer-grid">
          <div className="cg-footer-brand">
            <img src="/logo.svg" alt="CodeGalaxy" height="24" />
            <p className="cg-footer-tagline">
              The catalog and social hub for developers who share, discover, and remix code.
            </p>
          </div>

          <div className="cg-footer-col">
            <h6 className="cg-footer-heading">Explore</h6>
            <Link to="/snippets">Explore Snippets</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/community">Community</Link>
          </div>

          <div className="cg-footer-col">
            <h6 className="cg-footer-heading">Account</h6>
            {user ? (
              <>
                <Link to="/my-snippets">My Snippets</Link>
                <Link to="/bookmarks">Bookmarks</Link>
                <Link to="/collections">Collections</Link>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Create Account</Link>
              </>
            )}
          </div>

          <div className="cg-footer-col">
            <h6 className="cg-footer-heading">Support</h6>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="cg-footer-bottom">
          <span>&copy; {new Date().getFullYear()} CodeGalaxy. Made for coders by coders.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
