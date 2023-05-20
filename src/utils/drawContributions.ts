// Based on https://github.com/sallar/github-contributions-canvas/blob/master/src/index.ts

import { addWeeks, format, getMonth, isAfter, isBefore, parseISO, setDay, startOfWeek } from 'date-fns';

const themes = {
  standard: {
    background: '#ffffff',
    text: '#000000',
    meta: '#666666',
    grade4: '#216e39',
    grade3: '#30a14e',
    grade2: '#40c463',
    grade1: '#9be9a8',
    grade0: '#ebedf0'
  },

  githubDark: {
    background: '#101217',
    text: '#ffffff',
    meta: '#dddddd',
    grade4: '#27d545',
    grade3: '#10983d',
    grade2: '#00602d',
    grade1: '#003820',
    grade0: '#161b22'
  }
};

interface DataStructContribution {
  date: string;
  count: number;
  color: string;
  intensity: number;
}

export interface DataStruct {
  year: string;
  total: number;
  range: {
    start: string;
    end: string;
  };
  contributions: DataStructContribution[];
}

interface GraphEntry {
  date: string;
  info?: DataStructContribution;
}

interface Options {
  themeName?: keyof typeof themes;
  customTheme?: Theme;
  skipHeader?: boolean;
  skipAxisLabel?: boolean;
  username: string;
  data: DataStruct;
  fontFace?: string;
  footerText?: string;
}

interface DrawYearOptions extends Options {
  offsetX?: number;
  offsetY?: number;
}

interface DrawMetadataOptions extends Options {
  width: number;
  height: number;
}

interface Theme {
  [key: string]: string;

  background: string;
  text: string;
  meta: string;
  grade4: string;
  grade3: string;
  grade2: string;
  grade1: string;
  grade0: string;
}

function getPixelRatio() {
  if (typeof window === 'undefined') {
    return 1;
  }

  return window.devicePixelRatio || 1;
}

const DATE_FORMAT = 'yyyy-MM-dd';
export const boxWidth = 10;
export const boxMargin = 2;
export const textHeight = 15;
export const defaultFontFace = 'IBM Plex Mono';
export const headerHeight = 60;
export const canvasMargin = 0; // 20
export const yearHeight = textHeight + (boxWidth + boxMargin) * 7 + canvasMargin;
export const scaleFactor = getPixelRatio();

function getTheme(opts: Options): Theme {
  const { themeName, customTheme } = opts;
  if (customTheme) {
    return {
      background: customTheme.background ?? themes.standard.background,
      text: customTheme.text ?? themes.standard.text,
      meta: customTheme.meta ?? themes.standard.meta,
      grade4: customTheme.grade4 ?? themes.standard.grade4,
      grade3: customTheme.grade3 ?? themes.standard.grade3,
      grade2: customTheme.grade2 ?? themes.standard.grade2,
      grade1: customTheme.grade1 ?? themes.standard.grade1,
      grade0: customTheme.grade0 ?? themes.standard.grade0
    };
  }
  const name = themeName ?? 'standard';

  return themes[name] ?? themes.standard;
}

function getDateInfo(data: DataStruct, date: string) {
  return data.contributions.find((contrib) => contrib.date === date);
}

function drawYear(ctx: CanvasRenderingContext2D, opts: DrawYearOptions) {
  const { offsetX = 0, offsetY = 0, data } = opts;
  const theme = getTheme(opts);

  const today = new Date();
  const thisYear = format(today, 'yyyy');
  const lastDate = data.year === thisYear ? today : parseISO(data.range.end);
  const firstRealDate = parseISO(`${data.year}-01-01`);
  const firstDate = startOfWeek(firstRealDate);

  let nextDate = firstDate;
  const firstRowDates: GraphEntry[] = [];
  const graphEntries: GraphEntry[][] = [];

  while (isBefore(nextDate, lastDate)) {
    const date = format(nextDate, DATE_FORMAT);
    firstRowDates.push({
      date,
      info: getDateInfo(data, date)
    });
    nextDate = addWeeks(nextDate, 1);
  }

  graphEntries.push(firstRowDates);

  for (let i = 1; i < 7; i += 1) {
    graphEntries.push(
      firstRowDates.map((dateObj) => {
        const date = format(setDay(parseISO(dateObj.date), i), DATE_FORMAT);

        return {
          date,
          info: getDateInfo(data, date)
        };
      })
    );
  }

  const contributionGrid: number[][] = [];

  // 7
  for (let y = 0; y < graphEntries.length; y += 1) {
    contributionGrid[y] = [];

    // 52 | 53
    for (let x = 0; x < graphEntries[y].length; x += 1) {
      const day = graphEntries[y][x];
      const cellDate = parseISO(day.date);
      if (isAfter(cellDate, lastDate) || !day.info) {
        continue;
      }

      contributionGrid[y][x] = Number(day.info.intensity);

      const color = theme[`grade${day.info.intensity}`];
      ctx.fillStyle = color;
      ctx.fillRect(offsetX + (boxWidth + boxMargin) * x, offsetY + textHeight + (boxWidth + boxMargin) * y, 10, 10);
    }
  }

  // Draw Month Label
  let lastCountedMonth = 0;
  for (let y = 0; y < graphEntries[0].length; y += 1) {
    const date = parseISO(graphEntries[0][y].date);
    const month = getMonth(date) + 1;
    const firstMonthIsDec = month === 12 && y === 0;
    const monthChanged = month !== lastCountedMonth;
    if (!opts.skipAxisLabel && monthChanged && !firstMonthIsDec) {
      ctx.fillStyle = theme.meta;
      ctx.fillText(format(date, 'MMM'), offsetX + (boxWidth + boxMargin) * y, offsetY);
      lastCountedMonth = month;
    }
  }

  return contributionGrid;
}

function drawMetaData(ctx: CanvasRenderingContext2D, opts: DrawMetadataOptions) {
  const { username, width, height, footerText, data, fontFace = defaultFontFace } = opts;
  const theme = getTheme(opts);
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);

  if (footerText) {
    ctx.fillStyle = theme.meta;
    ctx.textBaseline = 'bottom';
    ctx.font = `10px '${fontFace}'`;
    ctx.fillText(footerText, canvasMargin, height - 5);
  }

  // chart legend
  let themeGrades = 5;
  ctx.fillStyle = theme.text;
  ctx.fillText('Less', width - canvasMargin - (boxWidth + boxMargin) * themeGrades - 55, 37);
  ctx.fillText('More', width - canvasMargin - 25, 37);

  for (let x = 0; x < 5; x += 1) {
    ctx.fillStyle = theme[`grade${x}`];
    ctx.fillRect(width - canvasMargin - (boxWidth + boxMargin) * themeGrades - 27, textHeight + boxWidth, 10, 10);
    themeGrades -= 1;
  }

  ctx.fillStyle = theme.text;
  ctx.textBaseline = 'hanging';
  ctx.font = `20px '${fontFace}'`;
  ctx.fillText(`@${username} on GitHub`, canvasMargin, canvasMargin);

  const totalContributions = data.total;

  ctx.font = `10px '${fontFace}'`;
  ctx.fillText(`Total Contributions: ${totalContributions}`, canvasMargin, canvasMargin + 30);

  ctx.beginPath();
  ctx.moveTo(canvasMargin, 55 + 10);
  ctx.lineTo(width - canvasMargin, 55 + 10);
  ctx.strokeStyle = theme.grade0;
  ctx.stroke();
}

export function drawContributions(canvas: HTMLCanvasElement, opts: Options) {
  const { data } = opts;
  let headerOffset = 0;
  if (!opts.skipHeader) {
    headerOffset = headerHeight;
  }
  const height = yearHeight + canvasMargin + headerOffset;
  const width = 52 * (boxWidth + boxMargin) + canvasMargin * 2;

  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2d context from Canvas');
  }

  ctx.scale(scaleFactor, scaleFactor);
  ctx.textBaseline = 'hanging';
  if (!opts.skipHeader) {
    drawMetaData(ctx, {
      ...opts,
      width,
      height,
      data
    });
  }

  const offsetY = canvasMargin;
  const offsetX = canvasMargin;

  const contributionGrid = drawYear(ctx, {
    ...opts,
    offsetX,
    offsetY,
    data
  });

  return contributionGrid;
}

export function drawSelectedContributions(canvas: HTMLCanvasElement, contributions: number[][]) {
  const theme = themes['githubDark'];

  const height = yearHeight - textHeight + canvasMargin;
  const width = 10 * (boxWidth + boxMargin) + canvasMargin * 2;

  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2d context from Canvas');
  }

  ctx.scale(scaleFactor, scaleFactor);
  ctx.textBaseline = 'hanging';

  const graph = contributions;

  // 7
  for (let y = 0; y < graph.length; y += 1) {
    // 10
    for (let x = 0; x < graph[y].length; x += 1) {
      const intensity = graph[y][x];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const color = theme[`grade${intensity}`];
      ctx.fillStyle = color;
      ctx.fillRect((boxWidth + boxMargin) * x, (boxWidth + boxMargin) * y, 10, 10);
    }
  }
}
