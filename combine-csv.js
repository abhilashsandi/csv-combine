// combine-csv.js
const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const file1 = "report1755875243432.csv";
const file2 = "report1755875805435.csv";
const outputFile = "combined_report.csv";

const keyColumn = "Applicant: Applicant Number";

function loadCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

(async () => {
  try {
    const [rows1, rows2] = await Promise.all([loadCsv(file1), loadCsv(file2)]);

    // Index file2 rows by key
    const map2 = {};
    rows2.forEach((r) => {
      map2[r[keyColumn]] = r;
    });

    // Merge rows
    const mergedRows = rows1.map((r1) => {
      const r2 = map2[r1[keyColumn]] || {};
      return { ...r1, ...r2 }; // r2 overrides r1 if duplicate columns
    });

    // Collect all headers
    const headers = [
      ...new Set([
        ...Object.keys(rows1[0] || {}),
        ...Object.keys(rows2[0] || {}),
      ]),
    ];

    const csvWriter = createCsvWriter({
      path: outputFile,
      header: headers.map((h) => ({ id: h, title: h })),
    });

    await csvWriter.writeRecords(mergedRows);

    console.log(`✅ Combined CSV written to ${outputFile}`);
  } catch (err) {
    console.error("Error:", err);
  }
})();
