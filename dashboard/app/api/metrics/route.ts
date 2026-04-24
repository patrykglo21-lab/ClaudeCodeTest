import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { getBookings } from '@/lib/bookings';
import { getCallCount } from '@/lib/retell';
import { DateRange } from '@/lib/dateUtils';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const range = (req.nextUrl.searchParams.get('range') ?? 'month') as DateRange;

  const [bookings, calls] = await Promise.all([
    getBookings(range),
    getCallCount(range),
  ]);

  const revenue = bookings.reduce((sum, b) => sum + (b.price ?? 0), 0);
  const appointments = bookings.length;
  const afterHours = bookings.filter((b) => b.after_hours).length;

  return NextResponse.json({ revenue, appointments, afterHours, calls });
}
