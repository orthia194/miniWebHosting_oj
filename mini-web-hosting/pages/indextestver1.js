import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../layout/header';
import { fetchUserInfo } from './import/userinfo';
import '../public/css/index.css';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null); // 추가된 부분
  const router = useRouter();

  useEffect(() => {
    // 저장된 토큰을 가져옵니다.
    const storedToken = localStorage.getItem('token');

    // 저장된 토큰이 있을 경우 서버에 전송하여 사용자 정보를 가져옵니다.
    if (storedToken) {
      fetchUserInfo(storedToken);
    }
  }, []);

  const handleLogout = () => {
    // 로그아웃 시 토큰을 삭제하고 사용자 정보를 초기화합니다.
    localStorage.removeItem('token');
    setUserInfo(null);
    router.push('/login');
  };

  const startdocker = async () => {
    try {
      const response = await fetch('/api/newfile');
      if (response.ok) {
        const result = await response.json();
        console.log(result); // API에서 반환된 결과
      } else {
        console.error('Failed to call the API');
      }
    } catch (error) {
      console.error('An error occurred while calling the API', error);
    }
  };

  return (
    <div>
      <Header userInfo={userInfo} onLogout={handleLogout} />
      {userInfo ? (
        <div>
          <button onClick={startdocker}>도커 컨테이너 시작</button>
        </div>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  );
};

export default Home;
