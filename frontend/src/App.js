import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/authSlice';

const HomePage = lazy(() => import('./pages/HomePage'));
const SnippetsPage = lazy(() => import('./pages/SnippetsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MySnippetsPage = lazy(() => import('./pages/MySnippetsPage'));
const CreateSnippet = lazy(() => import('./pages/CreateSnippet'));
const CommentPage = lazy(() => import('./pages/CommentPage'));
const SearchResultPage = lazy(() => import('./pages/SearchResultPage'));
const LanguagePage = lazy(() => import('./pages/LanguagePage'));
const UserSnippetsPage = lazy(() => import('./pages/UserSnippetsPage'));

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
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

              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/my-snippets" element={<MySnippetsPage />} />
                <Route path="/create-snippet" element={<CreateSnippet />} />
                <Route path="/snippet/:id/comments" element={<CommentPage />} />
              </Route>
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
