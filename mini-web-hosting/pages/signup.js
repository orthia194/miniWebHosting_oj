// pages/signup.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import mysql from 'mysql';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSignup = async () => {
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
    const queryString = `INSERT INTO USER_table (username, password) VALUES ('${username}', '${password}')`;

    connection.query(queryString, (error, results, fields) => {
      if (error) throw error;
      console.log('User added to USER_table');
    });

    // MySQL 연결 종료
    connection.end();

    // 회원가입 후 다른 페이지로 이동
    router.push('/dashboard'); // 이동하고 싶은 페이지 경로로 수정하세요.
  };

  return (
    <div>
      <h1>회원가입 폼</h1>
      <form>
        <label>
          아이디:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          비밀번호:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleSignup}>
          가입하기
        </button>
      </form>
    </div>
  );
};

export default Signup;
