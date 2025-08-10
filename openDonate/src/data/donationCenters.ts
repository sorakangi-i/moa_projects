import type { DonationCenter } from '../types/location';

export const donationCenters: DonationCenter[] = [
  {
    id: '1',
    name: '강남구 사회복지관',
    address: '서울특별시 강남구 역삼동 123-45',
    district: '강남구',
    neighborhood: '역삼동',
    latitude: 37.5665,
    longitude: 127.0018,
    coordinates: [37.5665, 127.0018],
    description: '강남구 지역 주민을 위한 복지 서비스',
    imageUrl: '/images/center1.jpg',
  },
  {
    id: '2',
    name: '서초구 기부센터',
    address: '서울특별시 서초구 서초동 456-78',
    district: '서초구',
    neighborhood: '서초동',
    latitude: 37.4837,
    longitude: 127.0324,
    coordinates: [37.4837, 127.0324],
    description: '서초구 지역 기부 활동 지원',
    imageUrl: '/images/center2.jpg',
  },
  {
    id: '3',
    name: '마포구 후원센터',
    address: '서울특별시 마포구 합정동 789-12',
    district: '마포구',
    neighborhood: '합정동',
    latitude: 37.5492,
    longitude: 126.9136,
    coordinates: [37.5492, 126.9136],
    description: '마포구 지역 후원 활동',
    imageUrl: '/images/center3.jpg',
  },
  {
    id: '4',
    name: '종로구 기부센터',
    address: '서울특별시 종로구 종로1가 1-1',
    district: '종로구',
    neighborhood: '종로1가',
    latitude: 37.5704,
    longitude: 126.991,
    coordinates: [37.5704, 126.991],
    description: '종로구 지역 기부 활동',
    imageUrl: '/images/center4.jpg',
  },
];

// 특정 지역의 기부 센터만 필터링하는 함수
export function getCentersByLocation(
  district: string,
  neighborhood: string
): DonationCenter[] {
  return donationCenters.filter(
    (center) =>
      center.district === district && center.neighborhood === neighborhood
  );
}

// 가까운 기부 센터 찾기 (위도/경도 기반)
export function getNearbyCenters(
  lat: number,
  lng: number,
  radius: number = 5
): DonationCenter[] {
  return donationCenters.filter((center) => {
    const distance = calculateDistance(
      lat,
      lng,
      center.latitude,
      center.longitude
    );
    return distance <= radius;
  });
}

// 두 지점 간의 거리 계산 (km)
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
