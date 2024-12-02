// src/Transactions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('You must be logged in to view transactions.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/users/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Error fetching transactions: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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
    <div className="transactions-page">
      <div className="card transactions-card">
        <div className="card-body">
          <h5 className="card-title mb-4 text-center">Transaction History</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          {transactions.length > 0 ? (
            <table className="table table-hover transactions-table">
              <thead className="table-light">
                <tr>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th className="text-end">Amount</th>
                  <th>Account</th>
                  <th>From</th>
                  <th>To</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      {new Date(transaction.date).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </td>
                    <td>{transaction.type}</td>
                    <td className="text-end">${transaction.amount.toFixed(2)}</td>
                    <td>{transaction.accountType}</td>
                    <td>{transaction.fromAccount || '-'}</td>
                    <td>{transaction.toAccount || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-muted">No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transactions;