export interface AddressResponse {
  id: number;
  streetAddress: string;
  extendedAddress: string | null;
  city: string;
  stateProvince: string | null;
  postalCode: string | null;
  countryCode: string;
}
