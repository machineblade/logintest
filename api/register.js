const bcrypt = require('bcryptjs');
const pool = require('../lib/db.js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  
  const { email, password } = req.body;
  
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);
    res.status(201).json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'Email exists' });
  }
};
