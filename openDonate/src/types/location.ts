import type { LatLngExpression } from 'leaflet';

export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string; // 주소
  district: string; // 지역
  neighborhood: string; // 동네
  coordinates: LatLngExpression; // 좌표
  name: string; // 이름
}

export interface LatestPost {
  title: string;
  content: string;
  date: string;
  isNew: boolean;
}

export interface DonationCenter {
  id: string; // 기부센터 고유 아이디
  name: string; // 이름
  address: string; // 주소
  district: string; // 지역
  neighborhood: string; // 동네
  latitude: number; // 위도
  longitude: number; // 경도
  coordinates: LatLngExpression; // 좌표
  description: string; // 설명
  imageUrl: string; // 이미지 주소
  categories: string[]; // 기부 카테고리들
  latestPost: LatestPost | null; // 최신 글 정보
}
