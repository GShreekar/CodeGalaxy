// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SnippetsPage from './pages/SnippetsPage';
import CategoriesPage from './pages/CategoriesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MySnippetsPage from './pages/MySnippetsPage';
import CreateSnippet from './pages/CreateSnippet';
import CommentPage from './pages/CommentPage';
import SearchResultPage from './pages/SearchResultPage';
import LanguagePage from './pages/LanguagePage';
import PrivateRoute from './components/PrivateRoute';
import UserSnippetsPage from './pages/UserSnippetsPage';
import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/authSlice';

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
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-snippets" element={<MySnippetsPage />} />
              <Route path="/create-snippet" element={<CreateSnippet />} />
              <Route path="/snippet/:id/comments" element={<CommentPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;