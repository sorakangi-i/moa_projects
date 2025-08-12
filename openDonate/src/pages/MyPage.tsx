import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한국어 로케일
import { Calendar } from '../components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Separator } from '../components/ui/separator';

// 기부 내역 데이터 타입 정의 (실제로는 API를 통해 가져와야 함)
interface Donation {
  id: string;
  amount: number;
  date: Date;
  centerName: string;
}

// 목업 데이터 (실제 데이터가 없으므로 임시로 사용)
const mockDonations: Donation[] = [
  {
    id: '1',
    amount: 5000,
    date: new Date('2024-06-15'),
    centerName: '희망나눔 복지관',
  },
  {
    id: '2',
    amount: 10000,
    date: new Date('2024-07-01'),
    centerName: '사랑의 공동체',
  },
  {
    id: '3',
    amount: 7000,
    date: new Date('2024-07-20'),
    centerName: '행복한 동행 복지관',
  },
  {
    id: '4',
    amount: 20000,
    date: new Date('2024-08-05'),
    centerName: '희망나눔 복지관',
  },
];

function MyPage() {
  // 기부 내역 상태 관리 (초기값은 목업 데이터)
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  // 선택된 날짜 범위 상태
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // 총 기부 금액 계산 (선택된 기간에 따라 재계산)
  const totalAmount = useMemo(() => {
    return donations.reduce((sum, donation) => sum + donation.amount, 0);
  }, [donations]);

  // 날짜 범위에 따라 필터링된 기부 목록
  const filteredDonations = useMemo(() => {
    if (!dateRange.from && !dateRange.to) {
      return donations;
    }

    return donations.filter((donation) => {
      const donationDate = donation.date.getTime();
      const fromTime = dateRange.from?.setHours(0, 0, 0, 0) || -Infinity;
      const toTime = dateRange.to?.setHours(23, 59, 59, 999) || Infinity;

      return donationDate >= fromTime && donationDate <= toTime;
    });
  }, [donations, dateRange]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">마이페이지</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>총 기부 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-600">
              총 기부 금액
            </span>
            <span className="text-3xl font-bold text-green-600">
              ₩{totalAmount.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">내 기부 목록</h3>
        {/* 날짜 선택 팝오버 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-auto justify-start text-left font-normal"
            >
              {dateRange.from ? (
                dateRange.to ? (
                  `${format(dateRange.from, 'PPP', { locale: ko })} - ${format(
                    dateRange.to,
                    'PPP',
                    { locale: ko }
                  )}`
                ) : (
                  format(dateRange.from, 'PPP', { locale: ko })
                )
              ) : (
                <span>기간 선택</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              initialFocus
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={ko}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Separator className="mb-4" />

      {/* 기부 내역이 없을 때 */}
      {filteredDonations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-500 font-medium">
            아직 기부 내역이 없습니다.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            따뜻한 마음을 나누어 보세요!
          </p>
        </div>
      ) : (
        // 기부 내역이 있을 때
        <div className="space-y-4">
          {filteredDonations.map((donation) => (
            <Card key={donation.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {format(donation.date, 'yyyy년 M월 d일', { locale: ko })}{' '}
                    기부
                  </p>
                  <h4 className="text-lg font-semibold text-gray-800 mt-1">
                    {donation.centerName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-green-600">
                    ₩{donation.amount.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPage;
