// src/Transfer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function Transfer() {
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('checking');
  const [toAccount, setToAccount] = useState('savings');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balances, setBalances] = useState({ checking: 0, savings: 0 });

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('You must be logged in to view balances');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/users/balance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBalances(response.data.balances);
      } catch (err) {
        console.error('Error fetching balances:', err);
        setError('Error fetching balances: ' + (err.response?.data?.message || err.message));
      }
    };

    fetchBalances();
  }, []);

  const handleTransfer = async () => {
    setError('');
    setSuccess('');
    
    if (fromAccount === toAccount) {
      setError('Cannot transfer to the same account type');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid transfer amount greater than zero.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to transfer funds');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/users/transfer`, {
        amount: parseFloat(amount),
        fromAccount,
        toAccount,
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setSuccess('Transfer successful');
      setBalances(response.data.balances);
      setAmount('');
    } catch (err) {
      setError('Error during transfer: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mt-5">
        <div className="card-body">
          <h5 className="card-title">Transfer Funds</h5>
          <p>Current Balance: Checking: ${balances.checking.toFixed(2)}, Savings: ${balances.savings.toFixed(2)}</p>
          <form id="transferForm">
            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fromAccount">From Account:</label>
              <select
                id="fromAccount"
                className="form-control"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="toAccount">To Account:</label>
              <select
                id="toAccount"
                className="form-control"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleTransfer}
            >
              Transfer
            </button>
          </form>
          {error && <p className="text-danger mt-3">{error}</p>}
          {success && <p className="text-success mt-3">{success}</p>}
        </div>
      </div>
    </div>
  );
}

export default Transfer;