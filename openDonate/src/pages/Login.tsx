import { useEffect, useState } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

// Shadcn/ui 컴포넌트 import
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Button } from '../components/ui/button';

function Login() {
  const [user, setUser] = useState<User | null>(null);

  // 현재 로그인 상태를 감지하고 user 상태를 업데이트
  // 이 부분이 로그인 유지 기능을 담당합니다.
  useEffect(() => {
    const stop = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
    });
    // 컴포넌트 언마운트 시 리스너 해제
    return () => stop();
  }, []);

  // 구글 팝업으로 로그인/가입
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      // 로그인 실패 시 사용자에게 알림
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>

        {/* 탭 컴포넌트 */}
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">일반 사용자</TabsTrigger>
            <TabsTrigger value="center">복지관 운영자</TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="mt-4">
            {/* 일반 사용자 탭 콘텐츠 */}
            <p className="text-sm text-gray-500 mb-4 text-center">
              구글 계정으로 간편하게 로그인하고 기부 활동을 시작하세요.
            </p>
            {!user ? (
              <Button onClick={loginWithGoogle} className="w-full bg-blue-500">
                <img
                  src="/path/to/google-icon.svg"
                  alt="Google"
                  className="h-4 w-4 mr-2"
                />
                구글로 로그인 / 가입
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">
                  안녕하세요, {user.displayName ?? user.email}님!
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  로그인 상태가 유지되었습니다.
                </p>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                >
                  로그아웃
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="center" className="mt-4">
            {/* 복지관 운영자 탭 콘텐츠 */}
            <p className="text-sm text-gray-500 mb-4 text-center">
              복지관 운영자는 별도의 승인 절차 후 서비스 이용이 가능합니다.
            </p>
            {!user ? (
              <Button onClick={loginWithGoogle} className="w-full bg-blue-500">
                <img
                  src="/path/to/google-icon.svg"
                  alt="Google"
                  className="h-4 w-4 mr-2"
                />
                구글로 로그인 / 가입
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">
                  안녕하세요, {user.displayName ?? user.email}님!
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  로그인 상태가 유지되었습니다.
                </p>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                >
                  로그아웃
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Login;
