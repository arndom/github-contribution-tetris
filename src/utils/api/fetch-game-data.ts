import { DataStruct } from '../drawContributions';
import { fetchDataForYear, fetchYears } from './fetch';

export default async function fetchGameData(username: string, year: number) {
  const years = await fetchYears(username);

  if (years.length > 0) {
    const selectedYear = years.filter((y) => Number(y.text) === year)[0];

    return fetchDataForYear(String(selectedYear.href), Number(selectedYear.text)) as unknown as DataStruct;
  }

  return null;
}
