export interface RoomResponse {
  id: number;
  stayId: number;
  name: string;
  price: number;
  sleeps: number;
  bedroomAmount: number;
  bathrooms: number;
  size: number | null;
}
