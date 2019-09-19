import puppeteer from "puppeteer";

import { start } from "./page";
import { getStats, statsSummary } from "./stats";

async function fetchUrlOnce(browser, url, { speedMB = 24, latency = 50 }) {
  const page = await start(browser, {
    network: {
      offline: false,
      downloadThroughput: (speedMB * 1000 * 1024) / 8,
      uploadThroughput: ((speedMB / 2) * 1000 * 1024) / 8,
      latency
    }
  });

  // await page.goto("http://localhost:4321");
  await page.goto(url);
  // await page.screenshot({ path: "screenshot.png" });

  return getStats(page);
}

async function getFetchAverageDuration(browser, url, options) {
  const { times = 5, ...opts } = options;
  const durations = [];
  for (let c = 1; c <= times; c++) {
    const stats = await fetchUrlOnce(browser, url, opts);
    // console.log(stats);
    durations.push(stats.duration);
  }
  // console.log({ durations });
  return durations.reduce((total, d) => (total += d), 0) / times;
}

async function multiSpeeds(browser, url, options?: any) {
  const result = {};
  for (const speedMB of [2, 6, 12, 24, 36]) {
    const duration = await getFetchAverageDuration(browser, url, options);
    result[speedMB] = duration;
  }
  return result;
}

puppeteer.launch().then(async browser => {
  // const { page, logs } = await start(browser);

  // const result = await multiSpeeds(
  //   browser,
  //   "http://localhost:4321",
  // );
  // console.log(result);

  const stats = [];

  const page = await start(browser);
  await page.goto("http://localhost:4321");
  // console.log(await getStats(page));
  stats.push(await getStats(page));
  await page.type("input[type=username]", "lecstor");
  await page.type("input[type='password']", "password");
  await Promise.all([
    page.click("button[type='submit']"),
    page.waitForNavigation({ waitUntil: "networkidle0" })
  ]);
  // await page.waitFor(5000);
  await page.screenshot({ path: "screen.png" });
  // console.log(await getStats(page));
  stats.push(await getStats(page));

  console.log(JSON.stringify(statsSummary(stats), null, 2));

  console.table(
    statsSummary(stats).reduce(
      (result, page) => {
        result[page.name] = {
          timeMs: Math.round(page.duration),
          sizeKb:
            page.resources.reduce((result, r) => result + r.size, 0) / 1000
        };
        return result;
      },
      {} as any
    )
  );
  await browser.close();
});
