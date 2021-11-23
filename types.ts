
// type C only
export interface AmedasDataMini {
  temp: [number, number];
  snow1h: [number, number];
  snow6h: [number, number];
  snow12h: [number, number];
  snow24h: [number, number];
  sun10m: [number, number];
  sun1h: [number, number];
  precipitation10m: [number, number];
  precipitation1h: [number, number];
  precipitation3h: [number, number];
  precipitation24h: [number, number];
  windDirection: [number, number];
  wind: [number, number];
}

export interface AmedasData extends AmedasDataMini {
  pressure: [number, number];
  normalPressure: [number, number];
  humidity: [number, number];
  visibility: [number, number];
  snow: [number, number];
  weather: [number, number];
}

export interface AmedasInfo {
  type: "A" | "B" | "C" | "D" | "E" | "F";
  elems: string;
  lat: [number, number];
  lon: [number, number];
  alt: number;
  kjName: string;
  knName: string;
  enName: string;
}

// export type Amedas = AmedasData & AmedasInfo;
export interface Amedas {
  info: AmedasInfo;
  data: AmedasData;
}

