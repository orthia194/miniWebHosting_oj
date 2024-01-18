// pages/signup.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../layout/header';
import '../public/css/index.css';



const Home = () => {
  const [dockerContainerStatus, setDockerContainerStatus] = useState('');
  const [token, setToken] = useState('');

  const startDockerContainer = () => {
    // 로컬 스토리지에서 토큰을 가져옴
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      console.error('토큰이 없습니다. 먼저 로그인하세요.');
      return;
    }

    // 토큰을 상태에 저장
    setToken(storedToken);

    // 도커 컨테이너 실행 명령어
    const dockerRunCommand = `docker run -d -p 0:80 --name my-nginx-container-${token} my-nginx-image`;

    // fetch를 통해 서버 측에서 명령어 실행
    fetch(`/api/start-container?command=${encodeURIComponent(dockerRunCommand)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 토큰을 헤더에 추가
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setDockerContainerStatus(data.message))
      .catch((error) => console.error('도커 컨테이너 시작 중 오류 발생:', error));
  };

  return (
    <div>
      <Header />
      <button onClick={startDockerContainer}>도커 컨테이너 시작</button>
      <p>Docker Container Status: {dockerContainerStatus}</p>
    </div>
  );
};

export default Home;