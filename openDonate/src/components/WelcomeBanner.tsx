import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

function WelcomeBanner() {
  const { location } = useLocation();
  const { user } = useAuth();

  const bannerItems = [
    {
      id: 1,
      title: '기부로 더 나은 세상을 만들어요',
      description:
        user && location
          ? `${location.district} 근처의 기부 센터를 찾아보세요!`
          : '가까운 기부 센터를 찾아보세요!',
      icon: '💝',
      bgColor: 'bg-gradient-to-r from-blue-500 to-purple-600',
      textColor: 'text-white',
    },
    {
      id: 2,
      title: '커뮤니티에서 이야기 나누기',
      description: '다른 기부자들과 경험을 공유하고 영감을 받아보세요!',
      icon: '💬',
      bgColor: 'bg-gradient-to-r from-green-500 to-teal-600',
      textColor: 'text-white',
    },
    {
      id: 3,
      title: '나의 기부 기록 확인하기',
      description: '지금까지의 기부 활동을 한눈에 확인할 수 있어요!',
      icon: '📊',
      bgColor: 'bg-gradient-to-r from-orange-500 to-red-600',
      textColor: 'text-white',
    },
    {
      id: 4,
      title: '실시간 기부 현황',
      description:
        'OpenDonate를 통해 모인 총 기부금과 기부 횟수를 확인해보세요!',
      icon: '🎯',
      bgColor: 'bg-gradient-to-r from-pink-500 to-rose-600',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {bannerItems.map((item) => (
            <CarouselItem key={item.id}>
              <div
                className={`${item.bgColor} rounded-lg p-6 shadow-lg min-h-[200px] flex flex-col justify-center`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-3xl">{item.icon}</span>
                      <h3 className={`text-xl font-bold ${item.textColor}`}>
                        {item.title}
                      </h3>
                    </div>
                    <p
                      className={`${item.textColor} opacity-90 text-lg leading-relaxed`}
                    >
                      {item.description}
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-6xl opacity-20">{item.icon}</div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-white/80 hover:bg-white text-gray-800 border-gray-300" />
        <CarouselNext className="right-2 bg-white/80 hover:bg-white text-gray-800 border-gray-300" />
      </Carousel>
    </div>
  );
}

export default WelcomeBanner;
