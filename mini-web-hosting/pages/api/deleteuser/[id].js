import mysql from 'mysql';

export default async function handler(req, res) {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).json({ message: '사용자 ID가 필요합니다' });
  }

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  connection.connect();

  const queryString = 'DELETE FROM USER_table WHERE id = ?';

  connection.query(queryString, [userId], (error, results, fields) => {
    connection.end();

    if (error) {
      return res.status(500).json({ message: '사용자 삭제 실패' });
    }

    return res.status(200).json({ message: '사용자가 성공적으로 삭제되었습니다' });
  });
}
