import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, LogOut, Home, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      padding: '1rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1f2937',
              textDecoration: 'none'
            }}>
              User Management
            </Link>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                <Home size={16} />
                Dashboard
              </Link>
              
              {user?.role === 'admin' && (
                <Link to="/users" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  <Users size={16} />
                  Manage Users
                </Link>
              )}
              <Link to="/tasks" className="btn btn-success" style={{ textDecoration: 'none' }}>
                <CheckSquare size={16} />
                Tasks
              </Link>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '500', color: '#1f2937' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ textDecoration: 'none' }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 