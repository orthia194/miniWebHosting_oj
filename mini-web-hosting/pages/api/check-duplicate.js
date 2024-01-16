// pages/api/check-duplicate.js

import mysql from 'mysql';

export default async function handler(req, res) {
  const { username } = req.body;

  // MySQL 연결 설정
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  // MySQL 연결
  connection.connect();

  // 사용자 아이디 중복 체크
  const queryString = `SELECT * FROM USER_table WHERE id = '${username}'`;

  connection.query(queryString, (error, results, fields) => {
    if (error) {
      connection.end();
      return res.status(500).json({ message: 'Error checking duplicate username' });
    }

    connection.end();
    const isDuplicate = results.length > 0;
    return res.status(200).json({ isDuplicate });
  });
}
