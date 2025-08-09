interface BottomNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

function BottomNavigation({
  currentPage,
  onPageChange,
}: BottomNavigationProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f0f0f0',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <button
        onClick={() => onPageChange('home')}
        style={{
          backgroundColor: currentPage === 'home' ? '#007bff' : '#fff',
          color: currentPage === 'home' ? '#fff' : '#000',
          border: '1px solid #ccc',
          padding: '10px 15px',
          borderRadius: '5px',
        }}
      >
        🏠 홈
      </button>

      <button
        onClick={() => onPageChange('login')}
        style={{
          backgroundColor: currentPage === 'login' ? '#007bff' : '#fff',
          color: currentPage === 'login' ? '#fff' : '#000',
          border: '1px solid #ccc',
          padding: '10px 15px',
          borderRadius: '5px',
        }}
      >
        🔑 마이페이지
      </button>
    </div>
  );
}

export default BottomNavigation;
