import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs/promises'; 

const execPromise = promisify(exec);

export default async function handler(req, res) {
  const { username } = req.query;
  const userDirectoryPath = `/home/orthia/miniWebHosting_oj/ftpd/${username}`;
  const dockerComposeFilePath = `${userDirectoryPath}/docker-compose.yml`;
  if (!username) {
    return res.status(400).json({ message: '리눅스 사용자 이름이 필요합니다' });
  }

  try {
    // docker-compose.yml 파일이 존재하는지 확인
    const isDockerComposeFileExists = await fileExists(dockerComposeFilePath);

    if (isDockerComposeFileExists) {
      // 파일이 존재하면 Docker 컴포즈를 종료
      await execPromise(`sudo docker-compose -f ${dockerComposeFilePath} down`);
    } else {
      console.log(`docker-compose.yml 파일이 없으므로 넘어갑니다.`);
    }

    // 사용자 디렉토리 삭제
    await execPromise(`sudo rm -rf ${userDirectoryPath}`);

    // 리눅스 사용자 삭제
    exec(`sudo userdel ${username}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`리눅스 사용자 ${username} 삭제 중 오류 발생: ${error.message}`);
        return res.status(500).json({ message: '리눅스 사용자 삭제 실패' });
      }
      console.log(`리눅스 사용자 ${username} 삭제 성공`);
      return res.status(200).json({ message: '리눅스 사용자가 성공적으로 삭제되었습니다' });
    });
  } catch (error) {
    console.error('작업 중 오류 발생:', error);
    return res.status(500).json({ message: '작업 중 오류 발생' });
  }
}

// 파일이 존재하는지 확인하는 함수
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}