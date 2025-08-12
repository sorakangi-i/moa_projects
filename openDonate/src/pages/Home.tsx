import { useState } from 'react';
import LocationModal from '../components/LocationModal';
import DonationStats from '../components/DonationStats';
import WelcomeBanner from '../components/WelcomeBanner';
import CategoryDonationCenters from '../components/CategoryDonationCenters';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';

// 기부 카테고리 데이터
const donationCategories = [
  { id: 'children', name: '아동/청소년', icon: '😊' },
  { id: 'elderly', name: '어르신', icon: '👴' },
  { id: 'family', name: '가족', icon: '👨‍👩‍👧‍👦' },
  { id: 'global', name: '지구촌', icon: '🌍' },
  { id: 'disabled', name: '장애인', icon: '♿' },
  { id: 'animals', name: '동물', icon: '🐱' },
  { id: 'environment', name: '환경', icon: '🌳' },
  { id: 'other', name: '기타', icon: '💬' },
];

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { location } = useLocation();
  const { user } = useAuth();

  const handleLocationClick = () => {
    setIsModalOpen(true);
  };

  // 위치 표시 텍스트 생성
  const getLocationDisplay = () => {
    if (!location) return '위치 설정';

    const dongName = location.neighborhood || location.district;
    return `${dongName}(${location.district})`;
  };

  return (
    <section className="p-4 space-y-6">
      {/* 메인 섹션: 슬라이더 배너 + 기부 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 슬라이더 배너 (2/3 너비) */}
        <div className="lg:col-span-2">
          <WelcomeBanner />
        </div>

        {/* 오른쪽: 기부 통계 (1/3 너비) */}
        <div className="lg:col-span-1">
          <DonationStats />
        </div>
      </div>

      {/* 카테고리별 기부 센터 탭 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">원하는 카테고리에 기부해요</h3>
          {user && (
            <button
              onClick={handleLocationClick}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <span className="text-blue-600">📍</span>
              <span>{getLocationDisplay()}</span>
              <span className="text-gray-400">▼</span>
            </button>
          )}
        </div>

        <Tabs defaultValue="children" className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6">
            {donationCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center space-y-1 p-3"
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-xs">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {donationCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <CategoryDonationCenters selectedCategory={category.name} />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* 지역 변경 모달 */}
      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

export default Home;
