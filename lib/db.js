// lib/db.js
const mysql = require('serverless-mysql');

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
});

exports.query = async (q, values = []) => {
  try {
    const results = await db.query(q, values);
    await db.end();
    return results;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
