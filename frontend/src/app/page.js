'use client';

import { useState } from 'react';
import styles from './page.module.css';
import AllocationForm from "./AllocationForm";
import ResultsPanel from "./ResultsPanel";

//For storing total allocation amount entered by user
export default function Home() {
  const [allocation, setAllocation] = useState('');
  const [investors, setInvestors] = useState([
    { name: '', requested: '', average: '' },
    { name: '', requested: '', average: '' }
  ]);

//For storing calculation result
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

// backend  base URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Add new row for investor
  const addInvestor = () => {
    setInvestors([...investors, { name: '', requested: '', average: '' }]);
  };

// Remove investor row but keep at least one
  const removeInvestor = (index) => {
    if (investors.length > 1) {
      setInvestors(investors.filter((_, i) => i !== index));
    }
  };

// Update specific field for investors
  const updateInvestor = (index, field, value) => {
    const updated = [...investors];
    updated[index][field] = value;
    setInvestors(updated);
  };

// Load example for reference
  const loadExample = () => {
    setAllocation('100');
    setInvestors([
      { name: 'Investor A', requested: '150', average: '100' },
      { name: 'Investor B', requested: '50', average: '25' }
    ]);
  };

// Reset
  const reset = () => {
    setAllocation('');
    setInvestors([
      { name: '', requested: '', average: '' },
      { name: '', requested: '', average: '' }
    ]);
    setResults(null);
    setError('');
  };

 // Calculate proration // called when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults(null);

 // Validating allocation input
    if (!allocation || parseFloat(allocation) <= 0) {
      setError('Please enter a valid allocation amount');
      return;
    }
//Message when no investor name is entered
    const validInvestors = investors.filter(inv => inv.name.trim() !== '');
    if (validInvestors.length === 0) {
      setError('Please add at least one investor');
      return;
    }

    // Build request for backend
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
      //call API
      const response = await fetch(`${API_URL}/api/prorate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      //handling error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to calculate');
      }
//Reading successful response
      const data = await response.json();
      setResults(data);
    } catch (err) {
      //error message when API fails
      setError(`Failed to calculate proration: ${err.message}`);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  //Container for page layout
  return (
      <div className={styles.container}>
        <main className={styles.main}>
          <AllocationForm
              styles={styles}
              allocation={allocation}
              setAllocation={setAllocation}
              investors={investors}
              addInvestor={addInvestor}
              removeInvestor={removeInvestor}
              updateInvestor={updateInvestor}
              handleSubmit={handleSubmit}
              reset={reset}
              loadExample={loadExample}
              loading={loading}
              error={error}
          />


          <ResultsPanel styles={styles} results={results} />
        </main>
      </div>
  );}