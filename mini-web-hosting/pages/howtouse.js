import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../layout/header';
import { fetchUserInfo, handleLogout } from './import/userinfo';
import Image from 'next/image';
import '../public/css/index.css';

const HowToUse = () => {
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

  return (
    <div className='main'>
      <Header userInfo={userInfo} onLogout={handleLogoutOnOtherPage} />
      <div>사용방법! ftp = 210.106.106.47:21</div>
      <div>
        <Image src="/images/1.PNG" alt="My Image" layout="responsive" width={1} height={1} />
        <Image src="/images/2.PNG" alt="My Image" layout="responsive" width={1} height={1} />
        <Image src="/images/3.PNG" alt="My Image" layout="responsive" width={1} height={1} />
        <Image src="/images/4.PNG" alt="My Image" layout="responsive" width={1} height={1} />
      </div>
    </div>
  );
};

export default HowToUse;
