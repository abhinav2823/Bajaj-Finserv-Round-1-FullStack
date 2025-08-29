const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const isIntegerString = (s) => /^-?\d+$/.test(s);
const isAlphaString = (s) => /^[A-Za-z]+$/.test(s);

function buildUserId() {
  const fullName = (process.env.FULL_NAME || 'abhinav_anand').toLowerCase().replace(/\s+/g, '_');
  const dob = (process.env.DOB_DDMMYYYY || '28022003');
  return `${fullName}_${dob}`;
}

// Core route
app.post('/bfhl', (req, res, next) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ is_success: false, error: 'Body must be JSON object' });
    }
    const data = payload.data;
    if (!Array.isArray(data)) {
      return res.status(400).json({ is_success: false, error: '"data" must be an array' });
    }

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0n;


    const alphaChars = [];

    for (const item of data) {
      const s = String(item);


      for (const ch of s) {
        if (/[A-Za-z]/.test(ch)) {
          alphaChars.push(ch);
        }
      }

      if (isIntegerString(s)) {
        const n = BigInt(s);
        sum += n;
        if ((n % 2n) === 0n) {
          even_numbers.push(s);
        } else {
          odd_numbers.push(s);
        }
      } else if (isAlphaString(s)) {
        alphabets.push(s.toUpperCase());
      } else {
        special_characters.push(s);
      }
    }

    alphaChars.reverse();
    const concatChars = alphaChars.map((ch, idx) => {
      if (idx % 2 === 0) return ch.toUpperCase();
      return ch.toLowerCase();
    });
    const concat_string = concatChars.join('');

    const response = {
      is_success: true,
      user_id: buildUserId(),
      email: process.env.EMAIL || 'abhinav2824@gmail.com',
      roll_number: process.env.ROLL_NUMBER || '22BCE10427',
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string
    };

    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});


app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'BFHL API is running', route: '/bfhl' });
});

// 404 for other routes
app.use((req, res, _next) => {
  if (req.method === 'POST' && req.path === '/bfhl') {
    return res.status(500).json({ is_success: false, error: 'Unexpected error' });
  }
  return res.status(404).json({ is_success: false, error: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ is_success: false, error: 'Invalid JSON body' });
  }
  console.error('Unhandled error:', err);
  return res.status(500).json({ is_success: false, error: 'Internal Server Error' });
});


export default app;
