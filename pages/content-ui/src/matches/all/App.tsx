// pages/content-ui/src/matches/all/App.tsx
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Papa from 'papaparse';
import { useState } from 'react';
import type React from 'react';

const App: React.FC = () => {
  const [status, setStatus] = useState<string>('');

  const downloadAllImages = async () => {
    setStatus('Downloading images...');
    try {
      const images = Array.from(document.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src => src && src.startsWith('http'));
      if (images.length === 0) {
        setStatus('No images found on the page');
        return;
      }

      const zip = new JSZip();
      const fetchPromises = images.map(async (src, index) => {
        try {
          const response = await fetch(src, { mode: 'cors' });
          if (!response.ok) {
            console.warn(`Skipping image ${src}: HTTP ${response.status}`);
            return;
          }
          const blob = await response.blob();
          const extension = src.split('.').pop()?.split('?')[0] || 'jpg';
          zip.file(`image_${index + 1}.${extension}`, blob);
        } catch (error) {
          console.error(`Failed to fetch image ${src}:`, error);
        }
      });

      await Promise.all(fetchPromises);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'images.zip');
      setStatus(`Downloaded ${images.length} images`);
    } catch (error) {
      setStatus(`Error: ${(error as Error).message}`);
    }
  };

  const downloadAllTables = async () => {
    setStatus('Downloading tables...');
    try {
      const tables = Array.from(document.querySelectorAll('table'));
      if (tables.length === 0) {
        setStatus('No tables found on the page');
        return;
      }

      tables.forEach((table, index) => {
        const rows = Array.from(table.querySelectorAll('tr'));
        const data = rows.map(row => {
          const cells = Array.from(row.querySelectorAll('th, td'));
          return cells.map(cell => cell.textContent?.trim() || '');
        });

        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `table_${index + 1}.csv`);
      });

      setStatus(`Downloaded ${tables.length} tables`);
    } catch (error) {
      setStatus(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-64 rounded-lg bg-gray-100 p-4 font-sans shadow-md">
      <h1 className="mb-4 text-center text-lg font-bold text-gray-800">Download Options</h1>
      <button
        onClick={downloadAllTables}
        className="mb-2 w-full rounded-md bg-sky-500 py-2 text-white transition-colors hover:bg-sky-600">
        Download All Tables
      </button>
      <button
        onClick={downloadAllImages}
        className="w-full rounded-md bg-pink-500 py-2 text-white transition-colors hover:bg-pink-600">
        Download All Images
      </button>
      {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default App;
