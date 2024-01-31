import Link from 'next/link';
import { useRouter } from 'next/router';

export function Header({ userInfo, onLogout }) {
  const router = useRouter();
  
  return (
    <div className="header">
      <div><h1><Link href="/">Mini Web Hosting</Link></h1></div>
      
      {userInfo ? (
        <>
        <div><p>{userInfo.username}님</p></div>
        <div><button onClick={onLogout}>로그아웃</button></div>
        </>
      ) : (
        <>
        <div><Link href="/login">로그인</Link></div>
        <div><Link href="/signup">회원가입</Link></div>
        </>
      )}
      
    </div>
  );
  
}
