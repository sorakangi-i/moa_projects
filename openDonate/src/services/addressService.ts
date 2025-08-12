// 카카오 주소 검색 API 서비스
const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

export interface AddressResult {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  category_name: string;
  distance: string;
  phone: string;
  place_url: string;
  x: string; // 경도
  y: string; // 위도
}

export const searchAddress = async (
  keyword: string
): Promise<AddressResult[]> => {
  if (!keyword.trim()) return [];

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
        keyword
      )}&size=10`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('주소 검색에 실패했습니다');
    }

    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    console.error('주소 검색 오류:', error);
    return [];
  }
};

// 주소에서 동 이름 추출
export const extractDongFromAddress = (address: string): string => {
  // "서울특별시 강남구 계림동" → "계림동"
  const parts = address.split(' ');
  return parts[parts.length - 1] || '';
};

// 주소에서 구 이름 추출
export const extractDistrictFromAddress = (address: string): string => {
  // "서울특별시 강남구 계림동" → "서울특별시 강남구"
  const parts = address.split(' ');
  if (parts.length >= 3) {
    return `${parts[0]} ${parts[1]}`;
  }
  return address;
};
