# CSV Combine

A small Node.js script that merges two CSV reports on a shared key column, with the second file's columns overriding the first's on conflict.

## Usage

Edit `file1`, `file2`, `outputFile`, and `keyColumn` at the top of [`combine-csv.js`](combine-csv.js), then:

```bash
npm install
node combine-csv.js
```

Input/output CSVs are gitignored — this repo only contains the merge script.
