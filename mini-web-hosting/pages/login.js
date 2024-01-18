// pages/login.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../layout/header';
import '../public/css/index.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // 여기에서 실제 로그인 처리를 수행합니다.
      // 아이디와 비밀번호를 서버로 전송하고, 로그인 성공 여부를 확인합니다.
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log(data.token);
      if (response.ok) {
        // 로그인이 성공하면 성공 메시지를 출력하고, 다른 페이지로 이동할 수 있습니다.
        console.log('Login successful!');
        
        router.push('/');
      } else {
        // 로그인이 실패하면 에러 메시지를 출력합니다.
        console.error('Login failed');
        setLoginError('로그인에 실패하였습니다. 아이디와 비밀번호를 확인하세요.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('로그인 중 오류가 발생했습니다.');
    }
  };
  const navigateToSignup = () => {
    router.push('/signup'); // '/signup'는 회원가입 페이지의 경로입니다.
  };
  

  return (
    <div>
      <Header></Header>
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
        <button type="button" onClick={handleLogin}>
          로그인
        </button>
        <button type="button" onClick={navigateToSignup}>
          회원가입
        </button>
        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      </form>
    </div>
  );
};

export default Login;
