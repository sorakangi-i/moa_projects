import Nav from './Nav';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
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

  // 사용자 이름의 첫 글자를 가져오는 함수
  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-sm bg-white">
      <div className="flex items-center gap-4">
        <div className="text-2xl cursor-pointer" onClick={() => navigate('/')}>
          <p className="text-xs text-gray-600">함께 만들어가는 따뜻한 세상</p>
          <h1 className="text-xl font-bold text-blue-600">🌟Open Donate</h1>
        </div>

        <Nav />
      </div>

      <div className="flex items-center gap-4">
        {/* 로그인 했을 때 */}
        {user && (
          <div className="flex items-center gap-3">
            {/* 프로필 아바타 */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/mypage')}
            >
              <Avatar className="h-10 w-10 border-2 border-blue-200">
                <AvatarImage
                  src={user.photoURL || ''}
                  alt={user.displayName || '프로필'}
                />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-500">환영합니다</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.displayName || '사용자'}님
                </p>
              </div>
            </div>

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <span>로그아웃</span>
            </button>
          </div>
        )}

        {/* 로그인 하지 않았을 때 */}
        {!user && (
          <button
            onClick={() => navigate(PAGES.LOGIN)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            로그인
          </button>
        )}

        {/* 햄버거 메뉴 */}
        <HambergerNav />
      </div>
    </header>
  );
}

export default Header;
