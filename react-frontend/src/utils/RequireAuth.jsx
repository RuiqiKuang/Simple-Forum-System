import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/me', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setAuthorized(data.success);
      })
      .catch(() => setAuthorized(false));
  }, []);

  if (authorized === null) return <div>Loading...</div>;
  if (!authorized) return <Navigate to="/login" replace />;
  return children;
};

export default RequireAuth;
