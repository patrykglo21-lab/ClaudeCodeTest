import axios from 'axios';
import { DateRange, getDateRange } from './dateUtils';

const BASE_URL = 'https://connect.squareup.com/v2';

export async function getRevenue(range: DateRange): Promise<number> {
  const { start, end } = getDateRange(range);

  const body: Record<string, unknown> = {
    location_ids: [process.env.SQUARE_LOCATION_ID],
    query: {
      filter: {
        state_filter: { states: ['COMPLETED'] },
        ...(start && {
          date_time_filter: {
            created_at: {
              start_at: start.toISOString(),
              end_at: (end ?? new Date()).toISOString(),
            },
          },
        }),
      },
    },
  };

  const res = await axios.post(`${BASE_URL}/orders/search`, body, {
    headers: {
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  const orders: Array<{ total_money?: { amount?: number } }> = res.data?.orders ?? [];
  const totalCents = orders.reduce((sum, o) => sum + (o.total_money?.amount ?? 0), 0);
  return totalCents / 100;
}
