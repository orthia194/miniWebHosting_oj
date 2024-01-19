
import { exec } from 'child_process';
import mysql from 'mysql';
import fs from 'fs/promises';

export default async function handler(req, res) {
  const { name, username, password } = req.body;

  // MySQL 연결 설정
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
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

    // 리눅스 계정 생성 및 디렉토리 생성
    const userDirectory = `/home/orthia/miniWebHosting_oj/ftpd/${username}/html/www`;
      fs.mkdir(userDirectory, { recursive: true })
      
        .then(() => {
          connection.end();
          return res.status(200).json({ message: 'USER_table에 사용자 추가 및 디렉토리 생성 성공' });
        })
        .catch((mkdirError) => {
          connection.end();
          return res.status(500).json({ message: '디렉토리 생성 실패', error: mkdirError.message });
        });
        exec(`sudo adduser ${username}`, (addUserError, addUserStdout, addUserStderr) => {
          if (addUserError) {
            connection.end();
            return res.status(500).json({ message: '사용자 계정 생성 실패', error: addUserError.message });
          }
          
    });
  });
}