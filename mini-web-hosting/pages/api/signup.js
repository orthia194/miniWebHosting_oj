import { exec } from 'child_process';
import mysql from 'mysql';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const { name, username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10); // 두 번째 인수는 해싱 솔트의 수

  const restrictedUsernames = ["root", "admin", "daemon", "bin", "sys", "sync", "games", "man", "lp", "mail", "news", "uucp", "proxy", "www", "backup", "list", "irc", "gnats", "nobody", "systemd-network", "systemd-resolve", "systemd-timesync", "messagebus", "syslog", "_apt", "tss", "uuidd", "tcpdump", "landscape", "pollinate", "usbmux", "sshd", "systemd-coredump", "cloud", "lxd", "ubuntu", "ntp", "orthia", "jyh", "ftp", "fwupd-refresh", "_rpc", "statd"].map(name => name.toLowerCase());

  // 제공된 사용자 이름이 제한 목록에 있는지 확인 (대소문자 구분 없이)
  if (restrictedUsernames.includes(username.toLowerCase())) {
    return res.status(400).json({ message: '사용할 수 없는 사용자 이름입니다' });
  }

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
  const queryString = `INSERT INTO USER_table (name, id, pw, port) VALUES ('${name}', '${username}', '${hashedPassword}', 'none')`;

  connection.query(queryString, (error, results, fields) => {
    if (error) {
      connection.end();
      return res.status(500).json({ message: 'USER_table에 사용자 추가 실패' });
    }

    // 사용자 생성 명령어 (adduser 또는 useradd) 실행
    exec(`sudo useradd -m ${username}`, (createUserError, createUserStdout, createUserStderr) => {
      if (createUserError) {
        connection.end();
        return res.status(500).json({ message: '사용자 계정 생성 실패', error: createUserError.message });
      }

      // 사용자에게 비밀번호 설정
      exec(`echo '${username}:${password}' | sudo chpasswd`, (setPasswordError, setPasswordStdout, setPasswordStderr) => {
        if (setPasswordError) {
          connection.end();
          return res.status(500).json({ message: '비밀번호 설정 실패', error: setPasswordError.message });
        }

        // 리눅스 계정 생성 및 디렉토리 생성
        const userDirectory = `/home/orthia/miniWebHosting_oj/ftpd/${username}/html/www`;
        fs.mkdir(userDirectory, { recursive: true })
          .then(() => {
            // 생성된 디렉토리에 chown ${username}:orthia 적용
            const chownCommand = `sudo chown ${username}:orthia ${userDirectory}`;
            exec(chownCommand, (chownError, chownStdout, chownStderr) => {
              if (chownError) {
                connection.end();
                return res.status(500).json({ message: 'chown 설정 실패', error: chownError.message });
              }

              connection.end();
              return res.status(200).json({ message: '사용자 계정 및 비밀번호 설정 성공' });
            });
          })
          .catch((mkdirError) => {
            connection.end();
            return res.status(500).json({ message: '디렉토리 생성 실패', error: mkdirError.message });
          });
      });
    });
  });
}
