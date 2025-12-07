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

  if (!email || !password) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // For now, just return success; you can add JWT later
    return res.status(200).json({ userId: user.id });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
};
