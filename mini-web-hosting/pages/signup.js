// pages/signup.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../layout/header'
import '../public/css/index.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isIdDuplicate, setIsIdDuplicate] = useState(false);

  const router = useRouter();



  const handleSignup = async () => {
    // 아이디 중복 체크
    const duplicateCheckResponse = await fetch('/api/check-duplicate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
  
    const duplicateCheckResult = await duplicateCheckResponse.json();
  
    if (duplicateCheckResult.isDuplicate) {
      setIsIdDuplicate(true);
      return;
    }
  
    // 중복이 아니라면 가입 진행
    try {
      console.log('Before fetch signup API');
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, password }),
      });
      console.log('After fetch signup API');
  
      if (response.ok) {
        console.log('User added to USER_table');
        console.log(router);
        router.push('/login');
      } else {
        console.error('Failed to insert user to USER_table. Status:', response.status);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div>
      <Header></Header>
      <form>
        <label>
          이름:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          아이디:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          {isIdDuplicate && <span style={{ color: 'red' }}>이미 사용 중인 아이디입니다.</span>}
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