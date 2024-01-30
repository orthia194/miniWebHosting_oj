import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
require('dotenv').config(); // .env 파일 로드

export default async function handler(req, res) {
  const { username, password } = req.body;

  // .env 파일에서 고정된 JWT_SECRET_KEY 가져옴
  const secretKey = process.env.JWT_SECRET_KEY;

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  connection.connect();

  const queryString = `SELECT id, pw FROM USER_table WHERE id = ?`;
  connection.query(queryString, [username], async (error, results, fields) => {
    if (error) {
      connection.end();
      return res.status(500).json({ message: 'Error during login' });
    }

    connection.end();

    const user = results[0];
    const isPasswordMatch = await bcrypt.compare(password, user.pw);
    if (isPasswordMatch) {
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login successful', token });
    } else {
      return res.status(401).json({ message: 'Login failed' });
    }
  });
}
