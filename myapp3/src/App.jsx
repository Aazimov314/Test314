import { useState, useEffect } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [parsedText, setParsedText] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (file) {
      console.log('Selected file:', file);
    }
  }, [file]);

  async function sendtoApi() {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setParsedText('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://localhost:8000/api", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data length:', data.text.length);
      setParsedText(data.text);
    } catch (error) {
      console.error('Error:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    setError(null);
  };

  return (
    <>
      <h1>Please put your file below</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={sendtoApi} disabled={isLoading || !file}>
        {isLoading ? 'Parsing...' : 'Click to parse'}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {isLoading && <p>Parsing PDF, please wait...</p>}
      {parsedText && (
        <div>
          <h2>Parsed Text:</h2>
          <p>Character count: {parsedText.length}</p>
          <textarea
            rows={20}
            style={{width: '100%', maxHeight: '500px', overflowY: 'auto'}}
            value={parsedText}
            readOnly
          />
        </div>
      )}
    </>
  );
}

export default App;


