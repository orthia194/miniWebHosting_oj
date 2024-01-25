import mysql from 'mysql';

export default async function Dockerport(req, res) {
  const { username } = req.body;

  // MySQL 연결 설정
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    // MySQL 연결
    connection.connect();

    const queryString = `SELECT port FROM USER_table WHERE id = '${username}'`;

    // MySQL에서 SELECT 실행
    connection.query(queryString, (error, results) => {
      if (error) {
        console.error('Error selecting port:', error);
        res.status(500).json({ success: false, message: '포트 조회에 실패했습니다.' });
      } else {
        if (results.length > 0) {
          const userPort = results[0].port;
          console.log(`User ${username}의 포트는 ${userPort}입니다.`);
          res.status(200).json({ success: true, port: userPort });
        } else {
          console.log(`User ${username}를 찾을 수 없습니다.`);
          res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }
      }
      connection.end(); // 쿼리 실행 후 연결 종료
    });
  } catch (error) {
    console.error('An error occurred while processing the request', error);
    res.status(500).json({ success: false, message: '요청 처리 중 오류가 발생했습니다.' });
  }
}
