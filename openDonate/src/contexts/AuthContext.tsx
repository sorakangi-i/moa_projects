import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

// context 타입 정의
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context Provider 컴포넌트 생성 (Context를 사용하는 컴포넌트들을 감싸는 컴포넌트)
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 안에서 사용해야 해요!');
  }
  return context;
}

// Context Provider(제공자) 컴포넌트 생성
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stop = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return () => stop();
  }, []);

  const value = {
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
