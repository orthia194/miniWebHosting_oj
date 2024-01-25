const fs = require('fs');
const { execSync } = require('child_process');
const mysql = require('mysql');

const startdocker = (req, res) => {
  console.log("스크립트가 시작되었습니다.");
  const username = req.query.username;
  const { userId } = req.body;

  // MySQL 연결 설정
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  // MySQL 연결
  connection.connect();
  
  while (true) {
    // 랜덤 포트 생성 (10000부터 11000까지)
    const randomPort = Math.floor(Math.random() * 1001) + 10000;

    // 기존 YAML 파일 경로
    const originalYamlFile = "../docker-compose/original.yml";

    // 새로운 YAML 파일 이름 동적 생성
    const newYamlFile = `../ftpd/${username}/nginx_${randomPort}.yml`;

    // 확인할 포트가 이미 사용 중인지 확인
    try {
      execSync(`lsof -i :${randomPort}`);
      console.log(`포트 ${randomPort}가 이미 사용 중입니다. 다른 포트 시도 중...`);
      return randomPort;
    } catch (error) {
      // 기존 YAML 파일을 읽어와 내용을 수정한 후, 새로운 파일로 저장
      const yamlContent = fs.readFileSync(originalYamlFile, 'utf-8');

      // 새로운 서비스명을 동적으로 생성
      const serviceName = `web_${randomPort}`;

      // 서비스명을 새로운 파일에 삽입
      const updatedYamlContent = yamlContent.replace(/web:/, `${serviceName}:`);

      // 포트 번호를 동적으로 변경
      const finalYamlContent = updatedYamlContent.replace(/- "10001:80"/, `- "${randomPort}:80"`);

      const volumeContent = finalYamlContent.replace(/test/g, `${username}`)
      fs.writeFileSync(newYamlFile, volumeContent);
      const updateport = `UPDATE USER_table SET port = ${randomPort} WHERE id = '${userId}'`;



      // MySQL에서 UPDATE 실행
      connection.query(updateport, (error, results) => {
        if (error) {
          console.error('Error updating port:', error);
        } else {
          console.log(`User ${userId}의 port가 ${randomPort}로 업데이트되었습니다.`);
        }
        connection.end();
      });

      console.log(`새로운 YAML 파일이 생성되었습니다: ${newYamlFile}`);
      
      // Docker Compose 실행
      execSync(`docker-compose -f ${newYamlFile} up -d`);

      console.log("스크립트가 종료되었습니다.");
      break;
    }
  }
};

export default startdocker;
