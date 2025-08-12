import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import {
  getCentersByLocationAndCategory,
  getCentersByCategory,
} from '../data/donationCenters';
import LocationMap from './LocationMap';
import type { DonationCenter } from '../types/location';

interface CategoryDonationCentersProps {
  selectedCategory: string;
}

type ViewMode = 'list' | 'map';

function CategoryDonationCenters({
  selectedCategory,
}: CategoryDonationCentersProps) {
  const { location } = useLocation();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const navigate = useNavigate();

  // 선택된 카테고리의 기부 센터 가져오기
  const getFilteredCenters = (): DonationCenter[] => {
    if (location) {
      return getCentersByLocationAndCategory(
        location.district,
        selectedCategory
      );
    } else {
      return getCentersByCategory(selectedCategory);
    }
  };

  const filteredCenters = getFilteredCenters();

  // 복지관 카드 클릭 처리
  const handleCenterClick = (centerId: string) => {
    navigate(`/donate-center-detail/${centerId}`);
  };

  // 이미지 로드 실패 시 기본 이미지로 대체
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = '/images/default-center.jpg';
  };

  // 목업 기부 데이터
  const getMockDonationData = (centerId: string) => {
    const seed =
      centerId.charCodeAt(0) + centerId.charCodeAt(centerId.length - 1);
    const totalAmount = ((seed * 12345) % 10000000) + 1000000;
    const myAmount = ((seed * 67890) % 100000) + 10000;
    return { totalAmount, myAmount };
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('ko-KR');
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔐</div>
          <h3 className="text-xl font-bold mb-2">로그인이 필요해요</h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory} 카테고리의 기부 센터를 찾으려면 로그인해주세요!
          </p>
          <p className="text-sm text-gray-500">
            로그인하면 위치 기반 기부 센터 추천과
            <br />
            개인화된 기부 서비스를 이용할 수 있어요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-bold">
            {selectedCategory} 카테고리 기부 센터
          </h3>
          {filteredCenters.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {filteredCenters.length}개
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'list'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            리스트로 보기
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'map'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            지도 보기
          </button>
        </div>
      </div>

      {filteredCenters.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">
            해당 카테고리의 기부 센터가 없어요
          </h3>
          <p className="text-gray-600">
            {selectedCategory} 카테고리의 기부 센터가 아직 등록되지 않았습니다.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredCenters.map((center) => {
            const { totalAmount, myAmount } = getMockDonationData(center.id);

            return (
              <div
                key={center.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCenterClick(center.id)}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <img
                      src={center.imageUrl}
                      alt={center.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={handleImageError}
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">
                      {center.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {center.address}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {center.categories.map((category) => (
                        <span
                          key={category}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-700 text-sm mb-3">
                      {center.description}
                    </p>

                    {center.latestPost && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-sm text-gray-800">
                            {center.latestPost.title}
                          </h5>
                          {center.latestPost.isNew && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-1">
                          {center.latestPost.content}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {center.latestPost.date}
                        </p>
                      </div>
                    )}

                    <div className="text-right">
                      <div className="text-blue-600 font-semibold text-sm">
                        총 기부금: {formatCurrency(totalAmount)}원
                      </div>
                      <div className="text-green-600 font-semibold text-sm">
                        내 기부액: {formatCurrency(myAmount)}원
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-96">
          <LocationMap centers={filteredCenters} />
        </div>
      )}
    </div>
  );
}

export default CategoryDonationCenters;
