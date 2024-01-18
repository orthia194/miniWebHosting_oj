import { useEffect, useState } from 'react';
import { Header } from '../layout/header';
import '../public/css/index.css';

export default function Usertable() {
  const [userList, setUserList] = useState([]);

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
    <div>
      <Header />
      <h1>User Table</h1>
      <ul className="user_table_box">
        <li>
          <span>Name</span>
          <span>ID</span>
          <span>PW</span>
        </li>
        {userList.map((user, index) => (
          <li key={index}>
            <span>{user.name}</span>
            <span>{user.id}</span>
            <span>{user.pw}</span>
            <button onClick={() => handleDeleteUser(user.id, user.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
