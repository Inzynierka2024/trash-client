export interface UserModel {
    Username: string;
    Email?: string;
    Location: {
      City?: string;
      Country?: string;
    };
    Points?: number;
    TrashCollected?: number;
  }
  