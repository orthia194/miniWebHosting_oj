const fs = require('fs');
const { execSync } = require('child_process');

const startdocker = () => {
  console.log("스크립트가 시작되었습니다.");

  while (true) {
    // 랜덤 포트 생성 (10000부터 11000까지)
    const randomPort = Math.floor(Math.random() * 1001) + 10000;

    // 기존 YAML 파일 경로
    const originalYamlFile = "../docker-compose/test.yml";

    // 새로운 YAML 파일 이름 동적 생성
    const newYamlFile = `../docker-compose/your_new_yaml_file_${randomPort}.yml`;

    // 확인할 포트가 이미 사용 중인지 확인
    try {
      execSync(`lsof -i :${randomPort}`);
      console.log(`포트 ${randomPort}가 이미 사용 중입니다. 다른 포트 시도 중...`);
      return randomPort;
    } catch (error) {
      // 기존 YAML 파일을 읽어와 내용을 수정한 후, 새로운 파일로 저장
      const yamlContent = fs.readFileSync(originalYamlFile, 'utf-8');
      const updatedYamlContent = yamlContent.replace(/- "10001:80"/, `- "${randomPort}:80"`);

      fs.writeFileSync(newYamlFile, updatedYamlContent);

      console.log(`새로운 YAML 파일이 생성되었습니다: ${newYamlFile}`);
      
      // Docker Compose 실행
      execSync(`docker-compose -f ${newYamlFile} up -d`);

      console.log("스크립트가 종료되었습니다.");
      break;
    }
  }
};

export default startdocker;