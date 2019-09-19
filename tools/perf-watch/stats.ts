export type Resource = {
  duration: number;
  name: string;
  hostname: string;
  size: number;
};

export type PageStats = {
  domComplete: number;
  domInteractive: number;
  duration: number;
  name: string;
  hostname: string;
  resources: Resource[];
  remoteResources: Resource[];
  size: number;
};

export async function getStats(page): Promise<PageStats> {
  const entries = JSON.parse(
    await page.evaluate(() => JSON.stringify(performance.getEntries()))
  );

  // console.log(entries);
  // const timing = JSON.parse(
  //   await page.evaluate(() => JSON.stringify(performance.timing))
  // );

  const navigation = entries.find(e => e.entryType === "navigation");
  const {
    domComplete,
    domInteractive,
    duration,
    encodedBodySize,
    name
  } = navigation;
  const hostname = new URL(name).hostname;

  const resources: Resource[] = entries
    .filter(e => e.entryType === "resource")
    .map(r => {
      const { name, duration, encodedBodySize } = r;
      return {
        name,
        hostname: new URL(name).hostname,
        duration,
        size: encodedBodySize
      };
    });

  const localResources = resources.filter(r => r.hostname === hostname);
  const remoteResources = resources.filter(r => r.hostname !== hostname);

  return {
    domComplete,
    domInteractive,
    duration,
    name,
    hostname,
    resources: localResources,
    remoteResources,
    size: encodedBodySize
  };
}

export function statsSummary(stats: PageStats[]) {
  return stats.map(stat => {
    const remoteResources = {};
    stat.remoteResources
      .filter(r => r.size > 0)
      .forEach(r => {
        if (!remoteResources[r.hostname]) {
          remoteResources[r.hostname] = [];
        }
        remoteResources[r.hostname].push(r);
      }, {});
    return {
      name: stat.name,
      duration: stat.duration,
      size: stat.size,
      resources: stat.resources.filter(r => r.size > 0),
      remoteResources
    };
  });
}
