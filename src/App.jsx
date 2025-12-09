import { useState, useMemo } from 'react';
import { integrationMatrix } from './data';
import logo from './assets/logo.png';
import emptyStateImg from './assets/empty_state.png';

function App() {
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; // <--- PASTE YOUR URL HERE

  // --- 1. Request Metadata State ---
  const [requestId] = useState(() =>
    `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`
  );
  const [requestDate] = useState(() =>
    new Date().toLocaleDateString('en-CA')
  );
  const [requesterName, setRequesterName] = useState('');
  const [requesterProjectSol, setRequesterProjectSol] = useState('');
  const [businessNeed, setBusinessNeed] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');

  // --- Existing State ---
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');

  // --- New Fields State ---
  const [integrationFrequency, setIntegrationFrequency] = useState('');
  const [integrationFrequencyOther, setIntegrationFrequencyOther] = useState('');
  const [dataTransformationRequirements, setDataTransformationRequirements] = useState([]);
  const [dataTransformationOther, setDataTransformationOther] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [errorHandling, setErrorHandling] = useState('');

  // --- Validation State ---
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // 'submitting', 'success', 'error'

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

  // --- Handlers ---

  const handleTransformationChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDataTransformationRequirements(prev => [...prev, value]);
    } else {
      setDataTransformationRequirements(prev => prev.filter(item => item !== value));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    } else {
      setAttachedFile(null);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!requesterName.trim()) errors.requesterName = 'Requester Name is required';
    if (!selectedSource) errors.selectedSource = 'Source System is required';
    if (!selectedTarget) errors.selectedTarget = 'Target System is required';
    if (!integrationFrequency) errors.integrationFrequency = 'Integration Frequency is required';
    if (integrationFrequency === 'Other (Specify)' && !integrationFrequencyOther.trim()) {
      errors.integrationFrequencyOther = 'Please specify the frequency';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to top or first error could be added here
      return;
    }
    setFormErrors({});
    setSubmitStatus('submitting');

    const payload = {
      requestId,
      requestDate,
      requesterName,
      requesterProjectSol,
      businessNeedJustification: businessNeed,
      desiredOutcomeBusinessValue: desiredOutcome,
      sourceSystem: selectedSource,
      targetSystem: selectedTarget,
      integrationFrequency,
      integrationFrequencyOther: integrationFrequency === 'Other (Specify)' ? integrationFrequencyOther : '',
      dataTransformationRequirements, // Array
      dataTransformationOther: dataTransformationRequirements.includes("Other (Specify)") ? dataTransformationOther : '',
      uploadedFileName: attachedFile ? attachedFile.name : 'No file attached',
      errorHandlingMonitoring: errorHandling,
    };

    console.log('Submitting Payload:', payload);

    try {
      // Use 'no-cors' mode if you don't need to read the response, 
      // OR ensure your Apps Script returns proper CORS headers.
      // We'll use standard POST assuming the script (from README) handles CORS.

      const response = await fetch('https://script.google.com/macros/s/AKfycbzpA85Y35CJ6MVb2xf8OuU3ax2DprVGC6B2TXNv55XiPa47QBx0lyKSOnT8p7eS_zp7/exec', {
        method: 'POST',
        // mode: 'no-cors', // Uncomment if you face CORS issues and don't need response data
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // 'text/plain' avoids preflight OPTIONS request
        },
        body: JSON.stringify(payload),
      });

      // If using no-cors, response.ok and json() won't work as expected.
      // But with the provided script, we try to return JSON.

      if (response.ok || response.type === 'opaque') {
        setSubmitStatus('success');
        alert('Request submitted successfully!');
        // Optional: Reset form here
      } else {
        throw new Error('Network response was not ok');
      }

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      alert('Error submitting request. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <header className="header">
          <img src={logo} alt="ETL Tool Logo" className="logo" />
          <h1 className="title">One Entry Integration Model</h1>
          <p className="description">
            Fill out the request details and choose a Source/Target system.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="request-form">
          {/* 1. Request Metadata */}
          <section className="form-section">
            <h2 className="section-title">Request Details</h2>
            <div className="controls-grid">
              <div className="control-group">
                <label className="label">Request ID</label>
                <input type="text" className="input readonly" value={requestId} readOnly />
              </div>
              <div className="control-group">
                <label className="label">Request Date</label>
                <input type="text" className="input readonly" value={requestDate} readOnly />
              </div>
              <div className="control-group">
                <label className="label">Requester Name *</label>
                <input
                  type="text"
                  className={`input ${formErrors.requesterName ? 'error' : ''}`}
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="Enter your name"
                />
                {formErrors.requesterName && <span className="error-text">{formErrors.requesterName}</span>}
              </div>
              <div className="control-group">
                <label className="label">Requester Project / SOL</label>
                <input
                  type="text"
                  className="input"
                  value={requesterProjectSol}
                  onChange={(e) => setRequesterProjectSol(e.target.value)}
                  placeholder="Project Name or SOL ID"
                />
              </div>
            </div>
            <div className="control-group full-width">
              <label className="label">Business Need / Justification</label>
              <textarea
                className="textarea"
                value={businessNeed}
                onChange={(e) => setBusinessNeed(e.target.value)}
                rows={3}
              />
            </div>
            <div className="control-group full-width">
              <label className="label">Desired Outcome / Business Value</label>
              <textarea
                className="textarea"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                rows={3}
              />
            </div>
          </section>

          {/* 2. Source / Target System */}
          <section className="form-section">
            <h2 className="section-title">System Selection</h2>
            <div className="controls">
              <div className="control-group">
                <label htmlFor="source-select" className="label">Source System *</label>
                <select
                  id="source-select"
                  className={`select ${formErrors.selectedSource ? 'error' : ''}`}
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                >
                  <option value="">Select Source...</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
                {formErrors.selectedSource && <span className="error-text">{formErrors.selectedSource}</span>}
              </div>

              <div className="control-group">
                <label htmlFor="target-select" className="label">Target System *</label>
                <select
                  id="target-select"
                  className={`select ${formErrors.selectedTarget ? 'error' : ''}`}
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                >
                  <option value="">Select Target...</option>
                  {targets.map((target) => (
                    <option key={target} value={target}>{target}</option>
                  ))}
                </select>
                {formErrors.selectedTarget && <span className="error-text">{formErrors.selectedTarget}</span>}
              </div>
            </div>

            {/* Existing Results Area */}
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
                          <td><span className="badge">{row.etlTool}</span></td>
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
          </section>

          {/* 3. Integration Frequency */}
          <section className="form-section">
            <h2 className="section-title">Integration Details</h2>
            <div className="control-group">
              <label className="label">Integration Frequency *</label>
              <div className="custom-multiselect">
                <div
                  className="multiselect-trigger"
                  onClick={() => document.getElementById('frequency-dropdown').classList.toggle('show')}
                >
                  {integrationFrequency || "Select Frequency..."}
                  <span className="arrow">▼</span>
                </div>
                <div id="frequency-dropdown" className="multiselect-dropdown">
                  {[
                    "Real-time",
                    "Near real-time",
                    "Hourly",
                    "Daily",
                    "Weekly",
                    "On-demand",
                    "Other (Specify)"
                  ].map((option) => (
                    <div
                      key={option}
                      className="dropdown-item"
                      onClick={() => {
                        setIntegrationFrequency(option);
                        document.getElementById('frequency-dropdown').classList.remove('show');
                      }}
                      style={{ cursor: 'pointer', backgroundColor: integrationFrequency === option ? '#e0f2fe' : '' }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
              {formErrors.integrationFrequency && <span className="error-text">{formErrors.integrationFrequency}</span>}
            </div>
            {integrationFrequency === 'Other (Specify)' && (
              <div className="control-group" style={{ marginTop: '1rem' }}>
                <label className="label">Please specify frequency *</label>
                <input
                  type="text"
                  className={`input ${formErrors.integrationFrequencyOther ? 'error' : ''}`}
                  value={integrationFrequencyOther}
                  onChange={(e) => setIntegrationFrequencyOther(e.target.value)}
                />
                {formErrors.integrationFrequencyOther && <span className="error-text">{formErrors.integrationFrequencyOther}</span>}
              </div>
            )}
          </section>

          {/* 4. Data Transformation Requirements */}
          <section className="form-section">
            <div className="control-group">
              <label className="label">Data Transformation Requirements</label>
              <div className="custom-multiselect">
                <div
                  className="multiselect-trigger"
                  onClick={() => document.getElementById('transform-dropdown').classList.toggle('show')}
                >
                  {dataTransformationRequirements.length > 0
                    ? `${dataTransformationRequirements.length} selected`
                    : "Select Transformation Requirements..."}
                  <span className="arrow">▼</span>
                </div>
                <div id="transform-dropdown" className="multiselect-dropdown">
                  {[
                    "None (Direct Load - ELT preferred)",
                    "Simple Mappings (e.g., rename columns, basic type conversions)",
                    "Moderate Transformations (e.g., lookups, aggregations, conditional logic)",
                    "Complex Transformations (e.g., data cleansing, de-duplication, complex business rules)",
                    "Data Quality Checks (e.g., validation, standardization)",
                    "PII Masking / Anonymization",
                    "Other (Specify)"
                  ].map((option) => (
                    <label key={option} className="checkbox-label dropdown-item">
                      <input
                        type="checkbox"
                        value={option}
                        checked={dataTransformationRequirements.includes(option)}
                        onChange={handleTransformationChange}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              {dataTransformationRequirements.includes("Other (Specify)") && (
                <div style={{ marginTop: '1rem' }}>
                  <label className="label">Please specify other transformation *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Describe other transformation requirements"
                    value={dataTransformationOther}
                    onChange={(e) => setDataTransformationOther(e.target.value)}
                  />
                </div>
              )}
            </div>
          </section>

          {/* 5. File Upload */}
          <section className="form-section">
            <div className="control-group">
              <label className="label">Attach Supporting File (optional)</label>
              <input
                type="file"
                className="file-input"
                onChange={handleFileChange}
              />
            </div>
          </section>

          {/* 6. Error Handling & Monitoring */}
          <section className="form-section">
            <div className="control-group">
              <label className="label">Error Handling & Monitoring</label>
              <div className="custom-multiselect">
                <div
                  className="multiselect-trigger"
                  onClick={() => document.getElementById('error-dropdown').classList.toggle('show')}
                >
                  {errorHandling || "Select Option..."}
                  <span className="arrow">▼</span>
                </div>
                <div id="error-dropdown" className="multiselect-dropdown">
                  {[
                    "Basic logging",
                    "Detailed error logging with retry mechanisms",
                    "Alerting (email, Teams, etc.) on failure"
                  ].map((option) => (
                    <div
                      key={option}
                      className="dropdown-item"
                      onClick={() => {
                        setErrorHandling(option);
                        document.getElementById('error-dropdown').classList.remove('show');
                      }}
                      style={{ cursor: 'pointer', backgroundColor: errorHandling === option ? '#e0f2fe' : '' }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={submitStatus === 'submitting'}>
              {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
