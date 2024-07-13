// utils/readCSV.ts
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

interface Metadata {
  public_id: string;
  title: string;
  description: string;
}

export async function readCSV(filePath: string): Promise<Metadata[]> {
  const results: Metadata[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}
