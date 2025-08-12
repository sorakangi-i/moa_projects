import { useState, useEffect } from 'react';
import { useLocation } from '../contexts/LocationContext';
import {
  searchAddress,
  extractDongFromAddress,
  extractDistrictFromAddress,
  type AddressResult,
} from '../services/addressService';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const { requestLocation, setCustomLocation } = useLocation();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<AddressResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 검색어가 변경될 때마다 검색 실행
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchKeyword.trim().length >= 2) {
        setIsSearching(true);
        const results = await searchAddress(searchKeyword);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500); // 0.5초 딜레이

    return () => clearTimeout(searchTimeout);
  }, [searchKeyword]);

  const handleUseCurrentLocation = () => {
    requestLocation();
    onClose();
  };

  const handleAddressSelect = (address: AddressResult) => {
    const district = extractDistrictFromAddress(address.address_name);

    setCustomLocation({
      name: address.address_name,
      district: district,
      coordinates: [parseFloat(address.y), parseFloat(address.x)],
      latitude: parseFloat(address.y),
      longitude: parseFloat(address.x),
      address: address.address_name,
      neighborhood: extractDongFromAddress(address.address_name),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw] max-h-[80vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">지역 변경</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 검색 입력 필드 */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="지역이나 동네로 검색하기"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400">
            🔍
          </div>
        </div>

        {/* 검색 결과 */}
        {isSearching && (
          <div className="text-center py-4">
            <p className="text-gray-300">검색 중...</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mb-4">
            <h3 className="text-white font-medium mb-2">검색 결과</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleAddressSelect(result)}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="text-white font-medium">
                    {result.place_name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {result.address_name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 현재 위치 사용 버튼 */}
        <button
          onClick={handleUseCurrentLocation}
          className="w-full bg-orange-600 hover:bg-orange-700 text-orange-100 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <span className="text-lg">🎯</span>
          <span>현재 내 위치 사용하기</span>
        </button>
      </div>
    </div>
  );
}

export default LocationModal;
