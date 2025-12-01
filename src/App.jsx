import { useState, useMemo } from 'react';
import { integrationMatrix } from './data';
import logo from './assets/logo.png';
import emptyStateImg from './assets/empty_state.png';

function App() {
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');

  // Extract unique sources and targets for dropdowns
  const sources = useMemo(() => {
    const uniqueSources = new Set(integrationMatrix.map(row => row.source));
    return Array.from(uniqueSources).sort();
  }, []);

  const targets = useMemo(() => {
    const uniqueTargets = new Set(integrationMatrix.map(row => row.target));
    return Array.from(uniqueTargets).sort();
  }, []);

  // Filter results based on selection
  const results = useMemo(() => {
    if (!selectedSource || !selectedTarget) return [];
    return integrationMatrix.filter(
      row => row.source === selectedSource && row.target === selectedTarget
    );
  }, [selectedSource, selectedTarget]);

  const hasSelection = selectedSource && selectedTarget;

  return (
    <div className="container">
      <div className="card">
        <header className="header">
          <img src={logo} alt="ETL Tool Logo" className="logo" />
          <h1 className="title">Connector Lookup</h1>
          <p className="description">
            Choose a Source and a Target system to see available ETL tools and connectors.
          </p>
        </header>

        <div className="controls">
          <div className="control-group">
            <label htmlFor="source-select" className="label">
              Source System
            </label>
            <select
              id="source-select"
              className="select"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="">Select Source...</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="target-select" className="label">
              Target System
            </label>
            <select
              id="target-select"
              className="select"
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
            >
              <option value="">Select Target...</option>
              {targets.map((target) => (
                <option key={target} value={target}>
                  {target}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="results-area">
          {!hasSelection ? (
            <div className="empty-state">
              <img src={emptyStateImg} alt="Search" className="empty-image" />
              <p>Select both a Source and a Target to view integrations.</p>
            </div>
          ) : results.length > 0 ? (
            <div className="table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>ETL Tool</th>
                    <th>Source Connector</th>
                    <th>Source Protocol</th>
                    <th>Target Connector</th>
                    <th>Target Protocol</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <span className="badge">{row.etlTool}</span>
                      </td>
                      <td>{row.sourceConnector}</td>
                      <td>{row.sourceProtocol}</td>
                      <td>{row.targetConnector}</td>
                      <td>{row.targetProtocol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🚫</div>
              <p>No integration available for the selected Source–Target combination.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
