import Link from 'next/link';

export function Header() {
  return (
    <div className="header">
      <h1><Link href="/">Mini Web Hosting</Link></h1>
      <Link href="/login">로그인</Link>
      <Link href="/signup">회원가입</Link>
    </div>
  );
}