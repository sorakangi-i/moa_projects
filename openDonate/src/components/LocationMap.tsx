import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useLocation } from '../contexts/LocationContext';
import { donationCenters } from '../data/donationCenters';
import L from 'leaflet';
// 마커 아이콘 설정
// 마커 아이콘 설정 (React에서 필요)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 지도 중심을 자동으로 이동시키는 컴포넌트
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

interface LocationMapProps {
  height?: string;
  showCenters?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

function LocationMap({
  height = '400px',
  showCenters = true,
  onLocationSelect,
}: LocationMapProps) {
  const { location, setCustomLocation } = useLocation();

  // 기본 중심점 (서울시청)
  const defaultCenter: [number, number] = [37.5665, 127.0018];
  const center = location
    ? (location.coordinates as [number, number])
    : defaultCenter;

  // 지도 클릭 시 위치 설정
  const handleMapClick = (e: any) => {
    if (onLocationSelect) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    } else {
      setCustomLocation(e.latlng.lat, e.latlng.lng);
    }
  };

  return (
    <div
      style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 사용자 위치 마커 */}
        {location && (
          <Marker position={location.coordinates}>
            <Popup>
              <div>
                <h4>📍 내 위치</h4>
                <p>
                  {location.district} {location.neighborhood}
                </p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  {location.address}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 기부 센터 마커들 */}
        {showCenters &&
          donationCenters.map((center) => (
            <Marker
              key={center.id}
              position={[center.latitude, center.longitude]}
              icon={
                new L.Icon({
                  iconUrl:
                    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                  shadowUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })
              }
            >
              <Popup>
                <div>
                  <h4>🏥 {center.name}</h4>
                  <p>{center.address}</p>
                  <p style={{ fontSize: '12px' }}>{center.description}</p>
                  <button
                    onClick={() =>
                      (window.location.href = `/donate?center=${center.id}`)
                    }
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    기부하기
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 지도 중심 업데이트 */}
        {location && <MapUpdater center={center} />}
      </MapContainer>
    </div>
  );
}

export default LocationMap;
