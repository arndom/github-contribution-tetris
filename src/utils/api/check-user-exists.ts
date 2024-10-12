import { fetchYears } from './fetch';

/**
 * @param username GH username
 * @returns boolean based on number of years contributions
 */
export default async function checkUserExists(username: string) {
  const years = await fetchYears(username);

  if (years.length > 0) return true;

  return false;
}
