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
    categories: ['아동/청소년', '어르신', '가족'],
    latestPost: {
      title: '2024년 1월 기부 현황 보고',
      content:
        '이번 달에는 총 150명의 어린이들이 따뜻한 겨울을 보낼 수 있도록 도움을 받았습니다.',
      date: '2024-01-15',
      isNew: true,
    },
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
    categories: ['지구촌', '환경'],
    latestPost: {
      title: '환경 보호 캠페인 성과',
      content:
        '지구촌 환경 보호를 위한 나무 심기 캠페인이 성공적으로 완료되었습니다.',
      date: '2024-01-10',
      isNew: false,
    },
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
    categories: ['장애인', '동물'],
    latestPost: {
      title: '반려동물 입양 성사',
      content: '이번 주에 5마리의 반려동물이 새로운 가족을 찾았습니다.',
      date: '2024-01-18',
      isNew: true,
    },
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
    categories: ['기타'],
    latestPost: null,
  },
  {
    id: '5',
    name: '북구 사회복지관',
    address: '광주광역시 북구 용봉동 123-45',
    district: '북구',
    neighborhood: '용봉동',
    latitude: 35.1595,
    longitude: 126.8526,
    coordinates: [35.1595, 126.8526],
    description: '북구 지역 주민을 위한 복지 서비스',
    imageUrl: '/images/center5.jpg',
    categories: ['아동/청소년', '어르신'],
    latestPost: {
      title: '어르신 봉사활동 후기',
      content:
        '지난 주에 진행된 어르신 봉사활동에서 많은 분들이 감사 인사를 전해주셨습니다.',
      date: '2024-01-20',
      isNew: true,
    },
  },
  {
    id: '6',
    name: '북구 기부센터',
    address: '광주광역시 북구 운암동 456-78',
    district: '북구',
    neighborhood: '운암동',
    latitude: 35.1689,
    longitude: 126.8723,
    coordinates: [35.1689, 126.8723],
    description: '북구 지역 기부 활동 지원',
    imageUrl: '/images/center6.jpg',
    categories: ['가족', '환경'],
    latestPost: {
      title: '가족 지원 프로그램 안내',
      content:
        '새로운 가족 지원 프로그램이 시작되었습니다. 많은 관심 부탁드립니다.',
      date: '2024-01-12',
      isNew: false,
    },
  },
];

// 특정 지역의 기부 센터만 필터링하는 함수 (구 단위)
export function getCentersByLocation(district: string): DonationCenter[] {
  return donationCenters.filter((center) => center.district === district);
}

// 특정 지역의 기부 센터만 필터링하는 함수 (동 단위)
export function getCentersByNeighborhood(
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

// 카테고리별 기부 센터 필터링하는 함수
export function getCentersByCategory(category: string): DonationCenter[] {
  return donationCenters.filter((center) =>
    center.categories.includes(category)
  );
}

// 특정 지역의 특정 카테고리 기부 센터 필터링하는 함수
export function getCentersByLocationAndCategory(
  district: string,
  category: string
): DonationCenter[] {
  return donationCenters.filter(
    (center) =>
      center.district === district && center.categories.includes(category)
  );
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
