// App.js - Update import paths
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import Transactions from './components/Transactions';
import Transfer from './components/Transfer';
import Login from './components/Login';
import Signup from './components/Signup';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user and verify auth state when the app loads
  useEffect(() => {
    const initializeAuth = () => {
      setLoading(true);
      try {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authToken');
        
        if (savedUser && token) {
          console.log('Found saved user and token');
          setUser(savedUser);
        } else {
          console.log('Missing user or token, clearing auth state');
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  // Token validity check function
  const checkTokenValidity = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      navigate('/login', { replace: true, state: { message: 'Session expired. Please log in again.' } });
    }
  };

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="nav-bar">
        <div className="container">
          <ul className="nav-top">
            <li>
              <Link to="/" className="nav-link" data-tooltip="Go to Home Page">
                Home
              </Link>
            </li>
            
            {!user ? (
              <>
                <li>
                  <Link to="/signup" className="nav-link" data-tooltip="Signup for a new account">
                    Signup
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="nav-link" data-tooltip="Login to your account">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/deposit" className="nav-link" data-tooltip="Add money to your account">
                    Deposit
                  </Link>
                </li>
                <li>
                  <Link to="/withdraw" className="nav-link" data-tooltip="Withdraw money from your account">
                    Withdraw
                  </Link>
                </li>
                <li>
                  <Link to="/transfer" className="nav-link" data-tooltip="Transfer money between accounts">
                    Transfer
                  </Link>
                </li>
                <li>
                  <Link to="/transactions" className="nav-link" data-tooltip="View your transactions">
                    Transactions
                  </Link>
                </li>
                <li className="username-display">
                  <span className="nav-text">
                    Welcome, {user.username}!
                  </span>
                </li>
                <li>
                  <button className="btn btn-outline-danger logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" replace />} />
            <Route path="/deposit" element={<ProtectedRoute><Deposit user={user} /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><Withdraw user={user} /></ProtectedRoute>} />
            <Route path="/transfer" element={<ProtectedRoute><Transfer user={user} /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions user={user} /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p className="text-center mb-0">
            © {new Date().getFullYear()} Better Bank. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;