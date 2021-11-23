import { datetime, HTTPError, ky } from "./deps.ts";
import { Amedas, AmedasData, AmedasInfo } from "./types.ts";

export function jsonToMap<T>(json: string): Map<string, T> {
  return new Map(Object.entries(JSON.parse(json)));
}

export function findMap<K, V, T>(
  map: Map<K, V>,
  func: (val: V, key: K) => T,
): T | null {
  for (const [key, value] of map) {
    return func(value, key);
  }
  return null;
}

const api = ky.create({
  prefixUrl: "https://www.jma.go.jp/bosai/amedas/",
  parseJson: jsonToMap,
});

// const amedasTable: Map<string, AmedasInfo> = jsonToMap(
//   await ky.get(
//     "https://www.jma.go.jp/bosai/amedas/const/amedastable.json",
//   ).text(),
// );

const amedasTable: Map<string, AmedasInfo> = await api.get(
  "const/amedastable.json",
).json();

// const amedasData: Map<string, AmedasData> = await (async () => {
//   let time = datetime().toZonedTime("Asia/Tokyo");
//   let response: string | undefined;
//   while (response === undefined) {
//     // TODO: it must be better the hour in the URL is current hour minus 1.
//     const dataUrl = `https://www.jma.go.jp/bosai/amedas/data/map/${
//       time.format("YYYYMMddHH0000")
//     }.json`;
//     // console.log(dataUrl);
//     response = await ky.get(dataUrl).text();
//     time = time.substract({ hour: 1 });
//   }
//   return jsonToMap<AmedasData>(response as string);
// })();

async function getAmedasData(): Promise<Map<string, AmedasData>> {
  const time = datetime().toZonedTime("Asia/Tokyo");
  try {
    return await api.get(`data/map/${time.format("YYYYMMddHH0000")}.json`)
      .json();
  } catch (err) {
    if (err instanceof HTTPError && err.response.status === 404) {
      return await api.get(
        `data/map/${
          time.substract({ hour: 1 }).format("YYYYMMddHH0000")
        }.json`,
      ).json();
    } else {
      throw err;
    }
  }
}

const amedasData: Map<string, AmedasData> = await getAmedasData();

export function getAmedas(location: string): Amedas | null {
  for (const [key, value] of amedasTable) {
    if (
      encodeURI(value.enName.toLowerCase()) ===
        encodeURI(location.toLowerCase())
    ) {
      return {
        info: amedasTable.get(key) as AmedasInfo,
        data: amedasData.get(key) as AmedasData,
      };
    }
  }
  return null;
}
