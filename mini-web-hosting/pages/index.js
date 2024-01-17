// pages/signup.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../layout/header';
import '../public/css/index.css';

export default function Home() {
  const makedockernginx = () => {
    console.log('hello');
  };

  return (
    <div>
      <Header />
      <button onClick={makedockernginx}>Click me</button>
    </div>
  );
}
