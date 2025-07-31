import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import '../styles/NavBar.css';

const NavBar = () => {
  const { isLoading, isAuthenticated, user, error} = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  var role = '';
  if (isAuthenticated && user?.role) {
    if (user.role === 'rol_eMnBOPuwLoGDPTXE') role = 'charity';
    if (user.role === 'rol_Gxv3ockfkKD3KiE0') role = 'donor';
  }

  return (
    <nav className="navbar">
        <Link to="/" className="navbar-logo">Food Rescue</Link>
      {(isAuthenticated && role === 'charity' && user?.verified) &&
        <div className="navbar-links">
          <Link to="/charity-profile">Profile</Link>
          <Link to="/charity-search">Search</Link>
          <Link to="/charity-reservations">Reservations</Link>
          <LogoutButton />
        </div>
      }
      {(isAuthenticated && role === 'charity' && !user?.verified) &&
        <div className="navbar-links">
          <LogoutButton />
        </div>
      }
      {(isAuthenticated && role === 'donor') &&
        <div className="navbar-links">
          <Link to="/donor-profile">Profile</Link>
          <Link to="/donor-inventory">Inventory</Link>
          <Link to="/donor-reservations">Reservations</Link>
          <LogoutButton />
        </div>
      }
    </nav>
  );
};

export default NavBar;
