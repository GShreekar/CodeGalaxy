import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const PrivateRoute = () => {
  const { user, token, loading } = useSelector(state => state.auth);

  // a token is cached but the user profile hasn't loaded yet: wait rather
  // than bounce to /login and flash a redirect during session restoration
  if (!user && token && loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
