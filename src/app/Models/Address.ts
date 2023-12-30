export interface Address {
  address: {
    city: string;
    town: string;
    country: string;
    country_code: string;
    county: string;
    house_number: string;
    postcode: string;
    road: string;
    state: string;
    suburb: string;
  };
  boundingbox: string[];
  display_name: string;
  lat: string;
  licence: string;
  lon: string;
  osm_id: string;
  osm_type: string;
  place_id: string;
  place_rank: number;
  type: string;
}
