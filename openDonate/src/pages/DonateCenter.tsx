import { useState } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import CategoryDonationCenters from '../components/CategoryDonationCenters';
import DonationCentersView from '../components/DonationCentersView';
import LocationModal from '../components/LocationModal';

// 기부 카테고리 데이터 (All 포함)
const donationCategories = [
  { id: 'all', name: 'All', icon: '🏠' },
  { id: 'children', name: '아동/청소년', icon: '😊' },
  { id: 'elderly', name: '어르신', icon: '👴' },
  { id: 'family', name: '가족', icon: '👨‍👩‍👧‍👦' },
  { id: 'global', name: '지구촌', icon: '🌍' },
  { id: 'disabled', name: '장애인', icon: '♿' },
  { id: 'animals', name: '동물', icon: '🐱' },
  { id: 'environment', name: '환경', icon: '🌳' },
  { id: 'other', name: '기타', icon: '💬' },
];

function DonateCenter() {
  const { location } = useLocation();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 위치 표시 텍스트 생성
  const getLocationDisplay = () => {
    if (!location) return '위치 설정';

    const dongName = location.neighborhood || location.district;
    return `${dongName}(${location.district})`;
  };

  const handleLocationClick = () => {
    setIsModalOpen(true);
  };

  return (
    <section className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">기부/후원 센터</h2>

      {/* 위치 정보 표시 */}
      {user && location && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">📍</span>
              <button
                onClick={handleLocationClick}
                className="font-medium hover:text-blue-600 transition-colors"
              >
                {getLocationDisplay()}
              </button>
              <span className="text-gray-400">▼</span>
            </div>
            <span className="text-gray-500 text-sm">현재 위치 기준</span>
          </div>
        </div>
      )}

      {/* 카테고리별 기부 센터 탭 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">근처 복지관 찾기</h3>
          {!user && (
            <div className="text-sm text-gray-500">
              로그인하면 더 자세한 정보를 볼 수 있어요
            </div>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-6">
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

          {/* All 탭 - 모든 기부센터 표시 */}
          <TabsContent value="all">
            <DonationCentersView />
          </TabsContent>

          {/* 카테고리별 탭 */}
          {donationCategories.slice(1).map((category) => (
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

export default DonateCenter;
