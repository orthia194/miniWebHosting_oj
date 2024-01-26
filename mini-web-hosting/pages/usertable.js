import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../layout/header';
import { fetchUserInfo, handleLogout } from './import/userinfo';
import '../public/css/index.css';

export default function Usertable() {
  const [userList, setUserList] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/usertable');
        const data = await response.json();
        setUserList(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId, linuxUsername) => {
    try {
      // 1. 서버 측에서 MySQL 사용자 삭제
      const response = await fetch(`/api/deleteuser/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 2. 리눅스 계정 삭제
        await deleteUserOnLinux(linuxUsername);

        // 3. 성공적으로 삭제된 후 사용자 목록 업데이트
        const updatedUserList = userList.filter((user) => user.id !== userId);
        setUserList(updatedUserList);
      } else {
        console.error('사용자 삭제 실패', userId);
      }
    } catch (error) {
      console.error('사용자 삭제 중 오류 발생:', error);
    }
  };

  const deleteUserOnLinux = async (username) => {
    try {
      const response = await fetch(`/api/deleteuserlinux/${username}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('리눅스 계정 삭제 실패:', username);
      }
    } catch (error) {
      console.error('리눅스 계정 삭제 중 오류 발생:', error);
    }
  };
  return (
    <div className='main'>
      <Header userInfo={userInfo} onLogout={handleLogoutOnOtherPage} />
      <h1>User Table</h1>
      {userInfo && userInfo.username === 'admin' ? (
        <ul className="user_table_box">
          <li>
            <span>Name</span>
            <span>ID</span>
            <span>PW</span>
            <span>Port</span>
          </li>
          {userList.map((user, index) => (
            user.id !== 'admin' && (
              <li key={index}>
                <span>{user.name}</span>
                <span>{user.id}</span>
                <span>{user.pw}</span>
                <span>{user.port}</span>
                <button onClick={() => handleDeleteUser(user.id, user.id)}>삭제</button>
              </li>
            )
          ))}
        </ul>
      ) : (
        <p>관리자 계정이 아닙니다</p>
      )}
    </div>
  );
}