export interface TrashMetadata {
  Id: number;
  CreationTimestamp: Date;
  Latitude: number;
  Longitude: number;
  Picture: string;
  Size?: string;
  Type?: TrashSize;
}

export type TrashSize = "s" | "m" | "l";
