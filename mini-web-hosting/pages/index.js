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
          Dockerport(data.username);
        }
      });
    }
  }, []);

  const handleLogoutOnOtherPage = () => {
    handleLogout(setUserInfo, router);
  };

  const Dockerport = async (username) => {
    try {
      const response = await fetch(`/api/check-id-port`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
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

  const pagereload = async () => {
    try {
      await StartDocker();
      router.reload();
    } catch (error) {
      console.error('아 에러야', error);
    }
  };

  return (
    <div className='main'>
      <Header userInfo={userInfo} onLogout={handleLogoutOnOtherPage} />
      {userInfo ? (
        <div>
          {userInfo.username === 'admin' ? (
            <div className='main_mini_web_hosting_adminpage'>
              <div><Link href="/usertable">Mini Web Hosting adminpage</Link></div>
            </div>
          ) : (
            <div>
              {userPort !== null && userPort !== 'none' ? (
                <div className='main_mini_web_hosting_login_clear'>
                  <div><Link href={`/${userPort}`}>나의 홈페이지 구경가기</Link></div>
                  <div><Link href="/howtouse">나의 홈페이지 올리는 방법</Link></div>
                </div>
              ) : (
                <button onClick={pagereload}>나의 홈페이지 만들기</button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className='main_mini_web_hosting_login'>
          <div><Link href="/login">Mini Web Hosting Login</Link></div>
        </div>
      )}
    </div>
  );
};

export default Home;
