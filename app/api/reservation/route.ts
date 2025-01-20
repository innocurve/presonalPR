import { NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { date, time, phone, content } = data;

    // 동일한 예약이 있는지 확인
    const { data: existingReservation, error: checkError } = await supabase
      .from('reservations')
      .select()
      .eq('date', new Date(date).toISOString())
      .eq('time', time)
      .eq('phone', phone)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingReservation) {
      return NextResponse.json({
        success: false,
        error: '이미 동일한 예약이 존재합니다.'
      });
    }

    // 새 예약 저장
    const { error } = await supabase
      .from('reservations')
      .insert([
        {
          date: new Date(date).toISOString(),
          time,
          phone,
          content,
          status: 'pending'
        }
      ]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: '예약이 완료되었습니다. 확인 후 연락드리겠습니다.'
    });

  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json({
      success: false,
      error: '예약 처리 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
} 