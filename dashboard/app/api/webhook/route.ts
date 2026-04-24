import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  // Verify the shared secret so only your n8n workflow can write data
  const secret = req.headers.get('x-webhook-secret');
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const { error } = await supabase.from('bookings').insert({
    booking_date: body.booking_date ?? new Date().toISOString(),
    customer_name: body.customer_name ?? '',
    customer_phone: body.customer_phone ?? '',
    service: body.service ?? '',
    barber: body.barber ?? '',
    price: parseFloat(body.price) || 0,
    after_hours: body.after_hours === true || body.after_hours === 'true' || body.after_hours === 'yes',
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
