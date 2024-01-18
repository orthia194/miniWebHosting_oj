import mysql from 'mysql';

export default async function handler(req, res) {
  // MySQL 연결 설정
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  // MySQL 연결
  connection.connect();

  // 사용자 정보를 USER_table에서 가져오기
  const queryString = 'SELECT name, id, pw FROM USER_table';

  connection.query(queryString, (error, results, fields) => {
    connection.end();

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch user data from USER_table' });
    }

    return res.status(200).json(results);
  });
}
