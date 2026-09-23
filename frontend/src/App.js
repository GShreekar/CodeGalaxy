import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, sessionExpired } from './features/authSlice';

const HomePage = lazy(() => import('./pages/HomePage'));
const SnippetsPage = lazy(() => import('./pages/SnippetsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MySnippetsPage = lazy(() => import('./pages/MySnippetsPage'));
const MyBookmarksPage = lazy(() => import('./pages/MyBookmarksPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage'));
const CreateSnippet = lazy(() => import('./pages/CreateSnippet'));
const EditSnippet = lazy(() => import('./pages/EditSnippet'));
const SnippetDetailPage = lazy(() => import('./pages/SnippetDetailPage'));
const SearchResultPage = lazy(() => import('./pages/SearchResultPage'));
const LanguagePage = lazy(() => import('./pages/LanguagePage'));
const UserSnippetsPage = lazy(() => import('./pages/UserSnippetsPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    // fired by the axios interceptor when a request 401s outside of login/register
    const handleSessionExpired = () => dispatch(sessionExpired());
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, [dispatch]);

  return (
    <Router>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="app">
        <Navbar />
        <main id="main-content" className="main-content">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/snippets" element={<SnippetsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchResultPage />} />
              <Route path="/language/:language" element={<LanguagePage />} />
              <Route path="/community" element={<UserSnippetsPage />} />
              <Route path="/user/:username" element={<UserProfilePage />} />
              {/* public: reading a snippet and its comments needs no login — only posting one does */}
              <Route path="/snippet/:id" element={<SnippetDetailPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/my-snippets" element={<MySnippetsPage />} />
                <Route path="/bookmarks" element={<MyBookmarksPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collections/:id" element={<CollectionDetailPage />} />
                <Route path="/create-snippet" element={<CreateSnippet />} />
                <Route path="/snippet/:id/edit" element={<EditSnippet />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
