export const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('/api/userinfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        return data; // 사용자 정보 반환
      } else {
        console.error('사용자 정보 가져오기 실패');
        return null;
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 중 오류 발생:', error);
      return null;
    }
  };

  export const handleLogout = (setUserInfo, router) => {
    localStorage.removeItem('token');
    setUserInfo(null);
    router.push('/login');
  };