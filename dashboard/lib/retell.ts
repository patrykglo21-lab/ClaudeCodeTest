import axios from 'axios';
import { DateRange, getDateRange } from './dateUtils';

const BASE_URL = 'https://api.retellai.com';

export async function getCallCount(range: DateRange): Promise<number> {
  const { start, end } = getDateRange(range);

  const params: Record<string, string> = {};
  if (start) params.start_timestamp = Math.floor(start.getTime() / 1000).toString();
  if (end) params.end_timestamp = Math.floor(end.getTime() / 1000).toString();

  const res = await axios.get(`${BASE_URL}/v2/list-calls`, {
    headers: { Authorization: `Bearer ${process.env.RETELL_API_KEY}` },
    params,
  });

  return (res.data?.calls ?? res.data ?? []).length;
}
