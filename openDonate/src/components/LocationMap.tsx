import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useLocation } from '../contexts/LocationContext';
import { donationCenters } from '../data/donationCenters';
import L from 'leaflet';

// 마커 아이콘 설정 (React에서 필요)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
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

interface DonationCenter {
  id: string;
  name: string;
  address: string;
  district: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  coordinates: [number, number];
  description: string;
  imageUrl: string;
  categories: string[];
}

interface LocationMapProps {
  height?: string;
  showCenters?: boolean;
  centers?: DonationCenter[];
  onLocationSelect?: (lat: number, lng: number) => void;
}

function LocationMap({
  height = '400px',
  showCenters = true,
  centers,
  onLocationSelect,
}: LocationMapProps) {
  const { location, setCustomLocationByCoords } = useLocation();

  // 기본 중심점 (서울시청)
  const defaultCenter: [number, number] = [37.5665, 127.0018];
  const center = location
    ? (location.coordinates as [number, number])
    : defaultCenter;

  // 표시할 기부 센터들 결정
  const centersToShow = centers || (showCenters ? donationCenters : []);

  // 지도 클릭 시 위치 설정
  const handleMapClick = (e: { latlng: { lat: number; lng: number } }) => {
    if (onLocationSelect) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    } else {
      setCustomLocationByCoords(e.latlng.lat, e.latlng.lng);
    }
  };

  return (
    <div
      style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}
      onClick={handleMapClick}
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
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
        {centersToShow.map((center) => (
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
                <h4>🏢 {center.name}</h4>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  {center.address}
                </p>
                <p style={{ fontSize: '11px', color: '#888' }}>
                  {center.description}
                </p>
                <div style={{ marginTop: '8px' }}>
                  {center.categories.map((category) => (
                    <span
                      key={category}
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        padding: '2px 6px',
                        margin: '2px',
                        borderRadius: '4px',
                        fontSize: '10px',
                      }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapUpdater center={center} />
      </MapContainer>
    </div>
  );
}

export default LocationMap;
