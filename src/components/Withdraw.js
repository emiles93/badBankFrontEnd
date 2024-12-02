// src/Withdraw.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function Withdraw() {
  const [amount, setAmount] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [balances, setBalances] = useState({ checking: 0, savings: 0 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/users/balance`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setBalances(response.data.balances);
        setError('');
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Error fetching balance. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [navigate]);

  const validateAmount = (value) => {
    if (!value || parseFloat(value) <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return false;
    }
    if (parseFloat(value) > balances[accountType]) {
      setError(`Insufficient funds in your ${accountType} account.`);
      return false;
    }
    return true;
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateAmount(amount)) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setProcessing(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/users/withdraw`,
        {
          amount: parseFloat(amount),
          accountType
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setBalances(response.data.balances);
      setSuccess(`Successfully withdrew $${parseFloat(amount).toFixed(2)} from your ${accountType} account.`);
      setAmount('');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Error processing withdrawal. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-body text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">Withdraw Funds</h5>
          
          <div className="balance-info mb-4">
            <h6 className="mb-3">Current Balances:</h6>
            <div className="row">
              <div className="col-6">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="card-subtitle mb-2 text-muted">Checking</h6>
                    <h5 className="card-title mb-0">${balances.checking.toFixed(2)}</h5>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="card-subtitle mb-2 text-muted">Savings</h6>
                    <h5 className="card-title mb-0">${balances.savings.toFixed(2)}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleWithdraw}>
            <div className="form-group mb-3">
              <label htmlFor="amount" className="form-label">Amount</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="Enter amount to withdraw"
                  disabled={processing}
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="accountType" className="form-label">From Account</label>
              <select
                id="accountType"
                className="form-select"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                disabled={processing}
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={processing || !amount || parseFloat(amount) <= 0}
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  'Withdraw'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;