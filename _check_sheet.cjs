const fs = require("fs");
const { google } = require("googleapis");

const content = fs.readFileSync(".env.local", "utf8");
const env = {};
for (const line of content.split(/\r\n|\n/)) {
  const eq = line.indexOf("=");
  if (eq === -1) continue;
  const key = line.slice(0, eq);
  let value = line.slice(eq + 1);
  value = value.replace(/^"|"$/g, "");
  env[key] = value;
}

const auth = new google.auth.JWT({
  email: env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = env.GOOGLE_SHEETS_SPREADSHEET_ID;

async function main() {
  // Full raw grid, wide enough to see where data actually landed.
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "SearchResults!A1:Z5",
  });
  const rows = res.data.values || [];
  rows.forEach((row, i) => {
    console.log(`row ${i + 1} (${row.length} cells):`, JSON.stringify(row));
  });

  // Also check sheet metadata for column count / frozen rows etc.
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets(properties(title,gridProperties))",
  });
  console.log("sheets:", JSON.stringify(meta.data.sheets, null, 2));
}

main().catch((e) => console.error("ERROR:", e.message));
