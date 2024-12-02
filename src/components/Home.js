// src/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home({ user }) {
  return (
    <div className="home-container">
      <h1 className="mb-4">Welcome to Better Bank</h1>
      {user && (
        <h4 className="greeting-message mb-4">
          Hello, {user.username}! Here's what you can do today:
        </h4>
      )}
      <div className="image-container mb-4">
        <img 
          src={`${process.env.PUBLIC_URL}/bank-logo.png`} 
          alt="Bank Logo" 
          className="home-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Better+Bank';
          }}
        />
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Better Bank</h5>
          <div className="features mb-4">
            <p className="mb-2">We've gotten better!</p>
            <p className="mb-3">Now introducing: Encrypted Passwords</p>
          </div>

          {user ? (
            <div className="quick-links">
              <h6 className="mb-3">Quick Actions:</h6>
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Link to="/deposit" className="btn btn-primary">
                  <i className="fas fa-deposit"></i> Deposit
                </Link>
                <Link to="/withdraw" className="btn btn-warning">
                  <i className="fas fa-withdraw"></i> Withdraw
                </Link>
                <Link to="/transfer" className="btn btn-secondary">
                  <i className="fas fa-exchange-alt"></i> Transfer
                </Link>
                <Link to="/transactions" className="btn btn-success">
                  <i className="fas fa-history"></i> Transactions
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="mb-3">
                If you're not yet a member, start banking smarter today!
              </p>
              <Link to="/signup" className="btn btn-primary btn-lg">
                Sign Up Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;