import { getIndexNowUrls } from "./llms";

/** Stable IndexNow key — also served at /{INDEXNOW_KEY}.txt */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY ?? "6f8e4a2b9c1d3e5f7a8b9c0d1e2f3a4";

export const INDEXNOW_HOST = "www.swifthorseai.com";

export function getIndexNowKeyLocation(baseUrl: string): string {
  return `${baseUrl}/${INDEXNOW_KEY}.txt`;
}

export function buildIndexNowPayload(baseUrl: string) {
  return {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: getIndexNowKeyLocation(baseUrl),
    urlList: getIndexNowUrls(),
  };
}
