// import { gzip } from "node-gzip";

export async function start(browser, options: any = {}) {
  const { network } = options;

  const context = await browser.createIncognitoBrowserContext();
  // Create a new page in a pristine context.
  const page = await context.newPage();

  const client = await page.target().createCDPSession();

  // Set throttling property
  if (network) {
    await client.send("Network.emulateNetworkConditions", network);
  }

  return page;
  // await page.setRequestInterception(true);
  // // await page.setCacheEnabled(false);

  // page.on("request", interceptedRequest => {
  //   interceptedRequest.continue();
  // });

  // const logs = [];

  // page.on("requestfinished", async request => {
  //   const res = request.response();
  //   const frame = res.frame();
  //   const headers = res.headers();

  //   let length = Number(headers["content-length"]);
  //   if (!length) {
  //     try {
  //       const buffer = await res.buffer();
  //       length = (await gzip(buffer)).length;
  //     } catch (e) {}
  //   }

  //   logs.push({
  //     frame: frame.url(),
  //     url: request.url(),
  //     type: headers["content-type"],
  //     // length: headers["content-length"],
  //     // length: (await res.buffer()).length
  //     length: length / 1000
  //   });
  // });

  // return { page, logs };
}
