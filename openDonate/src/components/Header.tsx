import Nav from './Nav';

// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PAGES } from '../constants/pages';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import HambergerNav from './HambergerNav';

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate(PAGES.HOME);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };
  return (
    <header className="flex justify-between items-center p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-2xl cursor-pointer " onClick={() => navigate('/')}>
          <p className="text-xs">함께 만들어가는 따뜻한 세상</p>
          <h1 className="text-xl font-bold">🌟Open Donate</h1>
        </div>

        <Nav />
      </div>

      <div className="flex items-center gap-2">
        {/* 로그인 했을 때 */}
        {user && (
          <>
            <div>
              <img src={user.photoURL ?? ''} alt="프로필 이미지" />
              <p>{user.displayName}님</p>
            </div>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        )}

        {/* 로그인 하지 않았을 때 */}
        {!user && <button onClick={() => navigate(PAGES.LOGIN)}>로그인</button>}

        {/* 햄버거 메뉴 */}
        <HambergerNav />
      </div>
    </header>
  );
}

export default Header;
