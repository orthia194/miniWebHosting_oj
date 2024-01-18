// api/login.js

import mysql from 'mysql';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { username, password } = req.body;
  const crypto = require('crypto');
  const secretKey = crypto.randomBytes(32).toString('hex');

  // MySQL 연결 설정
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  // MySQL 연결
  connection.connect();

  // 아이디와 비밀번호를 사용하여 로그인 체크
  const queryString = `SELECT * FROM USER_table WHERE id = ? AND pw = ?`;
  connection.query(queryString, [username, password], (error, results, fields) => {
    if (error) {
      connection.end();
      return res.status(500).json({ message: 'Error during login' });
    }
    
    connection.end();

    // 결과가 있으면 로그인 성공, 없으면 실패
    if (results.length > 0) {
      // 토큰 생성
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login successful', token });
    } else {
      return res.status(401).json({ message: 'Login failed' });
    }
  });
}
