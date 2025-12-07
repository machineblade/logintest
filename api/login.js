const bcrypt = require('bcryptjs');
const pool = require('../lib/db.js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  
  const { email, password } = req.body;
  
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ success: true, user: { id: user.id, email } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};
