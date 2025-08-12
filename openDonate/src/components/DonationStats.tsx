import { useAuth } from '../contexts/AuthContext';

function DonationStats() {
  const { user } = useAuth();

  // 현재 날짜 포맷팅
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    return `${year}.${month}.${day} ${hour}시 기준`;
  };

  // 전체 기부 통계 (로그인하지 않은 사용자용)
  const getTotalDonationStats = () => {
    return {
      totalAmount: 21378786975, // 약 213억원 (고정값)
      totalCount: 567923, // 약 56만건 (고정값)
    };
  };

  // 개인 기부 통계 (로그인한 사용자용)
  const getPersonalDonationStats = () => {
    if (!user) return { totalAmount: 0, totalCount: 0 };

    // 사용자별로 다른 데이터 (실제로는 DB에서 가져올 예정)
    const userId = user.uid;
    const seed = userId.charCodeAt(0) + userId.charCodeAt(userId.length - 1);

    // seed를 기반으로 일관된 랜덤 값 생성
    const randomAmount = ((seed * 12345) % 50000000) + 10000000; // 1000만원 ~ 6000만원
    const randomCount = ((seed * 67890) % 50) + 10; // 10회 ~ 60회

    return {
      totalAmount: randomAmount,
      totalCount: randomCount,
    };
  };

  const stats = user ? getPersonalDonationStats() : getTotalDonationStats();
  const currentDate = getCurrentDate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const formatCount = (count: number) => {
    return new Intl.NumberFormat('ko-KR').format(count);
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-6 shadow-sm h-full flex flex-col justify-center">
      {/* 상단 섹션 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">
            {user ? '나의 사랑의 기부 💖' : 'Open Donate와 함께 나눈 기부 💖'}
          </h3>
          <p className="text-pink-800 text-sm">{currentDate}</p>
        </div>
        <div className="text-4xl">{user ? '🍒' : '🌍'}</div>
      </div>

      {/* 통계 데이터 */}
      <div className="bg-white rounded-lg p-4 shadow-sm flex-1 flex flex-col justify-center">
        <div className="space-y-4">
          {/* 기부 금액 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">
              {user ? '내 기부금액' : '총 기부금액'}
            </span>
            <span className="text-xl font-bold text-pink-600">
              {formatCurrency(stats.totalAmount)}원
            </span>
          </div>

          {/* 기부 횟수 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">
              {user ? '내 기부횟수' : '총 기부횟수'}
            </span>
            <span className="text-xl font-bold text-pink-600">
              {formatCount(stats.totalCount)}건
            </span>
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      {!user && (
        <div className="mt-4 text-center">
          <p className="text-pink-700 text-sm">
            로그인하면 나의 기부 현황을 확인할 수 있어요!
          </p>
        </div>
      )}
    </div>
  );
}

export default DonationStats;
