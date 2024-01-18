import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

export default async function handler(req, res) {
  const { username } = req.query;
  const userDirectorydestroy = `/home/orthia/miniWebHosting_oj/ftpd/${username}`;
  await execPromise(`sudo rm -rf ${userDirectorydestroy}`);
  if (!username) {
    return res.status(400).json({ message: '리눅스 사용자 이름이 필요합니다' });
  }

  try {

    const { exec } = require('child_process');

    exec(`sudo userdel ${username}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`리눅스 사용자 ${username} 삭제 중 오류 발생: ${error.message}`);
        return res.status(500).json({ message: '리눅스 사용자 삭제 실패' });
      }
      console.log(`리눅스 사용자 ${username} 삭제 성공`);
      return res.status(200).json({ message: '리눅스 사용자가 성공적으로 삭제되었습니다' });
    });
  } catch (error) {
    console.error('리눅스 사용자 삭제 중 오류 발생:', error);
    return res.status(500).json({ message: '리눅스 사용자 삭제 중 오류 발생' });
  }
}
