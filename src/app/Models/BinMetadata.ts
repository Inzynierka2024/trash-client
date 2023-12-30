import { BinTypes } from "./BinTypes";
import { BinStatus } from "./BinStatus";

export interface BinMetadata {
  Id: number;
  CreationTimestamp: Date;
  Latitude: number;
  Longitude: number;
  Type: BinTypes;
  Status: BinStatus;
  Username: string;
}
