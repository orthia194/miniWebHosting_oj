import Link from 'next/link';
import { useRouter } from 'next/router';

export function Header({ userInfo, onLogout }) {
  const router = useRouter();
  
  return (
    <div className="header">
      <h1><Link href="/">Mini Web Hosting</Link></h1>
      {userInfo ? (
        <>
          <p>안녕하세요, {userInfo.username}님!</p>
          <button onClick={onLogout}>로그아웃</button>
        </>
      ) : (
        <>
          <Link href="/login">로그인</Link>
          <Link href="/signup">회원가입</Link>
        </>
      )}
      
    </div>
  );
  
}
