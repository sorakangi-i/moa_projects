import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import { getCentersByLocation } from '../data/donationCenters';
import LocationMap from './LocationMap';

type ViewMode = 'list' | 'map';

function DonationCentersView() {
  const { location, requestLocation } = useLocation();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const navigate = useNavigate();

  // 해당 지역의 기부 센터 가져오기
  const getLocalDonationCenters = () => {
    if (!location) return [];
    return getCentersByLocation(location.district);
  };

  const localCenters = getLocalDonationCenters();

  // 복지관 카드 클릭 처리
  const handleCenterClick = (centerId: string) => {
    navigate(`/donate-center-detail/${centerId}`);
  };

  // 모의 데이터 (나중에 실제 데이터로 교체)
  const getMockDonationData = () => ({
    totalAmount: Math.floor(Math.random() * 10000000) + 1000000, // 100만원 ~ 1000만원
    myAmount: Math.floor(Math.random() * 100000) + 10000, // 1만원 ~ 10만원
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  // 로그인하지 않은 경우 안내 메시지 표시
  if (!user) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔐</div>
          <h3 className="text-xl font-bold mb-2">로그인이 필요해요</h3>
          <p className="text-gray-600 mb-4">
            가까운 기부 센터를 찾으려면 로그인해주세요!
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
            {location
              ? `${location.district} 근처 기부 센터`
              : '가까운 기부 센터'}
          </h3>
          {location && localCenters.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {localCenters.length}개
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!location && (
            <button
              onClick={requestLocation}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              위치 설정
            </button>
          )}
          {location && localCenters.length > 0 && (
            <>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                리스트로 보기
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'map'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                지도 보기
              </button>
            </>
          )}
        </div>
      </div>

      {location ? (
        localCenters.length > 0 ? (
          viewMode === 'list' ? (
            // 리스트 뷰
            <div className="space-y-4">
              {localCenters.map((center) => {
                const donationData = getMockDonationData();
                return (
                  <div
                    key={center.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCenterClick(center.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">
                          {center.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {center.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">총 기부금</div>
                        <div className="font-semibold text-blue-600">
                          {formatCurrency(donationData.totalAmount)}원
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {center.categories?.map((category) => (
                          <span
                            key={category}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">내 기부액</div>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(donationData.myAmount)}원
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // 지도 뷰
            <div className="h-96 rounded-lg overflow-hidden">
              <LocationMap />
            </div>
          )
        ) : (
          <p className="text-gray-500 text-center py-8">
            해당 지역에 등록된 기부 센터가 없습니다.
          </p>
        )
      ) : (
        <p className="text-gray-500 text-center py-8">
          위치 정보를 설정하면 가까운 기부 센터를 찾을 수 있습니다.
        </p>
      )}
    </div>
  );
}

export default DonationCentersView;
