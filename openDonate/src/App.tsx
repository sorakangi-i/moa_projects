import { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import BottomNavigation from './components/BottomNavigation';

function App() {
  // 현재 어떤 페이지를 보고 있는지 기억하는 변수
  const [currentPage, setCurrentPage] = useState('home');

  // 페이지 바꾸는 함수
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  // 어떤 페이지를 보여줄지 결정하는 함수
  const renderPage = () => {
    if (currentPage === 'home') {
      return <Home />;
    } else if (currentPage === 'login') {
      return <Login />;
    }
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* 선택된 페이지 보여주기 */}
      {renderPage()}

      {/* 하단 네비게이션 */}
      <BottomNavigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default App;
