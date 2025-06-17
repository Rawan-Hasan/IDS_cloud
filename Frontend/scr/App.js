// frontend/src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvData = e.target.result;
        
        const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ csv_data: csvData }),
        });

        if (!response.ok) {
          throw new Error('Prediction failed');
        }

        const data = await response.json();
        setResults(data);
      };
      reader.readAsText(file);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Network Intrusion Detection System</h1>
        
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button type="submit" disabled={!file || loading}>
            {loading ? 'Processing...' : 'Analyze'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {results && (
          <div className="results">
            <h2>Results</h2>
            <div className="model-results">
              <h3>Random Forest</h3>
              <p>Attack Probability: {(results.rf_probability[0] * 100).toFixed(2)}%</p>
              <p>Prediction: {results.rf_prediction[0] ? 'Attack' : 'Normal'}</p>
            </div>
            <div className="model-results">
              <h3>KNN</h3>
              <p>Attack Probability: {(results.knn_probability[0] * 100).toFixed(2)}%</p>
              <p>Prediction: {results.knn_prediction[0] ? 'Attack' : 'Normal'}</p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;