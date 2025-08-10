// src/pages/DonatePage.tsx
import { useLocation } from '../contexts/LocationContext';
import {
  getCentersByLocation,
  getNearbyCenters,
} from '../data/donationCenters';
import LocationMap from '../components/LocationMap';

function DonateCenter() {
  const { location } = useLocation();

  // 위치에 따른 기부 센터 필터링
  const getFilteredCenters = () => {
    if (!location) {
      return [];
    }

    // 정확한 동일 지역 센터 먼저 찾기
    const exactMatch = getCentersByLocation(
      location.district,
      location.neighborhood
    );

    if (exactMatch.length > 0) {
      return exactMatch;
    }

    // 없으면 가까운 센터 찾기
    return getNearbyCenters(location.latitude, location.longitude);
  };

  const filteredCenters = getFilteredCenters();

  return (
    <div>
      <h1>기부/후원 센터</h1>

      {/* 지도 섹션 */}
      <div style={{ marginBottom: '30px' }}>
        <h3>�� 지도에서 위치 확인하기</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
          지도를 클릭하면 해당 위치로 설정됩니다. 초록색 마커는 기부 센터입니다.
        </p>
        <LocationMap height="400px" showCenters={true} />
      </div>

      {!location && (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <p>
            �� 지도에서 위치를 클릭하거나, 위치 정보를 설정하면 가까운 기부
            센터를 보여드려요!
          </p>
        </div>
      )}

      {location && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#e8f5e8',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <p>
            �� {location.district} {location.neighborhood} 근처의 기부 센터
          </p>
        </div>
      )}

      {filteredCenters.length === 0 && location && (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <p>
            �� {location.district} {location.neighborhood} 근처에 기부 센터가
            없어요.
          </p>
          <p>다른 지역의 센터를 확인해보세요!</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        {filteredCenters.map((center) => (
          <div
            key={center.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: 'white',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>
              {center.name}
            </h3>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
              📍 {center.address}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              {center.description}
            </p>
            <button
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              기부하기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonateCenter;
