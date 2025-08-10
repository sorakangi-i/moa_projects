import { useNavigate } from 'react-router-dom'; // useNavigate: Router로 페이지 이동
import { useAuth } from '../contexts/AuthContext'; // useAuth: Context에서 로그인 정보를 가져오는 기능
import { PAGES } from '../constants/pages'; //  페이지 주소 상수

function Nav() {
  const { user } = useAuth(); // 로그인정보를 이 단 한줄로 가져옴
  const navigate = useNavigate(); // 페이지 이동

  return (
    <nav>
      <div className="flex gap-4">
        <button onClick={() => navigate(PAGES.DONATE_CENTER)}>
          기부/후원센터
        </button>
        <button onClick={() => navigate(PAGES.COMMUNITY)}>커뮤니티</button>
        {user && (
          <button onClick={() => navigate(PAGES.MYPAGE)}>마이페이지</button>
        )}
      </div>
    </nav>
  );
}

export default Nav;
