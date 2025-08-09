import { useEffect, useState } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

import type { User } from 'firebase/auth';

function Login() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stop = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
    });
    return () => stop();
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <h1>🔑 로그인 화면</h1>

      {!user && <button onClick={loginWithGoogle}>구글로 로그인</button>}
      {user && (
        <div>
          <p>안녕하세요.</p>
          <p>{user.displayName ?? user.email ?? '사용자'}님!</p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      )}
    </div>
  );
}

export default Login;
