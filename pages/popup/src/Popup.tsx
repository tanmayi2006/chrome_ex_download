import { useState } from 'react';
import type React from 'react';

const Popup: React.FC = () => {
  const [status, setStatus] = useState<string>('');

  const handleDownloadImages = () => {
    setStatus('Downloading images...');
    chrome.runtime.sendMessage({ action: 'downloadImages' }, response => {
      if (chrome.runtime.lastError) {
        setStatus('Error: ' + chrome.runtime.lastError.message);
        return;
      }
      setStatus(response?.message || 'Images downloaded');
    });
  };

  const handleDownloadTables = () => {
    setStatus('Downloading tables...');
    chrome.runtime.sendMessage({ action: 'downloadTables' }, response => {
      if (chrome.runtime.lastError) {
        setStatus('Error: ' + chrome.runtime.lastError.message);
        return;
      }
      setStatus(response?.message || 'Tables downloaded');
    });
  };

  return (
    <div className="min-h-[200px] w-64 rounded-lg bg-gray-100 p-4 font-sans shadow-md">
      <h1 className="mb-4 text-center text-lg font-bold text-gray-800">Download Options</h1>
      <button
        onClick={handleDownloadImages}
        className="mb-2 w-full rounded-md bg-pink-500 py-2 text-white transition-colors hover:bg-pink-600">
        Download All Images
      </button>
      <button
        onClick={handleDownloadTables}
        className="w-full rounded-md bg-sky-500 py-2 text-white transition-colors hover:bg-sky-600">
        Download All Tables
      </button>
      {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default Popup;
