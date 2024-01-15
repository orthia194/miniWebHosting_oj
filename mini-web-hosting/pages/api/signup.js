// pages/api/signup.js

import mysql from 'mysql';

export default async function handler(req, res) {
  const { name, username, password } = req.body;

  // MySQL 연결 설정
  const connection = mysql.createConnection({
    host: '172.27.0.111',
    user: 'admin',
    password: '1234',
    database: 'user_info',
  });

  // MySQL 연결
  connection.connect();

  // 사용자 정보를 USER_table에 삽입
  const queryString = `INSERT INTO USER_table (name, id, pw) VALUES ('${name}', '${username}', '${password}')`;

  connection.query(queryString, (error, results, fields) => {
    if (error) {
      connection.end();
      return res.status(500).json({ message: 'Failed to insert user to USER_table' });
    }

    connection.end();
    return res.status(200).json({ message: 'User added to USER_table' });
  });
}
