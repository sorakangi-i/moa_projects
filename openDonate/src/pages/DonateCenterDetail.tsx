import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react'; // useState import
import { donationCenters } from '../data/donationCenters';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'; // Dialog 컴포넌트 import
import { Input } from '../components/ui/input'; // Input 컴포넌트 import
import { Button } from '../components/ui/button'; // Button 컴포넌트 import

function DonateCenterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const center = donationCenters.find((c) => c.id === id);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [donationAmount, setDonationAmount] = useState(''); // 기부 금액 상태 관리

  if (!center) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2">복지관을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">
            요청하신 복지관 정보가 존재하지 않습니다.
          </p>
          <button
            onClick={() => navigate('/donate-center')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            기부센터 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 모의 가상 계좌 정보 (실제 구현 시 백엔드에서 받아와야 함)
  const virtualAccount = {
    bank: '국민은행',
    accountNumber: '123456-78-901234',
    depositor: '기부센터',
  };

  const handleDonate = () => {
    // 여기에 실제 기부 처리 로직 (API 호출 등)을 구현할 수 있습니다.
    if (donationAmount && Number(donationAmount) > 0) {
      alert(`${center.name}에 ${donationAmount}원 기부합니다.`);
      setIsModalOpen(false); // 모달 닫기
      setDonationAmount(''); // 입력값 초기화
    } else {
      alert('올바른 금액을 입력해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 뒤로가기 버튼 */}
      <div className="bg-white border-b">
        <div className="p-4">
          <button
            onClick={() => navigate('/donate-center')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <span>←</span>
            <span>기부센터 목록으로</span>
          </button>
        </div>
      </div>

      {/* 복지관 정보 */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* 헤더 */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold mb-2">{center.name}</h1>
              <p className="text-lg opacity-90">{center.address}</p>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="p-6">
            <Tabs defaultValue="news" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="intro">소개</TabsTrigger>
                <TabsTrigger value="news">소식</TabsTrigger>
                <TabsTrigger value="donation">모금/후원</TabsTrigger>
              </TabsList>

              {/* 소개 탭 */}
              <TabsContent value="intro" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">기본 정보</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">주소</label>
                      <p className="font-medium">{center.address}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">지역</label>
                      <p className="font-medium">
                        {center.district} {center.neighborhood}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">연락처</label>
                      <p className="font-medium">{center.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">기부 카테고리</h2>
                  <div className="flex flex-wrap gap-2">
                    {center.categories.map((category) => (
                      <span
                        key={category}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">소개</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {center.description}
                  </p>
                  {/* 상단 UI - 3개 패널 */}
                  <div className="bg-white">
                    <div className="grid grid-cols-3 gap-4 p-4">
                      {/* 왼쪽 패널 - 서비스 차량 */}
                      <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-4 relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="text-sm text-gray-600 mb-2">
                            02-3147-1472
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                            <span className="font-semibold text-gray-800">
                              복지관 번호
                            </span>
                          </div>
                        </div>
                        {/* 차량 이미지 효과 */}
                        <div className="absolute bottom-0 right-0 w-16 h-12 bg-white rounded-tl-lg opacity-80"></div>
                        <div className="absolute bottom-2 right-2 w-3 h-3 bg-orange-400 rounded-full"></div>
                      </div>

                      {/* 중간 패널 - 개인 케어 */}
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="text-sm text-gray-600 mb-2">
                            개인 케어 서비스
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">❤️</span>
                            </div>
                            <span className="font-semibold text-gray-800">
                              따뜻한 돌봄
                            </span>
                          </div>
                        </div>
                        {/* 케어 이미지 효과 */}
                        <div className="absolute bottom-0 right-0 w-12 h-8 bg-purple-200 rounded-tl-lg opacity-60"></div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 bg-purple-400 rounded-full"></div>
                      </div>

                      {/* 오른쪽 패널 - 목욕 지원 */}
                      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-4 relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="text-sm text-gray-600 mb-2">
                            목욕 지원 서비스
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">🛁</span>
                            </div>
                            <span className="font-semibold text-gray-800">
                              안전한 케어
                            </span>
                          </div>
                        </div>
                        {/* 목욕 이미지 효과 */}
                        <div className="absolute bottom-0 right-0 w-12 h-8 bg-blue-200 rounded-tl-lg opacity-60"></div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* 소식 탭 (기본 활성) */}
              <TabsContent value="news" className="space-y-6">
                {center.latestPost ? (
                  <div>
                    <h2 className="text-xl font-bold mb-4">복지관 소식</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">
                          {center.latestPost.title}
                        </h3>
                        {center.latestPost.isNew && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">
                        {center.latestPost.content}
                      </p>
                      <p className="text-sm text-gray-500">
                        {center.latestPost.date}
                      </p>
                      <p className="text-sm text-gray-500">
                        {center.latestPost.author}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📰</div>
                    <h3 className="text-lg font-semibold mb-2">
                      아직 소식이 없어요😢
                    </h3>
                    <p className="text-gray-600">
                      이 복지관의 최신 소식을 기다려주세요.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* 모음/후원 탭 */}
              <TabsContent value="donation" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">기부 현황</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        1,234
                      </div>
                      <div className="text-sm text-gray-600">총 기부자</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ₩12,345,678
                      </div>
                      <div className="text-sm text-gray-600">총 기부금</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">기부하기</h2>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-4">💝</div>
                      <h3 className="text-lg font-semibold mb-2">
                        {center.name}에 기부하기
                      </h3>
                      <p className="text-gray-600">
                        여러분의 따뜻한 마음이 더 나은 세상을 만들어갑니다.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* DialogTrigger를 Button으로 감싸서 버튼 클릭 시 모달이 열리도록 설정 */}
                      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                            기부하기
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <DialogHeader>
                            <DialogTitle>{center.name} 기부하기</DialogTitle>
                            <DialogDescription>
                              입금하실 금액을 입력하신 후, 아래 가상 계좌로
                              입금해주세요.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                입금액 (원)
                              </label>
                              <Input
                                type="number"
                                placeholder="예: 10000"
                                value={donationAmount}
                                onChange={(e) =>
                                  setDonationAmount(e.target.value)
                                }
                              />
                            </div>
                            <div className="bg-gray-100 p-4 rounded-md">
                              <h4 className="font-semibold text-gray-800 mb-2">
                                가상 계좌 정보
                              </h4>
                              <p className="text-sm text-gray-600">
                                은행: {virtualAccount.bank}
                              </p>
                              <p className="text-sm text-gray-600">
                                계좌번호: {virtualAccount.accountNumber}
                              </p>
                              <p className="text-sm text-gray-600">
                                예금주: {virtualAccount.depositor}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                              onClick={handleDonate}
                            >
                              확인
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                        정기 후원하기
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonateCenterDetail;
