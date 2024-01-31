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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        // 토큰을 로컬 스토리지에 저장합니다.
        localStorage.setItem('token', data.token);
        console.log('로그인 성공!');
        router.push('/');
      } else {
        console.error('로그인 실패');
        setLoginError('로그인에 실패하였습니다. 아이디와 비밀번호를 확인하세요.');
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      setLoginError('로그인 중 오류가 발생했습니다.');
    }
  };

  const navigateToSignup = () => {
    router.push('/signup');
  };

  return (
    <div className='main'>
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
