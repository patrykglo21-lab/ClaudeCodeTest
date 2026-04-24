import { google } from 'googleapis';
import { DateRange, isWithinRange } from './dateUtils';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });
}

export interface SheetRow {
  date: string;
  name: string;
  phone: string;
  service: string;
  barber: string;
  price: number;
  afterHours: boolean;
}

// ── Column indices ──────────────────────────────────────────────────────────
// Update these numbers to match your actual Google Sheet column order (0 = col A)
const COL = {
  date: 0,       // A — date of the booking/call
  name: 1,       // B — customer name
  phone: 2,      // C — customer phone
  service: 3,    // D — service booked
  barber: 4,     // E — barber assigned
  price: 5,      // F — price n8n writes from Retell knowledge base
  afterHours: 6, // G — "Yes"/"No" or TRUE/FALSE set by n8n
};
// ───────────────────────────────────────────────────────────────────────────

export async function getSheetRows(range: DateRange): Promise<SheetRow[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A2:Z',
  });

  const rows = res.data.values ?? [];

  return rows
    .map((row) => ({
      date: row[COL.date] ?? '',
      name: row[COL.name] ?? '',
      phone: row[COL.phone] ?? '',
      service: row[COL.service] ?? '',
      barber: row[COL.barber] ?? '',
      price: parseFloat(String(row[COL.price]).replace(/[^0-9.]/g, '')) || 0,
      afterHours:
        String(row[COL.afterHours]).toLowerCase() === 'yes' ||
        String(row[COL.afterHours]).toLowerCase() === 'true',
    }))
    .filter((row) => row.date && isWithinRange(row.date, range));
}
