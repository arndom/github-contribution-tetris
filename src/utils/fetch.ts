import cheerio from "cheerio";
import _ from "lodash";

// github_dark
const COLOR_MAP = {
  0: "#161b22",
  1: "#003820",
  2: "#00602d",
  3: "#10983d",
  4: "#27d545"
};


async function fetchYears(username: string) {
  const data = await fetch(`https://github.com/${username}`);
  const $ = cheerio.load(await data.text());
  return $(".js-year-link")
    .get()
    .map((a) => {
      const $a = $(a);
      return {
        href: $a.attr("href"),
        text: $a.text().trim()
      };
    });
}

async function fetchDataForYear(url: string, year: number) {
  const data = await fetch(`https://github.com${url}`);
  const $ = cheerio.load(await data.text());
  const $days = $("svg.js-calendar-graph-svg rect.ContributionCalendar-day");
  const contribText = $(".js-yearly-contributions h2")
    .text()
    .trim()
    .match(/^([0-9,]+)\s/);
  let contribCount;
  if (contribText) {
    [contribCount] = contribText;
    contribCount = parseInt(contribCount.replace(/,/g, ""), 10);
  }

  return {
    year,
    total: contribCount || 0,
    range: {
      start: $($days.get(0)).attr("data-date"),
      end: $($days.get($days.length - 1)).attr("data-date")
    },
    contributions: (() => {
      const parseDay = (day: string) => {
        const $day = $(day);

        const date = String($day.attr("data-date")).split("-").map((d) => parseInt(d, 10));
        const color = $day.attr("data-level") !== undefined ? COLOR_MAP[$day.attr("data-level") as unknown as keyof typeof COLOR_MAP] : '';

        const value = {
          date: $day.attr("data-date"),
          count: parseInt($day.text().split(" ")[0], 10) || 0,
          color,
          intensity: $day.attr("data-level") || 0
        };

        return { date, value };
      };

      return $days.get().map((day: any) => parseDay(day).value);
    })()
  };
}

export async function fetchData(username: string, year: Number) {
  const years = await fetchYears(username);
  const selectedYear = years.filter((y) => Number(y.text) === year)[0]

  return fetchDataForYear(String(selectedYear.href), Number(selectedYear.text));
}
