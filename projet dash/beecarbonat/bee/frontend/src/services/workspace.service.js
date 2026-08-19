import { getAccessToken } from '../lib/firebase';

export async function uploadToDrive(fileName, content, mimeType = 'text/plain') {
  const token = getAccessToken();
  if (!token) throw new Error("Accès Google Workspace requis. Veuillez vous connecter avec Google.");

  const metadata = {
    name: fileName,
    mimeType
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([content], { type: mimeType }));

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Erreur lors de l\'upload Google Drive');
  }

  return res.json();
}

export async function exportToSheets(title, rowData) {
  const token = getAccessToken();
  if (!token) throw new Error("Accès Google Workspace requis. Veuillez vous connecter avec Google.");

  // 1. Create a new spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: { title }
    })
  });

  if (!createRes.ok) {
    const error = await createRes.json();
    throw new Error(error.error?.message || 'Erreur lors de la création Google Sheets');
  }

  const sheet = await createRes.json();
  const spreadsheetId = sheet.spreadsheetId;

  // 2. Append data
  const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: rowData
    })
  });

  if (!appendRes.ok) {
    throw new Error('Erreur lors de l\'insertion des données dans Google Sheets');
  }

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
}
