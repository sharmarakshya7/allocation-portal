'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [allocation, setAllocation] = useState('');
  const [investors, setInvestors] = useState([
    { name: '', requested: '', average: '' },
    { name: '', requested: '', average: '' }
  ]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // backend URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Add investor
  const addInvestor = () => {
    setInvestors([...investors, { name: '', requested: '', average: '' }]);
  };

  // Remove investor
  const removeInvestor = (index) => {
    if (investors.length > 1) {
      setInvestors(investors.filter((_, i) => i !== index));
    }
  };

  // Update investor
  const updateInvestor = (index, field, value) => {
    const updated = [...investors];
    updated[index][field] = value;
    setInvestors(updated);
  };

  // Load example
  const loadExample = () => {
    setAllocation('100');
    setInvestors([
      { name: 'Investor A', requested: '150', average: '100' },
      { name: 'Investor B', requested: '50', average: '25' }
    ]);
  };

  // Reset form
  const reset = () => {
    setAllocation('');
    setInvestors([
      { name: '', requested: '', average: '' },
      { name: '', requested: '', average: '' }
    ]);
    setResults(null);
    setError('');
  };

  // Calculate proration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults(null);

    // Validate
    if (!allocation || parseFloat(allocation) <= 0) {
      setError('Please enter a valid allocation amount');
      return;
    }

    const validInvestors = investors.filter(inv => inv.name.trim() !== '');
    if (validInvestors.length === 0) {
      setError('Please add at least one investor');
      return;
    }

    // Prepare request
    const request = {
      allocation_amount: parseFloat(allocation),
      investor_amounts: validInvestors.map(inv => ({
        name: inv.name,
        requested_amount: parseFloat(inv.requested) || 0,
        average_amount: parseFloat(inv.average) || 0
      }))
    };

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/prorate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to calculate');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(`Failed to calculate proration: ${err.message}`);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Left Panel - Inputs */}
        <div className={styles.panel}>
          <h2>Inputs</h2>

          <form onSubmit={handleSubmit}>
            {/* Allocation Amount */}
            <div className={styles.formGroup}>
              <label>Total Available Allocation</label>
              <div className={styles.inputWrapper}>
                <span className={styles.currencySymbol}>$</span>
                <input
                  type="number"
                  value={allocation}
                  onChange={(e) => setAllocation(e.target.value)}
                  placeholder="Allocation"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            {/* Investors */}
            <div className={styles.investorSection}>
              <div className={styles.sectionHeader}>
                <h3>Investor Breakdown</h3>
                <button type="button" className={styles.btnAdd} onClick={addInvestor}>
                  + Add Investor
                </button>
              </div>

              <div className={styles.investorRows}>
                {investors.map((investor, index) => (
                  <div key={index} className={styles.investorRow}>
                    <input
                      type="text"
                      value={investor.name}
                      onChange={(e) => updateInvestor(index, 'name', e.target.value)}
                      placeholder="Name"
                      className={styles.inputName}
                    />
                    <div className={styles.inputGroup}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        value={investor.requested}
                        onChange={(e) => updateInvestor(index, 'requested', e.target.value)}
                        placeholder="Requested"
                        min="0"
                        step="1"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        value={investor.average}
                        onChange={(e) => updateInvestor(index, 'average', e.target.value)}
                        placeholder="Average"
                        min="0"
                        step="1"
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.btnRemove}
                      onClick={() => removeInvestor(index)}
                      disabled={investors.length === 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && <div className={styles.error}>{error}</div>}

            {/* Buttons */}
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? 'Calculating...' : 'Prorate'}
              </button>
              <button type="button" className={styles.btnSecondary} onClick={reset}>
                Reset
              </button>
              <button type="button" className={styles.btnSecondary} onClick={loadExample}>
                Load Example
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel - Results */}
        <div className={styles.panel}>
          <h2>Results</h2>

          {results ? (
            <div className={styles.results}>
              {Object.entries(results).map(([name, amount]) => (
                <div key={name} className={styles.resultItem}>
                  <span className={styles.investorName}>{name}</span>
                  <span className={styles.investorAmount}>${amount.toLocaleString()}</span>
                </div>
              ))}

              <div className={styles.resultTotal}>
                <span className={styles.totalLabel}>Total Allocated:</span>
                <span className={styles.totalAmount}>
                  ${Object.values(results).reduce((sum, val) => sum + val, 0).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.noResults}>
              <p>Enter allocation and investor details, then click "Prorate" to see results.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}