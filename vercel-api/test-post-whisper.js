const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

async function run() {
  const form = new FormData();
  form.append('file', fs.createReadStream('./e2e-test.wav'));
  form.append('model', 'whisper-1');

  try {
    const res = await fetch('https://rretoriq-backend-api.vercel.app/api/whisper-proxy', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
      timeout: 120000
    });

    const text = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', text);
  } catch (err) {
    console.error('ERROR', err);
  }
}

run();
