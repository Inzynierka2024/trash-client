export interface UserTrashMetadata {
    [x: string]: any;
    Id: number;
    CreationUsername: string;
    CreationTimestamp: Date;
    CollectionUsername: string;
    CollectionTimestamp: Date;
    Latitude: number;
    Longitude: number;
    Picture: string;
    Size?: string;
    Type?: string;
  }
  