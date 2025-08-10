import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PAGES } from '../constants/pages';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';

function HambergerNav() {
  const { user } = useAuth(); // 로그인 정보
  const navigate = useNavigate(); // 페이지 이동

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle>메뉴</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {user && (
            <button
              onClick={() => navigate(PAGES.MYPAGE)}
              className="w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
            >
              마이페이지
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
          >
            홈
          </button>
          <button
            onClick={() => navigate(PAGES.DONATE_CENTER)}
            className="w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
          >
            기부/후원센터
          </button>

          <button
            onClick={() => navigate(PAGES.COMMUNITY)}
            className="w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
          >
            커뮤니티
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default HambergerNav;
