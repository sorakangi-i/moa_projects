import { createContext, useContext, useState, useEffect } from 'react';
import type { LocationInfo } from '../types/location';

interface LocationContextType {
  location: LocationInfo | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  setCustomLocation: (lat: number, lng: number) => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation은 LocationProvider 안에서 사용해야 해요!');
  }
  return context;
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 위도/경도를 주소로 변환하는 함수 (OpenStreetMap Nominatim 사용)
  const getAddressFromCoords = async (
    lat: number,
    lng: number
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ko`
      );
      const data = await response.json();

      if (data.display_name) {
        return data.display_name;
      }
      return '주소를 찾을 수 없습니다';
    } catch (error) {
      console.error('주소 변환 실패:', error);
      return '주소를 찾을 수 없습니다';
    }
  };

  // 주소에서 동 정보 추출하는 함수
  const extractDistrictInfo = (
    address: string
  ): { district: string; neighborhood: string } => {
    // 한국 주소 형식: "대한민국 서울특별시 강남구 역삼동 123-45"
    const parts = address.split(', ');

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.includes('구') && !part.includes('특별시')) {
        const district = part;
        const neighborhood = parts[i + 1] || '알 수 없음';
        return { district, neighborhood };
      }
    }

    return { district: '알 수 없음', neighborhood: '알 수 없음' };
  };

  // 위치 권한 요청 및 위치 가져오기
  const requestLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      // 위치 권한 확인
      const permission = await navigator.permissions.query({
        name: 'geolocation',
      });

      if (permission.state === 'denied') {
        setError(
          '위치 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.'
        );
        setLoading(false);
        return;
      }

      // 현재 위치 가져오기
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      const { latitude, longitude } = position.coords;
      await setCustomLocation(latitude, longitude);
    } catch (error) {
      console.error('위치 가져오기 실패:', error);
      setError('위치를 가져올 수 없습니다. 인터넷 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 사용자가 직접 위치 설정
  const setCustomLocation = async (lat: number, lng: number) => {
    try {
      const address = await getAddressFromCoords(lat, lng);
      const { district, neighborhood } = extractDistrictInfo(address);

      const locationInfo: LocationInfo = {
        latitude: lat,
        longitude: lng,
        address,
        district,
        neighborhood,
        coordinates: [lat, lng] as [number, number],
        name: `${district} ${neighborhood}`,
      };

      setLocation(locationInfo);
      localStorage.setItem('userLocation', JSON.stringify(locationInfo));
    } catch (error) {
      console.error('위치 설정 실패:', error);
      setError('위치를 설정할 수 없습니다.');
    }
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const locationInfo = JSON.parse(savedLocation);
        locationInfo.coordinates = [
          locationInfo.latitude,
          locationInfo.longitude,
        ];
        setLocation(locationInfo);
      } catch (error) {
        console.error('저장된 위치 정보 불러오기 실패:', error);
      }
    }
  }, []);

  const value = {
    location,
    loading,
    error,
    requestLocation,
    setCustomLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
