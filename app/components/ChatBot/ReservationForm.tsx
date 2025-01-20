import { useState } from 'react';
import { format, isWeekend, isBefore, parse, isAfter, setHours, setMinutes, isSunday, isSaturday } from 'date-fns';

interface ReservationFormProps {
  isDark?: boolean;
  onSubmit: (formData: ReservationData) => void;
}

interface ReservationData {
  date: string;
  time: string;
  phone: string;
  content: string;
  status: 'pending';
}

const AVAILABLE_TIMES = [
  '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

const HOLIDAYS_2025 = [
  '2025-01-01', // 신정
  '2025-01-27', // 대체공휴일
  '2025-01-28', // 설날
  '2025-01-29', // 설날
  '2025-01-30', // 설날
  '2025-03-01', // 삼일절
  '2025-05-05', // 어린이날
  '2025-05-15', // 석가탄신일
  '2025-06-06', // 현충일
  '2025-08-15', // 광복절
  '2025-10-03', // 개천절
  '2025-10-05', // 추석
  '2025-10-06', // 추석
  '2025-10-07', // 추석
  '2025-10-09', // 한글날
  '2025-12-25', // 성탄절
];

export default function ReservationForm({ isDark = false, onSubmit }: ReservationFormProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const today = new Date(2025, 0, 1); // 2025년 1월 1일부터 시작
  const maxDate = new Date(2025, 11, 31); // 2025년 12월 31일까지

  const isHoliday = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return HOLIDAYS_2025.includes(formattedDate);
  };

  const isDisabledDate = (date: Date) => {
    return isBefore(date, today) || isWeekend(date) || isHoliday(date) || isAfter(date, maxDate);
  };

  const getDateStyle = (date: Date) => {
    if (isHoliday(date)) return 'text-red-600 font-bold';
    if (isSunday(date)) return 'text-red-500';
    if (isSaturday(date)) return 'text-blue-500';
    return '';
  };

  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    
    const selectedDateObj = parse(selectedDate, 'yyyy-MM-dd', new Date());
    const currentDate = new Date();
    const times = AVAILABLE_TIMES.filter(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const timeDate = setMinutes(setHours(selectedDateObj, hours), minutes);
      return !isBefore(timeDate, currentDate);
    });

    return times;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const formData: ReservationData = {
        date: selectedDate,
        time: selectedTime,
        phone,
        content,
        status: 'pending'
      };

      await onSubmit(formData);
      
      setSelectedDate('');
      setSelectedTime('');
      setPhone('');
      setContent('');
    } catch (err) {
      setError('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Reservation error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1">예약일</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={format(today, 'yyyy-MM-dd')}
          max={format(maxDate, 'yyyy-MM-dd')}
          className={`w-full p-2 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${
            selectedDate && getDateStyle(parse(selectedDate, 'yyyy-MM-dd', new Date()))
          }`}
          required
        />
        {selectedDate && isDisabledDate(parse(selectedDate, 'yyyy-MM-dd', new Date())) && (
          <p className="text-red-500 text-sm mt-1">
            주말, 공휴일은 예약이 불가능합니다. 상담이 필요하신 경우 별도로 연락 부탁드립니다.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">시간</label>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className={`w-full p-2 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
          required
          disabled={!selectedDate || isDisabledDate(parse(selectedDate, 'yyyy-MM-dd', new Date()))}
        >
          <option value="">시간 선택</option>
          {getAvailableTimes().map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">연락처</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-0000-0000"
          pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
          className={`w-full p-2 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">상담 내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`w-full p-2 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
          rows={3}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        예약하기
      </button>
    </form>
  );
} 