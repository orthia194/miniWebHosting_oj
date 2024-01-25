import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../layout/header';
import { fetchUserInfo, handleLogout } from './import/userinfo';
import Link from 'next/link';
import '../public/css/index.css';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userPort, setUserPort] = useState(null);
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

  const Dockerport = async () => {
    try {
      const response = await fetch(`/api/check-id-port`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userInfo.username,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          const userPortValue = result.port;
          setUserPort(userPortValue); // 상태에 포트 값을 저장

          console.log(`사용자의 포트: ${userPortValue}`);
        } else {
          console.error('Failed to get user port:', result.message);
        }
      } else {
        console.error('Failed to call the API');
      }
    } catch (error) {
      console.error('An error occurred while calling the API', error);
    }
  };

  const StartDocker = async () => {
    try {
      const response = await fetch(`/api/newfile?username=${userInfo.username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.username,
        }),
      });

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
  Dockerport();
  console.log(userPort)

  return (
    <div>
      <Header userInfo={userInfo} onLogout={handleLogoutOnOtherPage} />
      {userInfo ? (
        <div>
          {userInfo.username === 'admin' ? (
            <Link href="/usertable">관리자페이지</Link>
          ) : (
            <div>
              <button onClick={StartDocker}>도커 컨테이너 시작</button>
              {userPort !== null ? (
                <Link href={`http://210.106.106.47:${userPort}`}>도커 페이지</Link>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  );
};

export default Home;
