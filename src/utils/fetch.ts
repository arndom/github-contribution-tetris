// move to the api of this
// https://github.com/sallar/github-contributions-chart
// https://github-contributions.vercel.app/
// https://github-contributions.vercel.app/api/v1/{username}

import cheerio from 'cheerio';
import { DataStruct } from './drawContributions';

// github_dark
const COLOR_MAP = {
  0: '#161b22',
  1: '#003820',
  2: '#00602d',
  3: '#10983d',
  4: '#27d545'
};

async function fetchYears(username: string) {
  const data = await fetch(`https://github.com/${username}?tab=contributions`, {
    headers: {
      'x-requested-with': 'XMLHttpRequest'
    }
  });

  const $ = cheerio.load(await data.text());

  return $('.js-year-link') // side bar of years
    .get()
    .map((a) => {
      const $a = $(a);
      const href = $a.attr('href');
      const githubUrl = new URL(`https://github.com${href}`);
      githubUrl.searchParams.set('tab', 'contributions');
      const formattedHref = `${githubUrl.pathname}${githubUrl.search}`;

      return {
        href: formattedHref,
        text: $a.text().trim()
      };
    });
}

async function fetchDataForYear(url: string, year: number) {
  const data = await fetch(`https://github.com${url}`, {
    headers: {
      'x-requested-with': 'XMLHttpRequest'
    }
  });
  const $ = cheerio.load(await data.text());

  const $days = $('table.ContributionCalendar-grid td.ContributionCalendar-day'); // actual-table individual-square-in-table

  const contribText = $('.js-yearly-contributions h2') // wrapper for table, now: js-calendar-graph
    .text()
    .trim()
    .match(/^([0-9,]+)\s/);
  let contribCount;
  if (contribText) {
    [contribCount] = contribText;
    contribCount = parseInt(contribCount.replace(/,/g, ''), 10);
  }

  return {
    year,
    total: contribCount || 0,
    range: {
      start: $($days.get(0)).attr('data-date'),
      end: $($days.get($days.length - 1)).attr('data-date')
    },
    contributions: (() => {
      const parseDay = (day: string) => {
        const $day = $(day);

        const date = String($day.attr('data-date'))
          .split('-')
          .map((d) => parseInt(d, 10));
        const color =
          $day.attr('data-level') !== undefined
            ? COLOR_MAP[$day.attr('data-level') as unknown as keyof typeof COLOR_MAP]
            : '';

        const value = {
          date: $day.attr('data-date'), // contribution date
          count: parseInt($day.text().split(' ')[0], 10) || 0, // then what is this, redundancy?
          color,
          intensity: $day.attr('data-level') || 0 // contribution count
        };

        return { date, value };
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return $days.get().map((day: any) => parseDay(day).value);
    })()
  };
}

export async function checkUserExists(username: string) {
  const years = await fetchYears(username);

  if (years.length > 0) return true;

  return false;
}

export async function fetchData(username: string, year: number) {
  const years = await fetchYears(username);

  if (years.length > 0) {
    const selectedYear = years.filter((y) => Number(y.text) === year)[0];

    return fetchDataForYear(String(selectedYear.href), Number(selectedYear.text)) as unknown as DataStruct;
  }

  return null;
}
