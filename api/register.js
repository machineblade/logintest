const bcrypt = require('bcryptjs');
const db = require('../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  let body = '';
  await new Promise(resolve => {
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', resolve);
  });

  const data = JSON.parse(body || '{}');
  const { email, password } = data;

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const existing = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hash]
    );

    return res.status(200).json({ userId: result.insertId });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
};
