import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';

interface DonationCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const categories: DonationCategory[] = [
  {
    id: 'children',
    name: '아동/청소년',
    icon: '😊',
    description: '어린이와 청소년을 위한 기부',
  },
  {
    id: 'elderly',
    name: '어르신',
    icon: '👴',
    description: '노인을 위한 기부',
  },
  {
    id: 'family',
    name: '가족',
    icon: '👨‍👩‍👧‍👦',
    description: '가족을 위한 기부',
  },
  {
    id: 'global',
    name: '지구촌',
    icon: '🌍',
    description: '국제 구호를 위한 기부',
  },
  {
    id: 'disabled',
    name: '장애인',
    icon: '♿',
    description: '장애인을 위한 기부',
  },
  {
    id: 'animals',
    name: '동물',
    icon: '🐱',
    description: '동물 보호를 위한 기부',
  },
  {
    id: 'environment',
    name: '환경',
    icon: '🌳',
    description: '환경 보호를 위한 기부',
  },
  {
    id: 'others',
    name: '기타',
    icon: '💬',
    description: '기타 기부',
  },
];

interface DonationCategoriesProps {
  onCategorySelect?: (category: DonationCategory) => void;
  onLocationClick?: () => void;
}

function DonationCategories({
  onCategorySelect,
  onLocationClick,
}: DonationCategoriesProps) {
  const { location } = useLocation();
  const { user } = useAuth();

  // 동 이름만 추출하는 함수
  const getDongName = (address: string) => {
    const parts = address.split(' ');
    return parts[parts.length - 1];
  };

  // 위치 표시 형식
  const getLocationDisplay = () => {
    if (!location) return '위치 정보 없음';
    const dongName = getDongName(location.name);
    return `${dongName}(${location.district})`;
  };

  const handleCategoryClick = (category: DonationCategory) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    console.log('선택된 카테고리:', category.name);
  };

  const handleLocationClick = () => {
    if (onLocationClick) {
      onLocationClick();
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* 제목과 위치 정보 */}
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

      {/* 카테고리 1줄 */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-300 min-w-[80px] flex-shrink-0"
          >
            <span className="text-2xl mb-2">{category.icon}</span>
            <span className="text-xs font-medium text-gray-800 text-center">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DonationCategories;
