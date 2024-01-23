import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../layout/header';
import { fetchUserInfo,handleLogout  } from './import/userinfo';
import '../public/css/index.css';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null); // 추가된 부분
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      fetchUserInfo(storedToken).then((data) => {
        if (data) {
          setUserInfo(data);
        }
      });
    }
  }, []);

  const handleLogoutOnOtherPage = () => {
    handleLogout(setUserInfo, router);
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
      <Header userInfo={userInfo} onLogout={handleLogoutOnOtherPage} />
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
