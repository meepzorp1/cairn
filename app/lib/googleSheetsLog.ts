import { google } from "googleapis";

type CellValue = string | number;

function createSheetsClient() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY
    // .env values are sometimes pasted with a stray or mismatched
    // surrounding quote, which corrupts the PEM header if left in.
    ?.replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) return null;

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

/**
 * Dev/test instrumentation only. Appends rows to a tab in the
 * connected Google Sheet. No-ops when the sheet isn't configured —
 * callers should never let this block or fail the real request.
 */
export async function appendSheetRows(
  sheetRange: string,
  rows: CellValue[][],
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!spreadsheetId) return;

  const sheets = createSheetsClient();

  if (!sheets) return;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetRange,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: rows },
  });
}
